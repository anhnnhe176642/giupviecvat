import { useState, useContext, useEffect } from 'react';
import { WalletIcon, ArrowUpIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../conext/AuthContext';
import { getPaymentHistory, getUserBalance } from '../../services/api';

const Balance = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const { user, isLoading } = useContext(AuthContext);
  
  // Fetch user balance from API
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoadingBalance(true);
        const response = await getUserBalance();
        
        if (response.success) {
          setBalance(response.balance);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        // Keep default balance (0) on error
      } finally {
        setLoadingBalance(false);
      }
    };

    if (user) {
      fetchBalance();
    }
  }, [user]);

  // Fetch recent transactions from API
  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        setLoadingTransactions(true);
        const response = await getPaymentHistory({ page: 1, limit: 5 });
        
        if (response.success) {
          // Transform API data to match component structure
          const transformedTransactions = response.transactions.map(transaction => ({
            id: transaction._id,
            type: mapCategoryToType(transaction.category),
            amount: transaction.type === 'credit' ? transaction.amount : -transaction.amount,
            date: new Date(transaction.createdAt).toLocaleDateString('vi-VN'),
            description: transaction.description,
            status: transaction.status
          }));
          
          setRecentTransactions(transformedTransactions);
        }
      } catch (error) {
        console.error('Error fetching recent transactions:', error);
        // Keep empty array on error
        setRecentTransactions([]);
      } finally {
        setLoadingTransactions(false);
      }
    };

    if (user) {
      fetchRecentTransactions();
    }
  }, [user]);

  // Map backend category to frontend type for display
  const mapCategoryToType = (category) => {
    const typeMap = {
      'deposit': 'deposit',
      'job_payment': 'payment',
      'job_refund': 'refund',
      'voucher_usage': 'refund',
      'welcome_bonus': 'deposit',
      "referral_bonus": 'deposit',
      'admin_adjustment': 'deposit',
      'withdrawal': 'payment'
    };
    return typeMap[category] || 'payment';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Show loading state while fetching balance or if auth is loading
  if (isLoading || loadingBalance) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium opacity-90">Số dư hiện tại</h2>
            <div className="flex items-center mt-2">
              <span className="text-3xl font-bold">
                {showBalance ? formatCurrency(balance) : '••••••••'}
              </span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="ml-3 p-1 hover:bg-white/20 rounded-full transition"
              >
                {showBalance ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <WalletIcon className="w-12 h-12 opacity-80" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link 
          to="/account/deposit"
          className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-center transition block"
        >
          <ArrowUpIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <span className="font-medium text-blue-900">Nạp tiền</span>
        </Link>
        <Link 
          to="/account/history"
          className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 text-center transition block"
        >
          <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-medium text-gray-900">Lịch sử</span>
        </Link>
        <Link 
          to="/account/vouchers"
          className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-center transition block"
        >
          <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <span className="font-medium text-green-900">Voucher</span>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Giao dịch gần đây</h3>
          <Link 
            to="/account/history" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Xem tất cả
          </Link>
        </div>
        
        {loadingTransactions ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Đang tải giao dịch...</p>
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-sm">Chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'deposit' ? 'bg-green-100' : 
                    transaction.type === 'payment' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {transaction.type === 'deposit' ? (
                      <ArrowUpIcon className="w-5 h-5 text-green-600" />
                    ) : transaction.type === 'payment' ? (
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <span className={`font-semibold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Balance;
