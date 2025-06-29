import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import CategoryModal from '../../components/admin/CategoryModal';
import { getCategoryIconElement } from '../../utils/categoryHelpers';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [filterActive, setFilterActive] = useState('all'); // 'all', 'active', 'inactive'
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const itemsPerPage = 10;

  // Fetch categories from API
  const fetchCategories = async (page = 1, search = '', active = 'all') => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: itemsPerPage,
        search,
        isActive: active === 'all' ? undefined : active === 'active'
      };

      const response = await axios.get('/admin/categories', { params });
      console.log('Fetched categories:', response.data);
      if (response.data.success) {
        setCategories(response.data.categories);
        setTotalPages(response.data.pagination.totalPages);
        setTotalCategories(response.data.pagination.totalItems);
      } else {
        toast.error('Không thể tải danh sách danh mục');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Lỗi khi tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories with proper dependency management
  useEffect(() => {
    // Debounce chỉ cho search và filter
    const isSearchOrFilter = searchTerm !== '' || filterActive !== 'all';
    const delay = isSearchOrFilter ? 500 : 0;
    
    const timer = setTimeout(() => {
      fetchCategories(currentPage, searchTerm, filterActive);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, filterActive, refreshTrigger]);

  // Reset page to 1 when search term or filter changes (chỉ khi không phải là trang 1)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterActive]);

  // Helper function to trigger refresh
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // fetchCategories sẽ được gọi tự động thông qua useEffect khi currentPage thay đổi
  };

  // Handle create category
  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  // Handle edit category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };



  // Handle toggle active status
  const handleToggleActive = async (categoryId, currentStatus) => {
    try {
      const response = await axios.put(`/admin/categories/${categoryId}`, {
        isActive: !currentStatus
      });
      
      if (response.data.success) {
        toast.success(`${!currentStatus ? 'Kích hoạt' : 'Hủy kích hoạt'} danh mục thành công`);
        triggerRefresh();
      } else {
        toast.error('Không thể cập nhật trạng thái danh mục');
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
      toast.error('Lỗi khi cập nhật trạng thái danh mục');
    }
  };

  // Handle save category (create or update)
  const handleSaveCategory = async (categoryData) => {
    try {
      let response;
      
      if (editingCategory) {
        // Update existing category
        response = await axios.put(`/admin/categories/${editingCategory._id}`, categoryData);
      } else {
        // Create new category
        response = await axios.post('/admin/categories', categoryData);
      }
      
      if (response.data.success) {
        toast.success(`${editingCategory ? 'Cập nhật' : 'Tạo'} danh mục thành công`);
        setIsModalOpen(false);
        triggerRefresh();
      } else {
        toast.error(`Không thể ${editingCategory ? 'cập nhật' : 'tạo'} danh mục`);
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(`Lỗi khi ${editingCategory ? 'cập nhật' : 'tạo'} danh mục`);
    }
  };

  // Format price display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
              <p className="mt-2 text-sm text-gray-600">
                Quản lý danh mục dịch vụ trong hệ thống
              </p>
            </div>
            <button
              onClick={handleCreateCategory}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm danh mục
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Search and filters */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm danh mục..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterActive}
                    onChange={(e) => setFilterActive(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>
              
              {/* Statistics */}
              <div className="mt-4 text-sm text-gray-600">
                Tổng cộng: {totalCategories} danh mục
              </div>
            </div>
          </div>

          {/* Categories table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Danh mục
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá cơ bản
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cập nhật
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categories.map((category) => (
                        <tr key={category._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div
                                  className="h-10 w-10 rounded-full flex items-center justify-center bg-white"
                                >
                                  <div className="text-white">
                                    {getCategoryIconElement(category)}
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {category.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {category.description || 'Không có mô tả'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatPrice(category.price)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                category.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {category.isActive ? 'Hoạt động' : 'Không hoạt động'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(category.updatedAt).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                title="Chỉnh sửa"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleActive(category._id, category.isActive)}
                                className={`p-1 rounded ${
                                  category.isActive
                                    ? 'text-orange-600 hover:text-orange-900'
                                    : 'text-green-600 hover:text-green-900'
                                }`}
                                title={category.isActive ? 'Hủy kích hoạt' : 'Kích hoạt'}
                              >
                                {category.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Trước
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sau
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Hiển thị{' '}
                          <span className="font-medium">
                            {(currentPage - 1) * itemsPerPage + 1}
                          </span>{' '}
                          đến{' '}
                          <span className="font-medium">
                            {Math.min(currentPage * itemsPerPage, totalCategories)}
                          </span>{' '}
                          trong tổng số{' '}
                          <span className="font-medium">{totalCategories}</span> kết quả
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Trước
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                page === currentPage
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Sau
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {!loading && categories.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không tìm thấy danh mục nào
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm
                        ? 'Thử tìm kiếm với từ khóa khác hoặc tạo danh mục mới'
                        : 'Bắt đầu bằng cách tạo danh mục đầu tiên'}
                    </p>
                    <button
                      onClick={handleCreateCategory}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm danh mục
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </div>
  );
};

export default CategoryManagement;
