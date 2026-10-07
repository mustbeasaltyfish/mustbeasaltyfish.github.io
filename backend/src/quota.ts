export interface Limits {
  DAILY_LIMIT: string;
  CLIENT_DAILY_LIMIT: string;
  CLIENT_MINUTE_LIMIT: string;
}
interface Usage {
  day: number;
  total: number;
  clients: Record<string, { minute: number; count: number; daily: number }>;
}
export function reserve(usage: Usage | undefined, client: string, limits: Limits, now: number) {
  const day = Math.floor(now / 86400000);
  const minute = Math.floor(now / 60000);
  const current: Usage = usage?.day === day ? usage : { day, total: 0, clients: {} };
  const previous = current.clients[client];
  const entry = previous ?? { minute, count: 0, daily: 0 };
  if (entry.minute !== minute) { entry.minute = minute; entry.count = 0; }
  const dailyReset = Math.ceil(((day + 1) * 86400000 - now) / 1000);
  if (current.total >= Number(limits.DAILY_LIMIT) || entry.daily >= Number(limits.CLIENT_DAILY_LIMIT))
    return { usage: current, allowed: false, retryAfter: dailyReset };
  if (entry.count >= Number(limits.CLIENT_MINUTE_LIMIT))
    return { usage: current, allowed: false, retryAfter: Math.ceil(((minute + 1) * 60000 - now) / 1000) };
  current.total++;
  entry.count++;
  entry.daily++;
  current.clients[client] = entry;
  return { usage: current, allowed: true, retryAfter: 0 };
}

// One globally named object serializes reservations; failed provider calls also consume quota.
export class BotQuota {
  constructor(private state: DurableObjectState, private env: Limits) {}
  async fetch(request: Request): Promise<Response> {
    const client = await request.text();
    if (!/^[a-f0-9]{64}$/.test(client)) return new Response(null, { status: 400 });
    const result = await this.state.storage.transaction(async (storage) => {
      const usage = await storage.get<Usage>('usage');
      const next = reserve(usage, client, this.env, Date.now());
      if (next.allowed) await storage.put('usage', next.usage);
      return { allowed: next.allowed, retryAfter: next.retryAfter };
    });
    return Response.json(result);
  }
}
