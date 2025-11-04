// 客户端限流器
// 防止单个访客过度使用 API

interface RateLimitConfig {
  maxRequests: number;  // 时间窗口内最大请求数
  windowMs: number;     // 时间窗口（毫秒）
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const STORAGE_KEY = 'bot_rate_limit';

// 默认配置：每小时最多 20 次请求
const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 20,
  windowMs: 60 * 60 * 1000, // 1 小时
};

/**
 * 检查是否超过限流
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export const checkRateLimit = (config: RateLimitConfig = DEFAULT_CONFIG) => {
  try {
    const now = Date.now();
    const stored = localStorage.getItem(STORAGE_KEY);
    
    let record: RateLimitRecord;
    
    if (stored) {
      record = JSON.parse(stored);
      
      // 如果已过时间窗口，重置计数
      if (now > record.resetTime) {
        record = {
          count: 0,
          resetTime: now + config.windowMs,
        };
      }
    } else {
      // 首次访问，初始化
      record = {
        count: 0,
        resetTime: now + config.windowMs,
      };
    }
    
    // 检查是否超限
    const allowed = record.count < config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - record.count);
    
    if (allowed) {
      // 增加计数
      record.count += 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    }
    
    return {
      allowed,
      remaining: allowed ? remaining - 1 : remaining,
      resetTime: record.resetTime,
    };
  } catch (error) {
    // 如果 localStorage 不可用，允许请求（降级处理）
    console.warn('Rate limiter failed:', error);
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetTime: Date.now() + config.windowMs,
    };
  }
};

/**
 * 格式化剩余时间
 */
export const formatResetTime = (resetTime: number): string => {
  const diff = resetTime - Date.now();
  if (diff <= 0) return '现在';
  
  const minutes = Math.ceil(diff / (60 * 1000));
  if (minutes < 60) return `${minutes} 分钟后`;
  
  const hours = Math.ceil(diff / (60 * 60 * 1000));
  return `${hours} 小时后`;
};

/**
 * 重置限流计数（用于测试或管理）
 */
export const resetRateLimit = () => {
  localStorage.removeItem(STORAGE_KEY);
};

