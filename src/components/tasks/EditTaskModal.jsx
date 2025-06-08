import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Compass, Loader } from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import LocationPicker from '../map/LocationPicker';
import axios from 'axios';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Format number as VND currency (with thousand separators)
const formatVND = (val) => {
  if (!val) return '';
  const number = parseInt(val.replace(/\D/g, ''), 10) || 0;
  return number.toLocaleString('vi-VN');
};

const EditTaskModal = ({ isOpen, onClose, task, onEditTask }) => {
  // Form state initialized with task data
  const [title, setTitle] = useState(task?.title || '');
  const [price, setPrice] = useState(task?.price || '');
  const [formattedPrice, setFormattedPrice] = useState('');
  const [description, setDescription] = useState(task?.description || '');
  const [time, setTime] = useState(task?.time || 'Linh hoạt');
  const [skills, setSkills] = useState(task?.skills?.length ? [...task.skills] : ['']);
  const [markerPosition, setMarkerPosition] = useState(
    task?.lat && task?.lng ? [task.lat, task.lng] : [21.0285, 105.8544]
  );
  const [address, setAddress] = useState(task?.location || '');
  const [formErrors, setFormErrors] = useState({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [mapStyle, setMapStyle] = useState('stadiaBright');
  
  // New state for categories
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(task?.category || '');
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

  // Load task data when modal opens
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    } else {
      // Initialize form with task data
      setTitle(task?.title || '');
      setPrice(task?.price || '');
      setFormattedPrice(formatVND(task?.price?.toString() || ''));
      setDescription(task?.description || '');
      setTime(task?.time || 'Linh hoạt');
      setSkills(task?.skills?.length ? [...task.skills] : ['']);
      setMarkerPosition(
        task?.lat && task?.lng ? [task.lat, task.lng] : [21.0285, 105.8544]
      );
      setAddress(task?.location || '');
      setSelectedCategory(task?.category || '');
      
      // Fetch categories when modal opens
      fetchCategories();
    }
  }, [isOpen, task]);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      setCategoryError(null);
      
      const response = await axios.get("/categories");
      
      if (response.data.success) {
        const filteredCategories = response.data.categories.filter(cat => cat._id !== "all");
        setCategories(filteredCategories);
      } else {
        setCategoryError("Failed to load categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoryError("Error loading categories. Please try again.");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Reverse geocode to get address from coordinates
  useEffect(() => {
    const getAddressFromCoords = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${markerPosition[0]}&lon=${markerPosition[1]}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        if (data && data.display_name) {
          setAddress(data.display_name);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    if (markerPosition) {
      getAddressFromCoords();
    }
  }, [markerPosition]);

  // Get current location using browser geolocation API
  const getCurrentLocation = () => {
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Trình duyệt của bạn không hỗ trợ định vị GPS.");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMarkerPosition([latitude, longitude]);
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Bạn đã từ chối quyền truy cập vị trí.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Thông tin vị trí không khả dụng.");
            break;
          case error.TIMEOUT:
            setLocationError("Yêu cầu vị trí đã hết thời gian.");
            break;
          default:
            setLocationError("Đã xảy ra lỗi không xác định khi lấy vị trí.");
        }
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  };

  // Add new skill field
  const addSkillField = () => {
    setSkills([...skills, '']);
  };

  // Remove skill field
  const removeSkillField = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills.length ? newSkills : ['']);
  };

  // Update skill at index
  const updateSkill = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = 'Vui lòng nhập tiêu đề công việc';
    if (!price || price <= 0) errors.price = 'Vui lòng nhập giá hợp lệ';
    if (!description.trim()) errors.description = 'Vui lòng nhập mô tả công việc';
    if (!markerPosition) errors.location = 'Vui lòng chọn vị trí trên bản đồ';
    if (!selectedCategory) errors.category = 'Vui lòng chọn thể loại công việc';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      const editedTask = {
        _id: task._id,
        title,
        price: Number(price),
        description,
        time,
        skills: skills.filter(skill => skill.trim() !== ''),
        location: address,
        lat: markerPosition[0],
        lng: markerPosition[1],
        category: selectedCategory,
      };
      
      onEditTask(editedTask);
    }
  };

  // Map tile providers configuration
  const tileProviders = {
    stadiaBright: {
      url: 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
      attribution: ' ',
      name: 'Stadia Bright'
    },
    stadiaSatellite: {
      url: 'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png',
      attribution: ' ',
      name: 'Stadia Satellite'
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setTitle('');
    setPrice('');
    setFormattedPrice('');
    setDescription('');
    setTime('Linh hoạt');
    setSkills(['']);
    setMarkerPosition([21.0285, 105.8544]);
    setAddress('');
    setFormErrors({});
    setLocationError(null);
    setMapStyle('stadiaBright');
    setSelectedCategory('');
  };

  // Handle price input changes with formatting
  const handlePriceChange = (e) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, '');
    setPrice(numericValue);
    setFormattedPrice(formatVND(numericValue));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-4xl max-h-[90vh] overflow-hidden border-0 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
        style={{boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)'}}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 bg-gradient-to-r from-emerald-50 via-white to-green-50 shrink-0 border-b border-gray-100">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">Chỉnh sửa công việc</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-50 rounded-full p-1.5 transition-all shadow-sm border border-gray-100 hover:border-gray-200"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto p-6 max-h-[70vh] custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Form fields */}
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tiêu đề công việc <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Dọn dẹp nhà cửa, Sửa máy giặt..."
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm ${
                    formErrors.title ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {formErrors.title && <p className="text-red-500 text-xs mt-1.5">{formErrors.title}</p>}
              </div>
              
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="price"
                    type="text"
                    value={formattedPrice}
                    onChange={handlePriceChange}
                    placeholder="VD: 100,000"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm ${
                      formErrors.price ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500 font-medium">VNĐ</span>
                </div>
                {formErrors.price && <p className="text-red-500 text-xs mt-1.5">{formErrors.price}</p>}
              </div>
              
              {/* Category dropdown */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Thể loại công việc <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {isLoadingCategories ? (
                    <div className="w-full px-3 py-2.5 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 bg-gray-50">
                      <Loader size={16} className="animate-spin mr-2" />
                      Đang tải...
                    </div>
                  ) : (
                    <select
                      id="category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm appearance-none ${
                        formErrors.category ? 'border-red-500' : 'border-gray-200'
                      }`}
                      style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, 
                              backgroundRepeat: 'no-repeat', 
                              backgroundPosition: 'right 0.75rem center',
                              backgroundSize: '1rem', 
                              paddingRight: '2.5rem'}}
                    >
                      <option value="">-- Chọn thể loại --</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {categoryError && <p className="text-red-500 text-xs mt-1.5">{categoryError}</p>}
                {formErrors.category && <p className="text-red-500 text-xs mt-1.5">{formErrors.category}</p>}
              </div>
              
              {/* Time/Duration */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Thời gian thực hiện
                </label>
                <select
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm appearance-none"
                  style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, 
                          backgroundRepeat: 'no-repeat', 
                          backgroundPosition: 'right 0.75rem center',
                          backgroundSize: '1rem', 
                          paddingRight: '2.5rem'}}
                >
                  <option value="Linh hoạt">Linh hoạt</option>
                  <option value="Hôm nay">Hôm nay</option>
                  <option value="1-2 giờ">1-2 giờ</option>
                  <option value="2-4 giờ">2-4 giờ</option>
                  <option value="4-8 giờ">4-8 giờ</option>
                  <option value="Trên 8 giờ">Trên 8 giờ</option>
                </select>
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mô tả công việc <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả chi tiết công việc cần thực hiện..."
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm ${
                    formErrors.description ? 'border-red-500' : 'border-gray-200'
                  }`}
                ></textarea>
                {formErrors.description && (
                  <p className="text-red-500 text-xs mt-1.5">{formErrors.description}</p>
                )}
              </div>
              
              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kỹ năng yêu cầu
                </label>
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => updateSkill(index, e.target.value)}
                        placeholder={`Kỹ năng ${index + 1}`}
                        className="flex-grow px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm"
                      />
                      {index === skills.length - 1 ? (
                        <button
                          type="button"
                          onClick={addSkillField}
                          className="ml-2 p-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-sm"
                        >
                          <Plus size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeSkillField(index)}
                          className="ml-2 p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-sm"
                        >
                          <Minus size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right column - Map and location */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Vị trí công việc <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className={`flex items-center text-sm px-3 py-1.5 rounded-lg transition-all ${
                      isGettingLocation 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 shadow-sm border border-emerald-100'
                    }`}
                  >
                    {isGettingLocation ? (
                      <>
                        <Loader size={14} className="animate-spin mr-2" />
                        Đang tìm...
                      </>
                    ) : (
                      <>
                        <Compass size={14} className="mr-2" />
                        Vị trí hiện tại
                      </>
                    )}
                  </button>
                </div>

                {/* Map Style Selection */}
                <div className="mb-3 flex gap-2">
                  {Object.keys(tileProviders).map(style => (
                    <button
                      key={style}
                      type="button"
                      className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium ${
                        mapStyle === style
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setMapStyle(style)}
                    >
                      {tileProviders[style].name}
                    </button>
                  ))}
                </div>

                <div className="h-64 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                  <MapContainer 
                    center={markerPosition} 
                    zoom={13} 
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution={tileProviders[mapStyle].attribution}
                      url={tileProviders[mapStyle].url}
                    />
                    <LocationPicker position={markerPosition} setPosition={setMarkerPosition} />
                  </MapContainer>
                </div>

                {locationError && (
                  <p className="text-red-500 text-xs mt-1.5">{locationError}</p>
                )}

                <p className="text-sm text-gray-500 mt-2">
                  Nhấp vào bản đồ để chọn vị trí hoặc sử dụng nút "Vị trí hiện tại"
                </p>

                {formErrors.location && (
                  <p className="text-red-500 text-xs mt-1.5">{formErrors.location}</p>
                )}
              </div>
              
              {/* Location display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Địa chỉ đã chọn
                </label>
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-gray-50 rounded-lg min-h-[80px] break-words text-sm shadow-sm border border-gray-100">
                  {address || "Chưa chọn vị trí"}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="border-t border-gray-100 p-5 flex gap-3 justify-end bg-gradient-to-r from-gray-50 to-white shrink-0">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium hover:border-gray-300"
          >
            Hủy
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all shadow-md font-medium"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
      
      {/* Add custom scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 100px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default EditTaskModal;
