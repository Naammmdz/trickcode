import apiClient from './api';

export const adminDashboardService = {
  /**
   * Fetches the main statistics for the admin dashboard overview.
   */
  getStats: async () => {
    try {
      const response = await apiClient.get('/api/admin/statistics');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch admin dashboard stats:", error);
      throw error;
    }
  },

  /**
   * Fetches time-series data for dashboard charts.
   */
  getChartData: async () => {
    try {
      const response = await apiClient.get('/api/admin/statistics/charts');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch admin dashboard chart data:", error);
      throw error;
    }
  },
};
