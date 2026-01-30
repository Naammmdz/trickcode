import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const url = config?.url || '';

    // Do not attach a potentially stale/invalid token to public auth endpoints.
    // If a Bearer token is present, Spring Security Resource Server may try to decode it
    // and return 401 even though the path is permitAll().
    const isAuthPublicEndpoint =
      url.includes('/iam-service/auth/token') ||
      url.includes('/iam-service/auth/register') ||
      url.includes('/auth/token') ||
      url.includes('/auth/register');

    if (!isAuthPublicEndpoint) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token.
        // Avoid hard redirect loops during auth flows; let the UI handle it.
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
      
      return Promise.reject({
        message: data?.message || 'An error occurred',
        status,
        data: data,
      });
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 0,
      });
    }
  }
);

export default apiClient;
