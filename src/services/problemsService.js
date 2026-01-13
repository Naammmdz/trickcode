import apiClient from './api';
import { API_ENDPOINTS } from '../config/api';

export const problemsService = {
  // Get paginated problems
  async getProblems(page = 1, filters = {}) {
    try {
      const params = {
        page,
        limit: 20,
        ...filters,
      };
      
      const response = await apiClient.get(API_ENDPOINTS.PROBLEMS.LIST, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single problem by ID
  async getProblemById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROBLEMS.DETAIL(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Submit solution
  async submitSolution(problemId, solution) {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.PROBLEMS.SUBMIT(problemId),
        solution
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get available filters
  async getFilters() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROBLEMS.FILTERS);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
