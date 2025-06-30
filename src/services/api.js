import axios from 'axios';

// Get User Balance API
export const getUserBalance = async () => {
  try {
    const response = await axios.get('/users/balance');
    return response.data;
  } catch (error) {
    console.error('Error fetching user balance:', error);
    throw error;
  }
};

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

// Admin Dashboard Stats API
export const getAdminDashboardStats = async () => {
  try {
    const response = await axios.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    throw error;
  }
};

// Referral API Functions
export const generateReferralCode = async () => {
  try {
    const response = await axios.post('/referrals/generate-code');
    return response.data;
  } catch (error) {
    console.error('Error generating referral code:', error);
    throw error;
  }
};

export const useReferralCode = async (referralCode) => {
  try {
    const response = await axios.post('/referrals/use-code', {
      referralCode
    });
    return response.data;
  } catch (error) {
    console.error('Error using referral code:', error);
    // Throw the error with proper structure for the modal to handle
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      success: false,
      message: 'Có lỗi xảy ra khi sử dụng mã giới thiệu',
      error: error.message
    };
  }
};

export const getReferralInfo = async () => {
  try {
    const response = await axios.get('/referrals/info');
    return response.data;
  } catch (error) {
    console.error('Error fetching referral info:', error);
    throw error;
  }
};

export const validateReferralCode = async (referralCode) => {
  try {
    const response = await axios.get(`/referrals/validate/${referralCode}`);
    return response.data;
  } catch (error) {
    console.error('Error validating referral code:', error);
    throw error;
  }
};
