import { buildSystemPrompt, truncateResponse } from './persona';
import type { Limits } from './quota';
export { BotQuota } from './quota';
export interface Env extends Limits {
  ENVIRONMENT: string;
  ALLOWED_ORIGINS: string;
  SILICONFLOW_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  QUOTA: DurableObjectNamespace;
}
const localHosts = new Set(['localhost', '127.0.0.1', '[::1]']);
const endpoint = 'https://api.siliconflow.cn/v1/chat/completions';

export async function handle(request: Request, env: Env, send: typeof fetch = fetch): Promise<Response> {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin') ?? '';
  const allowed = env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean);
  const local = env.ENVIRONMENT === 'development' && localHosts.has(url.hostname);
  const validLimits = [env.DAILY_LIMIT, env.CLIENT_DAILY_LIMIT, env.CLIENT_MINUTE_LIMIT]
    .every(value => Number.isInteger(Number(value)) && Number(value) > 0 && Number(value) <= 10000);
  const ready = Boolean(env.SILICONFLOW_API_KEY && env.QUOTA && validLimits && (local || env.TURNSTILE_SECRET_KEY));
  const headers = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Vary': 'Origin', 'X-Content-Type-Options': 'nosniff' });
  if (allowed.includes(origin)) headers.set('Access-Control-Allow-Origin', origin);
  const reply = (status: number, value: object) => new Response(JSON.stringify(value), { status, headers });
  if (url.pathname === '/api/health' && request.method === 'GET') return reply(ready ? 200 : 503, { ready });
  if (url.pathname !== '/api/chat') return reply(404, { error: '接口不存在。' });
  if (!allowed.includes(origin)) return reply(403, { error: '这个网站暂时无法访问此接口。' });
  if (request.method === 'OPTIONS') {
    headers.set('Access-Control-Allow-Methods', 'POST');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Access-Control-Max-Age', '86400');
    return new Response(null, { status: 204, headers });
  }
  if (request.method !== 'POST') return reply(405, { error: '请使用 POST 请求。' });
  if (!ready) return reply(503, { error: 'Starry 还没准备好，请稍后再来。' });
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply(415, { error: '请求格式不正确。' });
  let body: { message?: unknown; turnstileToken?: unknown };
  try {
    // Bound the stream itself, not only the caller-controlled Content-Length header.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { error: '请输入问题。' });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); return reply(413, { error: '问题太长了，请精简后再试。' }); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    body = JSON.parse(new TextDecoder().decode(bytes));
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('invalid body');
  } catch { return reply(400, { error: '请求格式不正确。' }); }
  if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 500)
    return reply(400, { error: '请输入 1–500 字的问题。' });
  try {
    const ip = request.headers.get('CF-Connecting-IP') ?? (local ? 'local' : '');
    if (!ip) return reply(403, { error: '无法验证请求来源，请刷新后再试。' });
    if (!local) {
      if (typeof body.turnstileToken !== 'string' || !body.turnstileToken || body.turnstileToken.length > 2048)
        return reply(403, { error: '请完成人机验证后再发送。' });
      const check = await send('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST', body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY!, response: body.turnstileToken, remoteip: ip }),
        signal: AbortSignal.timeout(10000),
      });
      if (!check.ok) return reply(503, { error: '验证服务暂时不可用，请稍后再试。' });
      const result = await check.json() as { success?: boolean; hostname?: string; action?: string };
      if (!result.success || result.hostname !== new URL(origin).hostname || result.action !== 'starry-chat')
        return reply(403, { error: '验证已失效，请重新验证后发送。' });
    }
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip));
    const client = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    const quota = await env.QUOTA.get(env.QUOTA.idFromName('global')).fetch('https://quota/reserve', { method: 'POST', body: client });
    if (!quota.ok) return reply(503, { error: 'Starry 暂时休息了，请稍后再试。' });
    const reservation = await quota.json() as { allowed: boolean; retryAfter: number };
    if (!reservation.allowed) {
      headers.set('Retry-After', String(reservation.retryAfter));
      return reply(429, { error: reservation.retryAfter <= 60 ? '提问太快了，请一分钟后再试。' : '今天的提问额度用完了，明天再来聊吧。' });
    }
    const upstream = await send(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.SILICONFLOW_API_KEY}` },
      body: JSON.stringify({ model: 'deepseek-ai/DeepSeek-V3.2', messages: [
        { role: 'system', content: buildSystemPrompt() }, { role: 'user', content: body.message.trim() },
      ], max_tokens: 300, temperature: 0.7, enable_thinking: false }),
      signal: AbortSignal.timeout(30000),
    });
    // Never forward provider errors, headers or credentials to the browser.
    if (!upstream.ok) return reply(502, { error: 'Starry 暂时无法回答，请稍后再试。' });
    const data = await upstream.json() as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) return reply(502, { error: '没有收到回答，请稍后再试。' });
    return reply(200, { content: truncateResponse(content.trim(), 200) });
  } catch { return reply(503, { error: '连接暂时中断，请稍后再试。' }); }
}
export default { fetch: (request: Request, env: Env) => handle(request, env) };
