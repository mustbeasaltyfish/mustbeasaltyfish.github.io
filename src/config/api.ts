import { IS_GITHUB_PAGES } from './deploy';

// 硅基流动API配置
export const SILICONFLOW_API_BASE_URL = 'https://api.siliconflow.cn/v1';
export const SILICONFLOW_API_KEY = import.meta.env.VITE_SILICONFLOW_API_KEY || '';

// 检查API key是否配置
export const isApiKeyConfigured = () => {
  return !!SILICONFLOW_API_KEY;
};

// 检查是否在 GitHub Pages 环境
export const isGitHubPagesEnvironment = () => {
  // 如果配置文件中设置了 IS_GITHUB_PAGES 为 1，则认为是 Pages 环境
  if (IS_GITHUB_PAGES === 1) {
    return true;
  }
  // 否则检查域名
  if (typeof window !== 'undefined') {
    return window.location.hostname.includes('github.io');
  }
  return false;
};

