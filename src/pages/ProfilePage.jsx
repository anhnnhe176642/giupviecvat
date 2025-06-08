import React, { useContext, useState } from 'react';
import { FaUser, FaEdit, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../conext/AuthConext';
import axios from 'axios';

const ProfilePage = () => {
  const { user, setUser }= useContext(AuthContext);

  const [editMode, setEditMode] = useState({
    personalInfo: false,
    password: false
  });

  const [formData, setFormData] = useState({
    ...user,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPersonalInfo = async (e) => {
    e.preventDefault();
    
    setUpdateStatus({ loading: true, error: null, success: null });
    
    try {
      const response = await axios.put('users/profile/update', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        isTasker: formData.isTasker,
        isActive: formData.isActive
      });
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setUpdateStatus({ 
          loading: false, 
          error: null, 
          success: 'Cập nhật thông tin cá nhân thành công' 
        });
        setEditMode({ ...editMode, personalInfo: false });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateStatus({ 
        loading: false, 
        error: error.response?.data?.message || 'Cập nhật thông tin thất bại', 
        success: null 
      });
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setUpdateStatus({
        loading: false,
        error: 'Mật khẩu xác nhận không khớp',
        success: null
      });
      return;
    }
    
    setUpdateStatus({ loading: true, error: null, success: null });
    
    try {
      const payload = {
        newPassword: formData.newPassword
      };
      
      // Chỉ gửi currentPassword nếu user đã có mật khẩu
      if (user.password) {
        payload.currentPassword = formData.currentPassword;
      }
      
      const response = await axios.put('users/profile/password', payload);
      
      if (response.data) {
        setUpdateStatus({ 
          loading: false, 
          error: null, 
          success: 'Cập nhật mật khẩu thành công' 
        });
        setEditMode({ ...editMode, password: false });
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setUpdateStatus({ 
        loading: false, 
        error: error.response?.data?.message || 'Cập nhật mật khẩu thất bại', 
        success: null 
      });
    }
  };

  const toggleEditMode = (section) => {
    setEditMode({
      ...editMode,
      [section]: !editMode[section]
    });
    setFormData({ ...user, currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const saveProfilePicture = async () => {
    if (!imagePreview) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const response = await axios.put('users/profile', {
        profilePicture: imagePreview
      });
      
      if (response.data && response.data.user) {
        setUser({ ...user, profilePicture: response.data.user.profilePicture });
      } else {
        setUser({ ...user, profilePicture: imagePreview });
      }
      setImagePreview(null);
    } catch (error) {
      console.error('Error updating profile picture:', error);
      setUploadError(error.response?.data?.message || 'Failed to update profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">Thông Tin Cá Nhân</h1>
      
      {updateStatus.success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-sm mb-6" role="alert">
          <div className="flex items-center">
            <FaCheck className="text-green-500 mr-2" />
            <span className="font-medium">{updateStatus.success}</span>
          </div>
        </div>
      )}
      
      {updateStatus.error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-6" role="alert">
          <div className="flex items-center">
            <FaTimes className="text-red-500 mr-2" />
            <span className="font-medium">{updateStatus.error}</span>
          </div>
        </div>
      )}
      
      {/* Profile Picture Section */}
      <div className="bg-white shadow-xl rounded-xl p-8 mb-8 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-6 text-green-700 border-b border-green-100 pb-2">Ảnh Đại Diện</h2>
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-50 mb-6 relative border-4 border-green-100 shadow-lg">
            {(imagePreview || user.profilePicture) ? (
              <img 
                src={imagePreview || user.profilePicture || 'https://via.placeholder.com/150'} 
                alt="Ảnh đại diện" 
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-200 text-6xl" />
            )}
          </div>
          
          <label className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 px-6 rounded-full cursor-pointer transition duration-300 shadow-md flex items-center">
            <FaUser className="mr-2" /> Chọn Ảnh
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
          </label>
          
          {uploadError && (
            <p className="text-red-500 mt-4 text-center">{uploadError}</p>
          )}
          
          {imagePreview && (
            <div className="mt-6 flex space-x-4">
              <button 
                className={`bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 px-6 rounded-full transition duration-300 shadow-md flex items-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={saveProfilePicture}
                disabled={isUploading}
              >
                <FaCheck className="mr-2" />
                {isUploading ? 'Đang Lưu...' : 'Lưu'}
              </button>
              <button 
                className="bg-white border border-red-500 text-red-500 hover:bg-red-50 font-medium py-2.5 px-6 rounded-full transition duration-300 shadow-md flex items-center"
                onClick={() => setImagePreview(null)}
                disabled={isUploading}
              >
                <FaTimes className="mr-2" />
                Huỷ
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Personal Information Section */}
      <div className="bg-white shadow-xl rounded-xl p-8 mb-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6 border-b border-green-100 pb-2">
          <h2 className="text-2xl font-semibold text-green-700">Thông Tin Cơ Bản</h2>
          <button
            className="text-green-600 hover:text-green-800 flex items-center transition duration-300 font-medium"
            onClick={() => toggleEditMode('personalInfo')}
          >
            <FaEdit className="mr-1.5" />
            {editMode.personalInfo ? 'Huỷ' : 'Chỉnh Sửa'}
          </button>
        </div>
        
        {editMode.personalInfo ? (
          <form onSubmit={handleSubmitPersonalInfo}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Họ và Tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Số Điện Thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Địa Chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                />
              </div>
            </div>
            
            <div className="mt-6 space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isTasker"
                  checked={formData.isTasker}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3 cursor-pointer"
                />
                <label className="font-medium text-gray-700">Đăng ký làm Tasker</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-3 cursor-pointer"
                />
                <label className="font-medium text-gray-700">Tài khoản hoạt động</label>
              </div>
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 shadow-md w-full md:w-auto"
                disabled={updateStatus.loading}
              >
                {updateStatus.loading ? 'Đang Lưu...' : 'Lưu Thông Tin'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Họ và Tên</p>
              <p className="font-semibold text-gray-800 text-lg">{user.name}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Email</p>
              <p className="font-semibold text-gray-800 text-lg">{user.email}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Số Điện Thoại</p>
              <p className="font-semibold text-gray-800 text-lg">{user.phone || 'Chưa cung cấp'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Địa Chỉ</p>
              <p className="font-semibold text-gray-800 text-lg">{user.address || 'Chưa cung cấp'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Đăng ký làm Tasker</p>
              <p className={`font-semibold text-lg ${user.isTasker ? 'text-green-600' : 'text-gray-500'}`}>
                {user.isTasker ? 'Có' : 'Không'}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm mb-1">Trạng thái tài khoản</p>
              <p className={`font-semibold text-lg ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {user.isActive ? 'Hoạt động' : 'Tạm ngưng'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Password Section */}
      <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6 border-b border-green-100 pb-2">
          <h2 className="text-2xl font-semibold text-green-700">Mật Khẩu</h2>
          <button
            className="text-green-600 hover:text-green-800 flex items-center transition duration-300 font-medium"
            onClick={() => toggleEditMode('password')}
          >
            <FaEdit className="mr-1.5" />
            {editMode.password ? 'Huỷ' : 'Đổi Mật Khẩu'}
          </button>
        </div>
        
        {!editMode.password ? (
          <p className="text-gray-600 p-4 bg-gray-50 rounded-lg">
            {user.password === null ? 
              'Bạn chưa thiết lập mật khẩu. Hãy tạo mật khẩu để bảo vệ tài khoản của bạn.' : 
              'Mật khẩu của bạn đã được thiết lập. Bạn có thể thay đổi mật khẩu bất cứ lúc nào.'}
          </p>
        ) : (
          <form onSubmit={handleSubmitPassword}>
            {user.password !== null && (
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-medium">Mật Khẩu Hiện Tại</label>
                <div className="relative">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition duration-300"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPassword.current ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                  </button>
                </div>
              </div>
            )}
            
            <div className="mb-5">
              <label className="block text-gray-700 mb-2 font-medium">Mật Khẩu Mới</label>
              <div className="relative">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                  required
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition duration-300"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPassword.new ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Xác Nhận Mật Khẩu</label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                  required
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition duration-300"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPassword.confirm ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                </button>
              </div>
              {formData.newPassword !== formData.confirmPassword && formData.confirmPassword && (
                <p className="text-red-500 text-sm mt-2">Mật khẩu xác nhận không khớp</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={formData.newPassword !== formData.confirmPassword || updateStatus.loading}
              className={`font-medium py-3 px-6 rounded-lg transition duration-300 shadow-md w-full md:w-auto ${
                formData.newPassword === formData.confirmPassword && !updateStatus.loading ? 
                'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white' : 
                'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              {updateStatus.loading ? 'Đang xử lý...' : (user.password === null ? 'Tạo Mật Khẩu' : 'Cập Nhật Mật Khẩu')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
