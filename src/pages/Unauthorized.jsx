import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600">
            Bạn không có quyền truy cập vào trang này.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Về trang chủ
          </Link>
          
          <Link
            to="/dashboard"
            className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-200"
          >
            Về Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
