// API Configuration
const DEFAULT_LOCAL_API = 'http://localhost:8080';

// When FE is opened via ngrok, browsers block XHR/fetch to loopback (localhost/127.0.0.1).
// In that case, call the backend through its ngrok HTTPS URL.
const resolveBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL;
  if (envBase) return envBase;

  if (typeof window !== 'undefined') {
    const host = window.location.hostname || '';
    if (host.endsWith('.ngrok-free.app') || host.endsWith('.ngrok.app')) {
      // Backend ngrok URL (update when your backend ngrok URL changes)
      return 'https://47d5-103-199-40-35.ngrok-free.app';
    }
  }

  return DEFAULT_LOCAL_API;
};

export const API_CONFIG = {
  // For local dev, hit JHipster Monolith directly
  baseURL: resolveBaseUrl(),
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth (JHipster Standard)
  AUTH: {
    LOGIN: '/api/authenticate',
    SIGNUP: '/api/register',
    ACTIVATE: '/api/activate',
    PROFILE: '/api/account',
  },

  // Courses
  COURSES: {
    LIST: '/api/courses',
    PUBLIC: '/api/courses/public',
    MY_COURSES: '/api/courses/my-courses',
    DETAIL: (id) => `/api/courses/${id}`,
    ACCESS: (id) => `/api/courses/${id}/access`,
    APPROVE: (id) => `/api/courses/${id}/approve`,
    REJECT: (id) => `/api/courses/${id}/reject`,
    PUBLISH: (id) => `/api/courses/${id}/publish`,
    UNPUBLISH: (id) => `/api/courses/${id}/unpublish`,
  },

  // Sections (part of a course)
  SECTIONS: {
    LIST: '/api/sections',
    DETAIL: (id) => `/api/sections/${id}`,
    BY_COURSE: '/api/sections', // Use with query param: ?courseId.equals=X
  },

  // Lessons (part of a section)
  LESSONS: {
    LIST: '/api/lessons',
    DETAIL: (id) => `/api/lessons/${id}`,
    BY_SECTION: '/api/lessons', // Use with query param: ?sectionId.equals=X
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

  // Payment Endpoints
  PAYMENT: {
    VNPAY: {
      CREATE: '/api/payments/vnpay/create',
      RETURN: '/api/payments/vnpay/return',
      IPN: '/api/payments/vnpay/ipn',
    },
  },

  // Admin Endpoints (Mapped to JHipster API)
  ADMIN: {
    USERS: {
      LIST: '/api/admin/users',
      CREATE: '/api/admin/users', // POST
      DETAIL: (login) => `/api/admin/users/${login}`, // GET (by login)
      UPDATE: () => `/api/admin/users`, // PUT (or /api/admin/users/{login})
      DELETE: (login) => `/api/admin/users/${login}`, // DELETE (by login)
    },
    // JHipster manages Authorities, not separate Roles/Permissions usually
    ROLES: {
      LIST: '/api/authorities',
    },
    PERMISSIONS: {
      LIST: '/api/permissions', // Placeholder if we add Permission entity later
    },
  },
};
