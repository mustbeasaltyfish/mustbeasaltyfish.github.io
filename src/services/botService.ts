export interface BotResponse {
  content: string;
  error?: string;
}

// Public URL only. Provider credentials live exclusively in the Worker.
const apiUrl = import.meta.env.VITE_BOT_API_URL || '/api/chat';
export async function getBotResponse(message: string, turnstileToken?: string): Promise<BotResponse> {
  if (!message.trim() || message.length > 500) return { content: '', error: '请输入 1–500 字的问题。' };
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.trim(), turnstileToken }),
      signal: AbortSignal.timeout(45000),
    });
    const data = await response.json() as BotResponse;
    if (!response.ok) return { content: '', error: data.error || 'Starry 暂时无法回答，请稍后再试。' };
    if (typeof data.content !== 'string' || !data.content) return { content: '', error: '没有收到回答，请稍后再试。' };
    return { content: data.content };
  } catch { return { content: '', error: '连接暂时中断，请稍后再试。' }; }
}
