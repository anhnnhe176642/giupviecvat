import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const VoucherModal = ({ voucher, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscountAmount: '',
    minOrderAmount: '',
    usageLimit: '',
    userUsageLimit: '1',
    startDate: '',
    endDate: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (voucher) {
      setFormData({
        code: voucher.code || '',
        name: voucher.name || '',
        description: voucher.description || '',
        discountType: voucher.discountType || 'percentage',
        discountValue: voucher.discountValue || '',
        maxDiscountAmount: voucher.maxDiscountAmount || '',
        minOrderAmount: voucher.minOrderAmount || '',
        usageLimit: voucher.usageLimit || '',
        userUsageLimit: voucher.userUsageLimit || '1',
        startDate: voucher.startDate ? new Date(voucher.startDate).toISOString().split('T')[0] : '',
        endDate: voucher.endDate ? new Date(voucher.endDate).toISOString().split('T')[0] : '',
        isActive: voucher.isActive !== undefined ? voucher.isActive : true
      });
    }
  }, [voucher]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate dates
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        throw new Error('Ngày kết thúc phải sau ngày bắt đầu');
      }

      // Validate discount value for percentage
      if (formData.discountType === 'percentage' && formData.discountValue > 100) {
        throw new Error('Phần trăm giảm giá không thể vượt quá 100%');
      }

      const submitData = {
        ...formData,
        discountValue: Number(formData.discountValue),
        maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        usageLimit: Number(formData.usageLimit),
        userUsageLimit: Number(formData.userUsageLimit),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      if (voucher) {
        await axios.put(`/vouchers/${voucher._id}`, submitData);
      } else {
        await axios.post('/vouchers', submitData);
      }

      onSave();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl bg-white rounded-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {voucher ? 'Cập nhật Voucher' : 'Tạo Voucher Mới'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã voucher *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 uppercase"
                placeholder="VD: SUMMER2024"
                required
                disabled={!!voucher} // Không cho phép sửa code khi cập nhật
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên voucher *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: Giảm giá mùa hè"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mô tả về voucher..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại giảm giá *
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="percentage">Phần trăm (%)</option>
                <option value="fixed">Số tiền cố định (VNĐ)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá trị giảm giá *
              </label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max={formData.discountType === 'percentage' ? 100 : undefined}
                required
              />
            </div>

            {formData.discountType === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giảm tối đa (VNĐ)
                </label>
                <input
                  type="number"
                  name="maxDiscountAmount"
                  value={formData.maxDiscountAmount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  placeholder="Để trống nếu không giới hạn"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đơn hàng tối thiểu (VNĐ)
              </label>
              <input
                type="number"
                name="minOrderAmount"
                value={formData.minOrderAmount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="0"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tổng số lượt sử dụng *
              </label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lượt sử dụng/người
              </label>
              <input
                type="number"
                name="userUsageLimit"
                value={formData.userUsageLimit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày kết thúc *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Kích hoạt voucher</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : voucher ? 'Cập nhật' : 'Tạo voucher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoucherModal;
