/**
 * Frontend Logger Utility
 * Provides structured logging for debugging component flows and API errors.
 */

const isDev = import.meta.env.MODE === 'development' || import.meta.env.DEV;

export const logger = {
  info: (message, data = {}) => {
    if (isDev) {
    }
  },
  
  warn: (message, data = {}) => {
    if (isDev) {
      // console.warn(`[WARN] ${message}`, Object.keys(data).length ? data : '');
    }
  },
  
  error: (message, error = null, additionalContext = {}) => {
    // Always log errors, even in prod (can be wired to Sentry later)
    // console.error(`[ERROR] ${message}`);
    
    if (error) {
      // Extensive error breakdown for Axios errors
      const breakdown = {
        message: error.message,
        name: error.name,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestUrl: error.config?.url,
        requestMethod: error.config?.method,
        requestData: error.config?.data,
        ...additionalContext
      };
      
      // console.error('Error Breakdown:', breakdown);
      // console.error('Full Error Object:', error);
    } else if (Object.keys(additionalContext).length) {
      // console.error('Context:', additionalContext);
    }
  }
};

export default logger;
