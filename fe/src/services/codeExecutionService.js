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
     * @param {number} lessonId - optional lesson ID for auto-wrapping LeetCode-style code
     */
    async runCode(sourceCode, language, stdin = '', lessonId = null) {
        const body = { sourceCode, language, stdin };
        if (lessonId != null) body.lessonId = lessonId;
        const { data } = await apiClient.post('/api/code/run', body);
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
