// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // News
  NEWS: {
    LIST: '/news',
    DETAIL: (id) => `/news/${id}`,
    CATEGORIES: '/news/categories',
    SEARCH: '/news/search',
    SUBSCRIBE: '/news/subscribe',
  },
  
  // Problems
  PROBLEMS: {
    LIST: '/problems',
    DETAIL: (id) => `/problems/${id}`,
    SUBMIT: (id) => `/problems/${id}/submit`,
    FILTERS: '/problems/filters',
  },
  
  // Contests
  CONTESTS: {
    LIST: '/contests',
    DETAIL: (id) => `/contests/${id}`,
    REGISTER: (id) => `/contests/${id}/register`,
  },
  
  // Interview
  INTERVIEW: {
    TRACKS: '/interview/tracks',
    PRACTICE: '/interview/practice',
    SESSIONS: '/interview/sessions',
  },
  
  // Learn
  LEARN: {
    MODULES: '/learn/modules',
    LESSONS: (moduleId) => `/learn/modules/${moduleId}/lessons`,
    PROGRESS: '/learn/progress',
  },
};
