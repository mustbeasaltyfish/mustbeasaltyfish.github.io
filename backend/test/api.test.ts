import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { handle, type Env } from '../src/index';
import { reserve } from '../src/quota';
const origin = 'https://mustbeasaltyfish.github.io';
function environment(allowed = true): Env {
  return {
    ENVIRONMENT: 'production', ALLOWED_ORIGINS: origin, SILICONFLOW_API_KEY: 'private-test-key', TURNSTILE_SECRET_KEY: 'private-test-secret',
    DAILY_LIMIT: '200', CLIENT_DAILY_LIMIT: '20', CLIENT_MINUTE_LIMIT: '3',
    QUOTA: { idFromName: () => 'global', get: () => ({ fetch: async () => Response.json({ allowed, retryAfter: 60 }) }) } as unknown as DurableObjectNamespace,
  };
}
function request(body: unknown = { message: '你好', turnstileToken: 'test-token' }, site = origin) {
  return new Request('https://starry.workers.dev/api/chat', { method: 'POST', headers: { Origin: site, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1' }, body: JSON.stringify(body) });
}
const valid = { success: true, hostname: 'mustbeasaltyfish.github.io', action: 'starry-chat' };
const unexpected: typeof fetch = async () => { throw new Error('Must not call provider'); };
test('origin, method, preflight and body validation', async () => {
  assert.equal((await handle(request({}, 'https://evil.example'), environment(), unexpected)).status, 403);
  const preflight = await handle(new Request('https://starry.workers.dev/api/chat', { method: 'OPTIONS', headers: { Origin: origin } }), environment(), unexpected);
  assert.equal(preflight.status, 204); assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), origin);
  assert.equal((await handle(new Request('https://starry.workers.dev/api/chat', { headers: { Origin: origin } }), environment(), unexpected)).status, 405);
  for (const body of [null, [], {}, { message: '' }, { message: 'x'.repeat(501) }])
    assert.equal((await handle(request(body), environment(), unexpected)).status, 400);
  assert.equal((await handle(request({ message: 'x'.repeat(5000) }), environment(), unexpected)).status, 413);
});
test('production is closed without secrets, token or valid configuration', async () => {
  for (const changes of [{ TURNSTILE_SECRET_KEY: '' }, { SILICONFLOW_API_KEY: '' }, { DAILY_LIMIT: '' }, { ENVIRONMENT: 'development', TURNSTILE_SECRET_KEY: '' }])
    assert.equal((await handle(request(), { ...environment(), ...changes }, unexpected)).status, 503);
  assert.equal((await handle(request({ message: 'hello' }), environment(), unexpected)).status, 403);
});
test('Turnstile failure, hostname, action and duplicate rejection prevent model calls', async () => {
  for (const result of [{ ...valid, success: false }, { ...valid, hostname: 'evil.example' }, { ...valid, action: 'other' }]) {
    let calls = 0;
    const send: typeof fetch = async () => { calls++; return Response.json(result); };
    assert.equal((await handle(request(), environment(), send)).status, 403); assert.equal(calls, 1);
  }
});
test('quota rejection prevents provider requests and sets Retry-After', async () => {
  let calls = 0;
  const send: typeof fetch = async () => { calls++; return Response.json(valid); };
  const response = await handle(request(), environment(false), send);
  assert.equal(response.status, 429); assert.equal(response.headers.get('Retry-After'), '60'); assert.equal(calls, 1);
});
test('provider uses server prompt, fixed model, limited tokens; returns only trimmed answer', async () => {
  const send: typeof fetch = async (url, options) => {
    if (String(url).includes('siteverify')) return Response.json(valid);
    assert.equal(String(url), 'https://api.siliconflow.cn/v1/chat/completions');
    assert.equal(new Headers(options?.headers).get('Authorization'), 'Bearer private-test-key');
    const body = JSON.parse(String(options?.body));
    assert.equal(body.model, 'deepseek-ai/DeepSeek-V3.2'); assert.equal(body.max_tokens, 300);
    assert.equal(body.messages.length, 2); assert.equal(body.messages[0].role, 'system');
    assert.notEqual(body.messages[0].content, 'malicious prompt');
    assert.equal(body.messages[1].content, '你好');
    return Response.json({ choices: [{ message: { content: '答'.repeat(300) } }], secret: 'must not be returned' });
  };
  const response = await handle(request({ message: ' 你好 ', turnstileToken: 'test-token', model: 'expensive-model', system: 'malicious prompt' }), environment(), send);
  const data = await response.json(); assert.equal(response.status, 200); assert.equal(data.content.length, 200);
  assert.deepEqual(Object.keys(data), ['content']); assert.equal(response.headers.get('Cache-Control'), 'no-store');
});
test('provider failures and exceptions never leak details', async () => {
  for (const mode of ['http', 'throw', 'empty']) {
    const send: typeof fetch = async (url) => {
      if (String(url).includes('siteverify')) return Response.json(valid);
      if (mode === 'throw') throw new Error('private-test-key');
      if (mode === 'empty') return Response.json({});
      return new Response('private-test-key', { status: 401 });
    };
    const response = await handle(request(), environment(), send);
    assert.ok(response.status >= 500); assert.ok(!(await response.text()).includes('private-test-key'));
  }
});
test('Worker adapter ignores Cloudflare ExecutionContext as third fetch argument', async () => {
  assert.equal((await worker.fetch(request(), { ...environment(), SILICONFLOW_API_KEY: '' })).status, 503);
});
test('quota enforces minute, client daily, global daily and next-day reset', () => {
  const limits = { DAILY_LIMIT: '5', CLIENT_DAILY_LIMIT: '4', CLIENT_MINUTE_LIMIT: '2' };
  let result = reserve(undefined, 'one', limits, 1000);
  result = reserve(result.usage, 'one', limits, 2000); assert.equal(result.allowed, true);
  result = reserve(result.usage, 'one', limits, 3000); assert.equal(result.allowed, false); assert.equal(result.retryAfter, 57);
  result = reserve(result.usage, 'one', limits, 61000); assert.equal(result.allowed, true);
  result = reserve(result.usage, 'one', limits, 62000); assert.equal(result.allowed, true);
  result = reserve(result.usage, 'one', limits, 121000); assert.equal(result.allowed, false);
  result = reserve(result.usage, 'two', limits, 121000); assert.equal(result.allowed, true);
  result = reserve(result.usage, 'three', limits, 122000); assert.equal(result.allowed, false);
  result = reserve(result.usage, 'one', limits, 86400000); assert.equal(result.allowed, true); assert.equal(result.usage.total, 1);
});
