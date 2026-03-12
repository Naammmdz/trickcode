import apiClient from './api';

export const instructorDashboardService = {
    getStats: async () => {
        const response = await apiClient.get('/api/instructor/statistics');
        return response.data;
    },

    getChartData: async () => {
        const response = await apiClient.get('/api/instructor/statistics/charts');
        return response.data;
    },

    getPayouts: async () => {
        const response = await apiClient.get('/api/instructor/payouts');
        return response.data;
    },

    getEnrollments: async () => {
        const response = await apiClient.get('/api/instructor/enrollments');
        return response.data;
    },
};
