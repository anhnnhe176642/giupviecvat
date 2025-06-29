import { useState, useEffect, useCallback } from 'react';
import { CalendarDaysIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { getPaymentHistory } from '../../services/api';

const TransactionHistory = () => {
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30days');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [error, setError] = useState(null);

  // Fetch transactions from API
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage
      };
      
      // Map filter values to API parameters
      if (filter !== 'all') {
        // Map frontend filter to backend category
        const categoryMap = {
          'deposit': 'deposit',
          'payment': 'job_payment',
          'refund': 'job_refund'
        };
        params.category = categoryMap[filter];
      }
      
      const response = await getPaymentHistory(params);
      
      if (response.success) {
        // Transform API data to match component structure
        const transformedTransactions = response.transactions.map(transaction => ({
          id: transaction._id,
          type: mapCategoryToType(transaction.category),
          amount: transaction.type === 'credit' ? transaction.amount : -transaction.amount,
          status: transaction.status,
          date: new Date(transaction.createdAt).toLocaleString('vi-VN'),
          description: transaction.description,
          reference: transaction._id.slice(-6).toUpperCase(),
          fee: 0, // Backend doesn't have fee field
          taskId: transaction.relatedId || null,
          category: transaction.category,
          balanceBefore: transaction.balanceBefore,
          balanceAfter: transaction.balanceAfter
        }));
        
        setTransactions(transformedTransactions);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Không thể tải lịch sử giao dịch. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [filter, pagination.currentPage, pagination.itemsPerPage]);

  // Map backend category to frontend type for display
  const mapCategoryToType = (category) => {
    const typeMap = {
      'deposit': 'deposit',
      'job_payment': 'payment',
      'job_refund': 'refund',
      'voucher_usage': 'refund',
      'welcome_bonus': 'deposit',
      'admin_adjustment': 'deposit',
      'withdrawal': 'payment'
    };
    return typeMap[category] || 'payment';
  };

  // Fetch data when component mounts or filter changes
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Reset to first page when filter changes
  useEffect(() => {
    if (pagination.currentPage !== 1) {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }
  }, [filter, pagination.currentPage]);

  const filterOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'deposit', label: 'Nạp tiền' },
    { value: 'payment', label: 'Thanh toán' },
    { value: 'refund', label: 'Hoàn tiền' }
  ];

  const dateRangeOptions = [
    { value: '7days', label: '7 ngày qua' },
    { value: '30days', label: '30 ngày qua' },
    { value: '90days', label: '3 tháng qua' },
    { value: '1year', label: '1 năm qua' }
  ];

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    completed: 'Thành công',
    pending: 'Đang xử lý',
    failed: 'Thất bại'
  };

  const typeColors = {
    deposit: 'text-green-600',
    payment: 'text-red-600',
    refund: 'text-blue-600'
  };

  const typeIcons = {
    deposit: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
      </svg>
    ),
    payment: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
      </svg>
    ),
    refund: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    )
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Math.abs(amount));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải giao dịch...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-500">{error}</p>
            <button 
              onClick={fetchTransactions}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có giao dịch</h3>
            <p className="text-gray-500">Chưa có giao dịch nào trong khoảng thời gian này.</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'deposit' ? 'bg-green-100' : 
                    transaction.type === 'payment' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <div className={typeColors[transaction.type]}>
                      {typeIcons[transaction.type]}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                      <span className="text-sm text-gray-400">#{transaction.reference}</span>
                      {transaction.taskId && (
                        <span className="text-sm text-blue-600">Task: {transaction.taskId}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className={`font-semibold text-lg ${typeColors[transaction.type]}`}>
                        {transaction.amount > 0 ? '+' : ''}
                        {formatCurrency(transaction.amount)}
                      </p>
                      {transaction.fee > 0 && (
                        <p className="text-sm text-gray-500">Phí: {formatCurrency(transaction.fee)}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[transaction.status]}`}>
                      {statusLabels[transaction.status]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {!loading && !error && transactions.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Tổng kết</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Tổng giao dịch: </span>
              <span className="font-medium">{transactions.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Tổng nạp: </span>
              <span className="font-medium text-green-600">
                {formatCurrency(
                  transactions
                    .filter(t => t.type === 'deposit' && t.status === 'completed')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Tổng chi: </span>
              <span className="font-medium text-red-600">
                {formatCurrency(
                  transactions
                    .filter(t => t.type === 'payment' && t.status === 'completed')
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm rounded-lg ${
                  page === pagination.currentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
