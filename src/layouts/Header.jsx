import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../conext/AuthConext';

function Header() {
  const { user, logout } = useContext(AuthContext);
  console.log("User in Header:", user);
  const handleLogout = () => {
    logout()
  };

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            <img
              src="./giupviecvatlogo.png"
              className="h-10 w-auto" 
              alt="Giupviecvat"
            />
          </Link>
          <div className="hidden md:flex ml-10 space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Danh mục</Link>
            <Link to="/browse-tasks" className="text-gray-600 hover:text-blue-600">Tìm công việc</Link>
            <Link to="/my-tasks" className="text-gray-600 hover:text-blue-600">Công việc của tôi</Link>
            <Link to="/" className="text-gray-600 hover:text-blue-600">Đánh giá</Link>
            <Link to="/chat" className="text-gray-600 hover:text-blue-600">Tin nhắn</Link>
            {user && (
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Bảng điều khiển</Link>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600">Đăng xuất</button>
          ) : (
            <>
              <Link to="/login" className="hidden md:block text-gray-600 hover:text-blue-600">Đăng nhập</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">Đăng ký Tasker</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
