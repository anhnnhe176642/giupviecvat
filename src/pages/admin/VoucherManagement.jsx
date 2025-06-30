import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import VoucherModal from '../../components/admin/VoucherModal';
import axios from 'axios';

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = {
          page: pagination?.currentPage || 1,
          limit: pagination?.itemsPerPage || 10,
          search: searchTerm,
          isActive: filterActive === 'all' ? undefined : filterActive === 'active'
        };

        const response = await axios.get('/vouchers', { params });
        setVouchers(response.data.vouchers || []);
        setPagination(prev => ({
          ...prev,
          ...(response.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10
          })
        }));
        setError('');
      } catch (err) {
        setError('Không thể tải danh sách voucher');
        console.error('Error fetching vouchers:', err);
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.currentPage, pagination.itemsPerPage, searchTerm, filterActive, refreshTrigger]);

  const handleCreateVoucher = () => {
    setSelectedVoucher(null);
    setIsModalOpen(true);
  };

  const handleEditVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleDeleteVoucher = async (voucherId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) return;

    try {
      await axios.delete(`/vouchers/${voucherId}`);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setError('Không thể xóa voucher');
      console.error('Error deleting voucher:', err);
    }
  };

  const handleModalSave = () => {
    setIsModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getDiscountDisplay = (voucher) => {
    if (voucher.discountType === 'percentage') {
      return `${voucher.discountValue}%${voucher.maxDiscountAmount ? ` (Tối đa ${formatCurrency(voucher.maxDiscountAmount)})` : ''}`;
    }
    return formatCurrency(voucher.discountValue);
  };

  const getStatusBadge = (voucher) => {
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);
    
    if (!voucher.isActive) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Tạm dừng</span>;
    }
    
    if (now < startDate) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Chưa bắt đầu</span>;
    }
    
    if (now > endDate) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Hết hạn</span>;
    }
    
    if (voucher.usageCount >= voucher.usageLimit) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Hết lượt</span>;
    }
    
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Hoạt động</span>;
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Voucher</h1>
        <p className="text-gray-600 mt-1">Quản lý các mã giảm giá của hệ thống</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hoặc tên voucher..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Tạm dừng</option>
          </select>
          <button
            onClick={handleCreateVoucher}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Tạo voucher
          </button>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã / Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giảm giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn tối thiểu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sử dụng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vouchers.map((voucher) => (
                <tr key={voucher._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{voucher.code}</div>
                      <div className="text-sm text-gray-500">{voucher.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getDiscountDisplay(voucher)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {voucher.minOrderAmount > 0 ? formatCurrency(voucher.minOrderAmount) : 'Không'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {voucher.usageCount} / {voucher.usageLimit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(voucher)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditVoucher(voucher)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteVoucher(voucher._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {vouchers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không có voucher nào</p>
          </div>
        )}

        {/* Pagination */}
        {(pagination?.totalPages || 0) > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange((pagination?.currentPage || 1) - 1)}
                disabled={(pagination?.currentPage || 1) === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => handlePageChange((pagination?.currentPage || 1) + 1)}
                disabled={(pagination?.currentPage || 1) === (pagination?.totalPages || 1)}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{' '}
                  <span className="font-medium">
                    {vouchers.length > 0 ? ((pagination?.currentPage || 1) - 1) * (pagination?.itemsPerPage || 10) + 1 : 0}
                  </span>{' '}
                  đến{' '}
                  <span className="font-medium">
                    {vouchers.length > 0 ? Math.min((pagination?.currentPage || 1) * (pagination?.itemsPerPage || 10), pagination?.totalItems || 0) : 0}
                  </span>{' '}
                  của{' '}
                  <span className="font-medium">{pagination?.totalItems || 0}</span> kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange((pagination?.currentPage || 1) - 1)}
                    disabled={(pagination?.currentPage || 1) === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  {Array.from({ length: pagination?.totalPages || 1 }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === (pagination?.currentPage || 1)
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange((pagination?.currentPage || 1) + 1)}
                    disabled={(pagination?.currentPage || 1) === (pagination?.totalPages || 1)}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Voucher Modal */}
      {isModalOpen && (
        <VoucherModal
          voucher={selectedVoucher}
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default VoucherManagement;
