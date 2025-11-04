// 硅基流动API配置
export const SILICONFLOW_API_BASE_URL = 'https://api.siliconflow.cn/v1';
export const SILICONFLOW_API_KEY = import.meta.env.VITE_SILICONFLOW_API_KEY || '';

// 检查API key是否配置
export const isApiKeyConfigured = () => {
  return !!SILICONFLOW_API_KEY;
};

