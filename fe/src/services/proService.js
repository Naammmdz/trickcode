import apiClient from './api';

/**
 * Pro Subscription service
 */
export const proSubscriptionService = {
  async getPlans() {
    const response = await apiClient.get('/api/subscriptions/plans');
    return response.data;
  },

  async getStatus() {
    const response = await apiClient.get('/api/subscriptions/status');
    return response.data;
  },

  async purchase(planType, bankCode = null) {
    const payload = { planType };
    if (bankCode) payload.bankCode = bankCode;
    const response = await apiClient.post('/api/subscriptions/purchase', payload);
    return response.data;
  },
};

/**
 * AI Learning service (for Student Pro)
 */
export const aiLearningService = {
  async getCodeHint(sourceCode, language, question) {
    const response = await apiClient.post('/api/ai/learning/code-hint', {
      type: 'code-hint', sourceCode, language, question,
    });
    return response.data;
  },

  async explainFailure(sourceCode, language, testInput, expectedOutput, actualOutput) {
    const response = await apiClient.post('/api/ai/learning/explain-fail', {
      type: 'explain-fail', sourceCode, language, testInput, expectedOutput, actualOutput,
    });
    return response.data;
  },

  async askCodeQuestion(sourceCode, language, question) {
    const response = await apiClient.post('/api/ai/learning/ask-code', {
      type: 'ask-code', sourceCode, language, question,
    });
    return response.data;
  },

  async askQuizQuestion(quizQuestion, studentAnswer, correctAnswer, question) {
    const response = await apiClient.post('/api/ai/learning/ask-quiz', {
      type: 'ask-quiz', quizQuestion, studentAnswer, correctAnswer, question,
    });
    return response.data;
  },
};
