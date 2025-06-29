import axios from 'axios';

// Voucher History API
export const fetchVoucherHistory = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get('/users/voucher-history', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching voucher history:', error);
    throw error;
  }
};

// Deposit API
export const simulateDeposit = async (amount, paymentMethod = 'bank_transfer') => {
  try {
    const response = await axios.post('/users/deposit/simulate', {
      amount,
      paymentMethod
    });
    return response.data;
  } catch (error) {
    console.error('Error simulating deposit:', error);
    throw error;
  }
};

// Payment History API
export const getPaymentHistory = async (params = {}) => {
  try {
    const { page = 1, limit = 10, type, category } = params;
    const response = await axios.get('/users/payment-history', {
      params: { page, limit, type, category }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};
