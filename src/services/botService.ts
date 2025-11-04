import { SILICONFLOW_API_BASE_URL, SILICONFLOW_API_KEY, isApiKeyConfigured } from '../config/api';
import { buildSystemPrompt, truncateResponse } from '../utils/promptBuilder';

export interface BotResponse {
  content: string;
  error?: string;
}

/**
 * 调用硅基流动API获取Bot回答
 * @param userMessage 用户输入的问题
 * @returns Bot的回答内容
 */
export const getBotResponse = async (userMessage: string): Promise<BotResponse> => {
  // 检查API key是否配置
  if (!isApiKeyConfigured()) {
    return {
      content: '',
      error: 'API key未配置，请在.env文件中设置VITE_SILICONFLOW_API_KEY'
    };
  }

  // 验证输入
  if (!userMessage || userMessage.trim().length === 0) {
    return {
      content: '',
      error: '请输入问题'
    };
  }

  try {
    const systemPrompt = buildSystemPrompt();
    
    const response = await fetch(`${SILICONFLOW_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SILICONFLOW_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3.2-Exp',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userMessage.trim()
          }
        ],
        max_tokens: 300, // 限制token数量，确保回答不会太长
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        content: '',
        error: errorData.error?.message || `API请求失败: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    if (!content) {
      return {
        content: '',
        error: 'API返回空内容'
      };
    }

    // 截断回答，确保不超过200字
    const truncatedContent = truncateResponse(content, 200);

    return {
      content: truncatedContent
    };
  } catch (error) {
    console.error('Bot API调用错误:', error);
    return {
      content: '',
      error: error instanceof Error ? error.message : '网络请求失败，请稍后重试'
    };
  }
};

