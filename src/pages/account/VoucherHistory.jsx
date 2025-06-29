import { useState, useEffect } from 'react';
import { TicketIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { fetchVoucherHistory } from '../../services/api';
import toast from 'react-hot-toast';

const VoucherHistory = () => {
  const [filter, setFilter] = useState('all');
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Fetch voucher history from API
  const loadVoucherHistory = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchVoucherHistory(page, limit);
      
      if (response.success) {
        // Transform API data to match component structure
        const transformedVouchers = response.voucherHistory.map(item => ({
          id: item.voucherId._id,
          code: item.voucherId.code,
          title: item.voucherId.name,
          description: item.voucherId.description,
          discount: item.voucherId.discountValue,
          discountType: item.voucherId.discountType,
          maxDiscount: item.voucherId.maxDiscountAmount || item.voucherId.discountValue,
          minOrderValue: item.voucherId.minOrderAmount || 0,
          status: item.usedCount > 0 ? 'used' : (new Date(item.voucherId.endDate) < new Date() ? 'expired' : 'active'),
          usedDate: item.lastUsed ? new Date(item.lastUsed).toLocaleDateString('vi-VN') : null,
          expiryDate: item.voucherId.endDate,
          category: item.voucherId.category || 'all',
          usedCount: item.usedCount,
          isActive: item.voucherId.isActive,
          startDate: item.voucherId.startDate,
          usageLimit: item.voucherId.usageLimit,
          usageCount: item.voucherId.usageCount,
          userUsageLimit: item.voucherId.userUsageLimit
        }));
        
        setVouchers(transformedVouchers);
        setPagination(response.pagination);
      } else {
        setError('Failed to load voucher history');
        toast.error('Không thể tải lịch sử voucher');
      }
    } catch (err) {
      console.error('Error loading voucher history:', err);
      setError('An error occurred while loading voucher history');
      toast.error('Có lỗi xảy ra khi tải lịch sử voucher');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadVoucherHistory();
  }, []);

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadVoucherHistory(newPage, pagination.itemsPerPage);
    }
  };

  const filterOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'active', label: 'Còn hiệu lực' },
    { value: 'used', label: 'Đã sử dụng' },
    { value: 'expired', label: 'Đã hết hạn' }
  ];

  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    used: 'bg-gray-100 text-gray-800 border-gray-200',
    expired: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusLabels = {
    active: 'Còn hiệu lực',
    used: 'Đã sử dụng',
    expired: 'Hết hạn'
  };

  const categoryLabels = {
    all: 'Tất cả dịch vụ',
    cleaning: 'Dọn dẹp',
    repair: 'Sửa chữa',
    premium: 'Dịch vụ cao cấp'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDiscount = (voucher) => {
    if (voucher.discountType === 'percentage') {
      return `${voucher.discount}%`;
    }
    return formatCurrency(voucher.discount);
  };

  const filteredVouchers = vouchers.filter(voucher => {
    if (filter === 'all') return true;
    return voucher.status === filter;
  });

  const isExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="p-6">
      {/* Header with Filter */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lịch sử Voucher</h2>
          <p className="text-gray-600 mt-1">Quản lý và theo dõi các voucher của bạn</p>
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          {filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <TicketIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Tổng voucher</p>
              <p className="text-2xl font-bold text-blue-600">{vouchers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">Còn hiệu lực</p>
              <p className="text-2xl font-bold text-green-600">
                {vouchers.filter(v => v.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Đã sử dụng</p>
              <p className="text-2xl font-bold text-gray-600">
                {vouchers.filter(v => v.status === 'used').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-900">Hết hạn</p>
              <p className="text-2xl font-bold text-red-600">
                {vouchers.filter(v => v.status === 'expired').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vouchers List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => loadVoucherHistory()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Thử lại
            </button>
          </div>
        ) : filteredVouchers.length === 0 ? (
          <div className="text-center py-12">
            <TicketIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có voucher</h3>
            <p className="text-gray-500">Chưa có voucher nào trong danh mục này.</p>
          </div>
        ) : (
          filteredVouchers.map((voucher) => (
            <div key={voucher.id} className={`border rounded-lg p-6 transition hover:shadow-md ${statusColors[voucher.status]}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{voucher.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[voucher.status]}`}>
                      {statusLabels[voucher.status]}
                    </span>
                    {voucher.status === 'active' && isExpiringSoon(voucher.expiryDate) && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                        Sắp hết hạn
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{voucher.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Mã voucher: </span>
                      <code className="bg-gray-100 px-2 py-1 rounded font-mono font-medium">
                        {voucher.code}
                      </code>
                    </div>
                    <div>
                      <span className="text-gray-500">Danh mục: </span>
                      <span className="font-medium">{categoryLabels[voucher.category]}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Giá trị đơn tối thiểu: </span>
                      <span className="font-medium">{formatCurrency(voucher.minOrderValue)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Giảm tối đa: </span>
                      <span className="font-medium">{formatCurrency(voucher.maxDiscount)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Hạn sử dụng: </span>
                      <span className="font-medium flex items-center">
                        <CalendarDaysIcon className="w-4 h-4 mr-1" />
                        {new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    {voucher.usedDate && (
                      <div>
                        <span className="text-gray-500">Ngày sử dụng: </span>
                        <span className="font-medium">
                          {voucher.usedDate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-6 text-center">
                  <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {formatDiscount(voucher)}
                    </div>
                    <div className="text-xs text-gray-500 uppercase font-medium">
                      {voucher.discountType === 'percentage' ? 'Giảm giá' : 'Giảm tiền'}
                    </div>
                  </div>
                  
                  {voucher.status === 'active' && (
                    <button className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                      Sử dụng ngay
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          
          {[...Array(pagination.totalPages)].map((_, index) => {
            const page = index + 1;
            const isCurrentPage = page === pagination.currentPage;
            const shouldShow = 
              page === 1 || 
              page === pagination.totalPages || 
              (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1);
            
            if (!shouldShow) {
              if (page === pagination.currentPage - 2 || page === pagination.currentPage + 2) {
                return <span key={page} className="px-2 text-gray-400">...</span>;
              }
              return null;
            }
            
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                  isCurrentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tiếp
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {!loading && !error && vouchers.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} trong tổng số {pagination.totalItems} voucher
        </div>
      )}
    </div>
  );
};

export default VoucherHistory;
