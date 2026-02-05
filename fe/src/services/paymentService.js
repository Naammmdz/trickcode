import apiClient from './api';

/**
 * Payment service for VNPay integration
 */
export const paymentService = {
  /**
   * Create VNPay payment for a course
   * @param {number} courseId - Course ID
   * @param {string} bankCode - Optional bank code: "VNPAYQR" | "VNBANK" | "INTCARD" | "NCB" | null
   * @returns {Promise<{orderId: number, txnRef: string, paymentUrl: string}>}
   */
  async createVnPayPayment(courseId, bankCode = null) {
    const payload = { courseId };
    if (bankCode) {
      payload.bankCode = bankCode;
    }
    const response = await apiClient.post('/api/payments/vnpay/create', payload);
    return response.data;
  },

  /**
   * Handle VNPay return callback
   * @param {Object} params - Query parameters from VNPay return URL
   * @returns {Promise<{signatureValid: boolean, txnRef: string, responseCode: string, orderStatus: string}>}
   */
  async handleVnPayReturn(params) {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/api/payments/vnpay/return?${queryString}`);
    return response.data;
  },
};
