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
      
    }
  },
  
  error: (message, error = null, additionalContext = {}) => {
    // Always log errors, even in prod (can be wired to Sentry later)
    
    
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
      
      
      
    } else if (Object.keys(additionalContext).length) {
      
    }
  }
};

export default logger;
