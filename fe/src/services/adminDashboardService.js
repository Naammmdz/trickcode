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
  getChartData: async (days = 30) => {
    try {
      const response = await apiClient.get('/api/admin/statistics/charts', {
        params: { days },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch admin dashboard chart data:", error);
      throw error;
    }
  },

  /** Download admin report as Excel (.xlsx) */
  exportExcel: async (days = 30) => {
    const response = await apiClient.get('/api/admin/statistics/export/excel', {
      params: { days },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const filename = response.headers['content-disposition']
      ?.split('filename="')[1]?.replace('"', '') || `admin-report-${new Date().toISOString().slice(0, 10)}.xlsx`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
