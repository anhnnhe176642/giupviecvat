import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../conext/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Chào mừng, {user?.name}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Thống kê */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">U</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tổng người dùng
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        1,234
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">T</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tổng công việc
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        567
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">$</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tổng doanh thu
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ₫12,345,678
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu quản lý */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Quản lý hệ thống
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={() => navigate('/admin/users')}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Quản lý người dùng
                </h3>
                <p className="text-sm text-gray-600">
                  Xem và quản lý tất cả người dùng
                </p>
              </div>

              <div 
                onClick={() => navigate('/admin/tasks')}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Quản lý công việc
                </h3>
                <p className="text-sm text-gray-600">
                  Xem và quản lý tất cả công việc
                </p>
              </div>

              <div 
                onClick={() => navigate('/admin/categories')}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Quản lý danh mục
                </h3>
                <p className="text-sm text-gray-600">
                  Quản lý danh mục dịch vụ
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Báo cáo
                </h3>
                <p className="text-sm text-gray-600">
                  Xem báo cáo và thống kê
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Cài đặt
                </h3>
                <p className="text-sm text-gray-600">
                  Cài đặt hệ thống
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
