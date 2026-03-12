import apiClient from './api';

/**
 * Service for code execution via backend proxy to local Judge0.
 */
export const codeExecutionService = {
    /**
     * Run code without test cases (free execution).
     * @param {string} sourceCode
     * @param {string} language - python | javascript | java
     * @param {string} stdin - optional stdin input
     */
    async runCode(sourceCode, language, stdin = '') {
        const { data } = await apiClient.post('/api/code/run', {
            sourceCode,
            language,
            stdin,
        });
        return data;
    },

    /**
     * Submit code against lesson test cases.
     * @param {number} lessonId
     * @param {string} sourceCode
     * @param {string} language
     */
    async submitCode(lessonId, sourceCode, language) {
        const { data } = await apiClient.post('/api/code/submit', {
            lessonId,
            sourceCode,
            language,
        });
        return data;
    },

    /**
     * Get submission history for a lesson.
     * @param {number} lessonId
     * @param {number} limit
     */
    async getSubmissions(lessonId, limit = 20) {
        const { data } = await apiClient.get(`/api/code/submissions/${lessonId}`, {
            params: { limit },
        });
        return data;
    },
};
