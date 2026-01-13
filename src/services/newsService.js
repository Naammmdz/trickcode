import apiClient from './api';
import { API_ENDPOINTS } from '../config/api';

export const newsService = {
  // Get paginated news articles
  async getArticles(page = 1, category = 'all', searchQuery = '') {
    try {
      const params = {
        page,
        limit: 10,
        ...(category !== 'all' && { category }),
        ...(searchQuery && { search: searchQuery }),
      };
      
      const response = await apiClient.get(API_ENDPOINTS.NEWS.LIST, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single article by ID
  async getArticleById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.NEWS.DETAIL(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get categories
  async getCategories() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.NEWS.CATEGORIES);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search articles
  async searchArticles(query, page = 1) {
    try {
      const params = { q: query, page, limit: 10 };
      const response = await apiClient.get(API_ENDPOINTS.NEWS.SEARCH, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Subscribe to newsletter
  async subscribe(email) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.NEWS.SUBSCRIBE, { email });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
