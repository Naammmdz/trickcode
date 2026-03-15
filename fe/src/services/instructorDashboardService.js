import apiClient from './api';

export const instructorDashboardService = {
    getStats: async () => {
        const response = await apiClient.get('/api/instructor/statistics');
        return response.data;
    },

    getChartData: async (days = 30) => {
        const response = await apiClient.get('/api/instructor/statistics/charts', {
            params: { days },
        });
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

    /** Download instructor report as Excel (.xlsx) */
    exportExcel: async (days = 30) => {
        const response = await apiClient.get('/api/instructor/statistics/export/excel', {
            params: { days },
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const filename = response.headers['content-disposition']
            ?.split('filename="')[1]?.replace('"', '') || `instructor-report-${new Date().toISOString().slice(0, 10)}.xlsx`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    /** Download instructor course overview as PDF */
    exportPdf: async () => {
        const response = await apiClient.get('/api/instructor/statistics/export/pdf', {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const filename = response.headers['content-disposition']
            ?.split('filename="')[1]?.replace('"', '') || `instructor-overview-${new Date().toISOString().slice(0, 10)}.pdf`;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
};
