import { useLocation, Outlet, Link } from 'react-router-dom';
import { 
  CreditCardIcon, 
  ClockIcon, 
  WalletIcon, 
  TicketIcon,
  PlusIcon 
} from '@heroicons/react/24/outline';

const AccountManagement = () => {
  const location = useLocation();
  const activeTab = location.pathname.split('/').pop() || 'balance';

  const tabs = [
    { id: 'balance', name: 'Số dư', icon: WalletIcon, path: '/account/balance' },
    { id: 'deposit', name: 'Nạp tiền', icon: CreditCardIcon, path: '/account/deposit' },
    { id: 'history', name: 'Lịch sử giao dịch', icon: ClockIcon, path: '/account/history' },
    { id: 'vouchers', name: 'Lịch sử Voucher', icon: TicketIcon, path: '/account/vouchers' }
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tài khoản</h1>
          <p className="mt-2 text-gray-600">Quản lý số dư, giao dịch và voucher của bạn</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Content from nested routes */}
        <div className="bg-white rounded-lg shadow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
