import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../conext/AuthContext';
import { getAdminDashboardStats } from '../../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  UserPlus, 
  Calendar,
  Tag,
  Gift,
  UserCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format API data for charts
  const formatChartData = (apiData) => {
    if (!apiData) return { dailyJobsData: [], newUsersData: [], jobsByCategoryData: [] };

    // Format daily jobs data - handle both 7 days and 30 days data
    const jobsData = apiData.charts.jobsCreatedIn30Days || apiData.charts.jobsCreatedIn7Days || [];
    const dailyJobsData = jobsData.map(item => ({
      date: `${item._id.day}/${item._id.month}`,
      jobs: item.count
    }));

    // Format new users data - handle both 7 days and 30 days data
    const usersData = apiData.charts.usersRegisteredIn30Days || apiData.charts.usersRegisteredIn7Days || [];
    const newUsersData = usersData.map(item => ({
      date: `${item._id.day}/${item._id.month}`,
      users: item.count
    }));

    // Format jobs by category data
    const jobsByCategoryData = apiData.charts.jobsByCategory.map(item => ({
      name: item.categoryName,
      value: item.count,
      color: item.categoryColor
    }));

    return { dailyJobsData, newUsersData, jobsByCategoryData };
  };

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboardStats();
        if (response.success) {
          setStatsData(response.stats);
        } else {
          setError('Không thể tải dữ liệu dashboard');
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Get formatted chart data
  const { dailyJobsData, newUsersData, jobsByCategoryData } = formatChartData(statsData);

  // Calculate completion rate (completed / total jobs)
  const completionRate = statsData?.jobs?.total > 0 
    ? ((statsData.jobs.completed / statsData.jobs.total) * 100).toFixed(1)
    : '0.0';

  const StatCard = ({ title, value, icon: Icon, trend, color, subtitle }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-8 w-8 ${color}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-2xl font-bold text-gray-900">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </dd>
              {subtitle && (
                <dd className="text-sm text-gray-600 mt-1">
                  {subtitle}
                </dd>
              )}
            </dl>
          </div>
          {trend && (
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">{trend}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Chào mừng, {user?.name} • {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Lỗi tải dữ liệu
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && statsData && (
            <>
              {/* Thống kê tổng quan */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Tổng người dùng"
                  value={statsData.totalUsers}
                  icon={Users}
                  color="text-blue-600"
                />
                <StatCard
                  title="Người dùng mới"
                  value={statsData.newUsersIn30Days || statsData.newUsersIn7Days || 0}
                  icon={UserPlus}
                  color="text-green-600"
                  subtitle="30 ngày qua"
                />
                <StatCard
                  title="Tổng công việc"
                  value={statsData.jobs?.total || 0}
                  icon={Briefcase}
                  color="text-purple-600"
                  subtitle={`${statsData.jobs?.open || 0} đang mở, ${statsData.jobs?.assigned || 0} đã giao`}
                />
                <StatCard
                  title="Công việc hoàn thành"
                  value={statsData.jobs?.completed || 0}
                  icon={Calendar}
                  color="text-orange-600"
                  subtitle={`${completionRate}% tỷ lệ hoàn thành`}
                />
              </div>

              {/* Thống kê voucher */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Voucher đã tạo"
                  value={statsData.vouchers?.total || 0}
                  icon={Gift}
                  color="text-pink-600"
                />
                <StatCard
                  title="Voucher đã sử dụng"
                  value={statsData.vouchers?.used || 0}
                  icon={Tag}
                  color="text-indigo-600"
                />
                <StatCard
                  title="Voucher chưa sử dụng"
                  value={statsData.vouchers?.unused || 0}
                  icon={UserCheck}
                  color="text-teal-600"
                />
                <StatCard
                  title="Doanh thu"
                  value="Đang cập nhật"
                  icon={DollarSign}
                  color="text-yellow-600"
                  subtitle="Sẽ được thêm sau"
                />
              </div>

              {/* Biểu đồ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Biểu đồ công việc theo ngày */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Công việc được tạo (30 ngày qua)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyJobsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="jobs" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Biểu đồ người dùng mới */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Người dùng đăng ký mới (30 ngày qua)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={newUsersData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#82ca9d" 
                        strokeWidth={3}
                        dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Biểu đồ tròn phân bố công việc theo category */}
              <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Phân bố công việc theo danh mục
                </h3>
                <div className="flex flex-col lg:flex-row items-center">
                  <div className="w-full lg:w-1/2">
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={jobsByCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {jobsByCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
                    <div className="space-y-3">
                      {jobsByCategoryData.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded mr-3"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.value} công việc
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Menu quản lý */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Quản lý hệ thống
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div 
                onClick={() => navigate('/admin/users')}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-blue-200"
              >
                <div className="flex items-center mb-3">
                  <Users className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Quản lý người dùng
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Xem và quản lý tất cả người dùng trong hệ thống
                </p>
              </div>

              <div 
                onClick={() => navigate('/admin/tasks')}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-green-200"
              >
                <div className="flex items-center mb-3">
                  <Briefcase className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Quản lý công việc
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Theo dõi và quản lý tất cả công việc
                </p>
              </div>

              <div 
                onClick={() => navigate('/admin/categories')}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-purple-200"
              >
                <div className="flex items-center mb-3">
                  <Tag className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Quản lý danh mục
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Quản lý các danh mục dịch vụ
                </p>
              </div>

              <div 
                onClick={() => navigate('/admin/vouchers')}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-pink-200"
              >
                <div className="flex items-center mb-3">
                  <Gift className="h-6 w-6 text-pink-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Quản lý Voucher
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Tạo và quản lý các voucher khuyến mãi
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-yellow-200">
                <div className="flex items-center mb-3">
                  <DollarSign className="h-6 w-6 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Báo cáo tài chính
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Xem báo cáo doanh thu và thống kê tài chính
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-indigo-200">
                <div className="flex items-center mb-3">
                  <UserCheck className="h-6 w-6 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Chương trình giới thiệu
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Quản lý chương trình mời bạn bè
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
