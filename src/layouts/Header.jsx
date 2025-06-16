import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../conext/AuthContext';

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
          <Link to="/" className="text-2xl font-bold text-green-600">
            <img
              src={`${import.meta.env.BASE_URL}giupviecvatlogo.png`}
              className="h-10 w-auto" 
              alt="Giupviecvat"
            />
          </Link>
          <div className="hidden md:flex ml-10 space-x-6">
            <Link to="/" className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-green-600 py-1">Về chúng tôi</Link>
            <Link to="/browse-tasks" className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-green-600 py-1">Tìm công việc</Link>
            <Link to="/my-tasks" className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-green-600 py-1">Công việc của tôi</Link>
            <Link to="/chat" className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-green-600 py-1">Tin nhắn</Link>
            <Link to="#" className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-green-600 py-1">Đánh giá</Link>
            {user && (
              <Link to="/dashboard" className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-green-600 py-1">Bảng điều khiển</Link>
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
                  className="w-8 h-8 rounded-full object-cover border-2 border-green-500"
                />
                <span className="text-green-600 font-medium">{user.name || "User"}</span>
                <svg 
                  className={`h-4 w-4 transition-transform text-green-600 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-green-100">
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors duration-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors duration-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Quản lí công việc
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors duration-200"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex space-x-4 items-center">
              <Link to="/login" className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200">Đăng nhập</Link>
              <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors duration-200">Đăng ký</Link>
            </div>
          )}
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-green-600 focus:outline-none"
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
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-green-600 hover:text-green-800 py-2 transition-colors duration-200">Về chúng tôi</Link>
            <Link to="/browse-tasks" onClick={() => setIsMobileMenuOpen(false)} className="text-green-600 hover:text-green-800 py-2 transition-colors duration-200">Tìm công việc</Link>
            <Link to="/my-tasks" onClick={() => setIsMobileMenuOpen(false)} className="text-green-600 hover:text-green-800 py-2 transition-colors duration-200">Công việc của tôi</Link>
            <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} className="text-green-600 hover:text-green-800 py-2 transition-colors duration-200">Tin nhắn</Link>
            {user && (
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-green-600 hover:text-green-800 py-2 transition-colors duration-200">Bảng điều khiển</Link>
            )}
            
            {user ? (
              <>
                <div className="flex items-center space-x-2 py-2">
                  <img
                    src={user.profilePicture || "https://via.placeholder.com/40"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-green-500"
                  />
                  <span className="text-green-600 font-medium">{user.name || "User"}</span>
                </div>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-green-600 hover:text-green-800 py-2 pl-10 transition-colors duration-200">Hồ sơ cá nhân</Link>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-green-600 hover:text-green-800 py-2 pl-10 transition-colors duration-200">Quản lí công việc</Link>
                <button onClick={handleLogout} className="text-green-600 hover:text-green-800 py-2 text-left pl-10 transition-colors duration-200">Đăng xuất</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-green-600 hover:text-green-800 py-2 transition-colors duration-200">Đăng nhập</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 inline-block text-center transition-colors duration-200">Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;
