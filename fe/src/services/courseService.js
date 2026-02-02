import apiClient from './api';
import { API_ENDPOINTS } from '../config/api';

export const courseService = {
    getCourses: async ({ page = 0, size = 10, sort = 'id,asc', q = '' }) => {
        try {
            const params = {
                page,
                size,
                sort,
            };

            // JHipster filtering (if filter enabled in JDL)
            // e.g. title.contains=...
            if (q) {
                params['title.contains'] = q;
            }

            // Note: apiClient is configured to return the full response object in api.js now (response) 
            // instead of just response.data, so we can access headers.
            const response = await apiClient.get(API_ENDPOINTS.COURSES.LIST, { params });

            const content = response.data;
            const totalElements = parseInt(response.headers['x-total-count'] || '0', 10);
            const totalPages = Math.ceil(totalElements / size);

            return {
                content,
                page,
                size,
                totalElements,
                totalPages
            };
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            // Fallback to empty list or throw
            return {
                content: [],
                page,
                size,
                totalElements: 0,
                totalPages: 0
            };
        }
    },

    getCourse: async (id) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.COURSES.DETAIL(id));
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch course ${id}:`, error);
            throw error;
        }
    },

    createCourse: async (courseData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.COURSES.LIST, courseData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateCourse: async (id, courseData) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.COURSES.DETAIL(id), courseData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateStatus: async (id, status, reason = null) => {
        // Implement as PATCH/PUT
        // Usually fetch, update, save
        const course = await courseService.getCourse(id);
        course.status = status;
        if (reason) course.rejectionReason = reason;

        return await courseService.updateCourse(id, course);
    }
};
