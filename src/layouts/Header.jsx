import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../conext/AuthConext';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            <img
              src="/giupviecvatlogo.png"
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
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button 
                onClick={toggleProfileDropdown} 
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/10337/10337609.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-gray-700">{user.name || "User"}</span>
                <svg 
                  className={`h-4 w-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <Link 
                      to="/manage-tasks" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Quản lí công việc
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex space-x-4 items-center">
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Đăng nhập</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">Đăng ký Tasker</Link>
            </div>
          )}
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-600 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white py-2 px-4 shadow-md absolute top-16 left-0 right-0 z-50">
          <div className="flex flex-col space-y-3">
            <Link to="/" className="text-gray-600 hover:text-blue-600 py-2">Danh mục</Link>
            <Link to="/browse-tasks" className="text-gray-600 hover:text-blue-600 py-2">Tìm công việc</Link>
            <Link to="/my-tasks" className="text-gray-600 hover:text-blue-600 py-2">Công việc của tôi</Link>
            <Link to="/" className="text-gray-600 hover:text-blue-600 py-2">Đánh giá</Link>
            <Link to="/chat" className="text-gray-600 hover:text-blue-600 py-2">Tin nhắn</Link>
            {user && (
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 py-2">Bảng điều khiển</Link>
            )}
            
            {user ? (
              <>
                <div className="flex items-center space-x-2 py-2">
                  <img
                    src={user.profilePicture || "https://via.placeholder.com/40"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-700">{user.name || "User"}</span>
                </div>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600 py-2 pl-10">Hồ sơ cá nhân</Link>
                <Link to="/manage-tasks" className="text-gray-600 hover:text-blue-600 py-2 pl-10">Quản lí công việc</Link>
                <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600 py-2 text-left pl-10">Đăng xuất</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 py-2">Đăng nhập</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 inline-block text-center">Đăng ký Tasker</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;
