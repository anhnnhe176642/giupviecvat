import { useState, useEffect, useContext, useCallback } from 'react';
import { X, Plus, Minus, Compass, Loader, Tag, Ticket } from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import LocationPicker from './map/LocationPicker';
import axios from 'axios';
import { AuthContext } from '../conext/AuthContext';
import toast from 'react-hot-toast';
import { getUserBalance } from '../services/api';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const CreateTaskModal = ({ isOpen, onClose, onCreateTask }) => {
  // Form state
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState(''); // Renamed from price to budget
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('Linh hoạt');
  const [skills, setSkills] = useState(['']);
  const [markerPosition, setMarkerPosition] = useState([21.0285, 105.8544]); // Default to hanoi
  const [address, setAddress] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [mapStyle, setMapStyle] = useState('stadiaBright');
  const {user} = useContext(AuthContext);
  
  // New state for categories
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  
  // New state for posting fee
  const [postingFee, setPostingFee] = useState(0);

  // Replace discount code state with voucher state
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);
  const [voucherError, setVoucherError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showVoucherList, setShowVoucherList] = useState(false);

  // New state for user balance
  const [userBalance, setUserBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState(null);

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

  // Fetch available vouchers from API
  const fetchAvailableVouchers = useCallback(async () => {
    try {
      setIsLoadingVouchers(true);
      setVoucherError(null);
      
      const response = await axios.get("/vouchers/available", {
        params: { orderAmount: postingFee }
      });
      
      if (response.data.vouchers) {
        setAvailableVouchers(response.data.vouchers);
      } else {
        setVoucherError("Failed to load vouchers");
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      setVoucherError("Error loading vouchers. Please try again.");
      setAvailableVouchers([]);
    } finally {
      setIsLoadingVouchers(false);
    }
  }, [postingFee]);

  // Fetch user balance from API
  const fetchUserBalance = useCallback(async () => {
    try {
      setIsLoadingBalance(true);
      setBalanceError(null);
      
      const data = await getUserBalance();
      
      if (data.success) {
        setUserBalance(data.balance);
      } else {
        setBalanceError("Failed to load balance");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalanceError("Error loading balance. Please try again.");
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    } else {
      // Fetch categories and balance when modal opens
      fetchCategories();
      fetchUserBalance();
    }
  }, [isOpen, fetchUserBalance]);

  // Fetch available vouchers when posting fee changes
  useEffect(() => {
    if (postingFee > 0) {
      fetchAvailableVouchers();
    }
  }, [postingFee, fetchAvailableVouchers]);

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
    if (!markerPosition) return;

    try {
      const res = await axios.get("/reverse-geocode", {
        params: {
          lat: markerPosition[0],
          lon: markerPosition[1],
        },
      });

      if (res.data && res.data.display_name) {
        setAddress(res.data.display_name);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  getAddressFromCoords();
}, [markerPosition]);

  // Get current location using browser geolocation API
  const getCurrentLocation = () => {
    // Reset any previous location errors
    setLocationError(null);
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationError("Trình duyệt của bạn không hỗ trợ định vị GPS.");
      return;
    }

    // Show loading indicator
    setIsGettingLocation(true);

    // Request current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success handler
        const { latitude, longitude } = position.coords;
        setMarkerPosition([latitude, longitude]);
        setIsGettingLocation(false);
      },
      (error) => {
        // Error handler
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
    if (!budget || budget <= 0) errors.budget = 'Vui lòng nhập ngân sách hợp lệ';
    if (!description.trim()) errors.description = 'Vui lòng nhập mô tả công việc';
    if (!markerPosition) errors.location = 'Vui lòng chọn vị trí trên bản đồ';
    if (!selectedCategory) errors.category = 'Vui lòng chọn thể loại công việc';
    if (!user) {
      toast.error("Bạn cần đăng nhập để tạo công việc mới.");
      return false;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      const newTask = {
        title,
        price: Number(budget), // Use budget instead of price
        description,
        time,
        skills: skills.filter(skill => skill.trim() !== ''),
        location: address,
        lat: markerPosition[0],
        lng: markerPosition[1],
        category: selectedCategory,
        voucherCode: selectedVoucher ? selectedVoucher.code : undefined,
      };
      
      onCreateTask(newTask);
    }
  };

  // Map tile providers configuration
  const tileProviders = {
    stadiaBright: {
      url: 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      name: 'Stadia Bright'
    },
    stadiaSatellite: {
      url: 'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      name: 'Stadia Satellite'
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setTitle('');
    setBudget(''); // Reset budget (changed from price)
    setFormattedBudget(''); // Reset formatted budget
    setDescription('');
    setTime('Linh hoạt');
    setSkills(['']);
    setMarkerPosition([21.0285, 105.8544]); // Default to FPT
    setAddress('');
    setFormErrors({});
    setLocationError(null);
    setMapStyle('stadiaBright');
    setSelectedCategory(''); // Reset selected category
    setPostingFee(0); // Reset posting fee
    setAvailableVouchers([]); // Reset available vouchers
    setSelectedVoucher(null); // Reset selected voucher
    setShowVoucherList(false); // Reset voucher list display
    setTotalPrice(0); // Reset total price
    setUserBalance(0); // Reset user balance
    setIsLoadingBalance(false); // Reset loading state
    setBalanceError(null); // Reset balance error
  };

  const formatVND = (val) => {
    if (!val) return '';
    if(typeof val !== 'string') val = val.toString();
    const number = parseInt(val.replace(/\D/g, ''), 10) || 0;
    return number.toLocaleString('vi-VN');
  };
  
  const [formattedBudget, setFormattedBudget] = useState(''); // Renamed from formattedPrice
  
  const handleBudgetChange = (e) => { // Renamed from handlePriceChange
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, '');
    setBudget(numericValue);
    setFormattedBudget(formatVND(numericValue));
  };

  // Update posting fee when category changes
  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const selectedCat = categories.find(cat => cat._id === selectedCategory);
      if (selectedCat && selectedCat.price) {
        setPostingFee(selectedCat.price);
      } else {
        setPostingFee(0);
      }
    } else {
      setPostingFee(0);
    }
  }, [selectedCategory, categories]);

  // Calculate total price based on posting fee and selected voucher
  useEffect(() => {
    let finalPrice = postingFee;
    
    if (selectedVoucher && selectedVoucher.discountAmount) {
      finalPrice = postingFee - selectedVoucher.discountAmount;
    }
    
    setTotalPrice(Math.max(0, finalPrice));
  }, [postingFee, selectedVoucher]);

  // Handle voucher selection
  const handleVoucherSelect = (voucher) => {
    setSelectedVoucher(voucher);
    setShowVoucherList(false);
    toast.success(`Đã áp dụng voucher: ${voucher.name}`);
  };

  // Remove selected voucher
  const removeSelectedVoucher = () => {
    setSelectedVoucher(null);
    toast.success('Đã hủy voucher');
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
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">Tạo công việc mới</h2>
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
                  maxLength={35}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Dọn dẹp nhà cửa, Sửa máy giặt..."
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm ${
                    formErrors.title ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {formErrors.title && <p className="text-red-500 text-xs mt-1.5">{formErrors.title}</p>}
              </div>
              
              {/* Budget - renamed from Price */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ngân sách (VNĐ) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="budget"
                    type="text"
                    value={formattedBudget}
                    onChange={handleBudgetChange}
                    placeholder="VD: 100,000"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm ${
                      formErrors.budget ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500 font-medium">VNĐ</span>
                </div>
                {formErrors.budget && <p className="text-red-500 text-xs mt-1.5">{formErrors.budget}</p>}
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
                          {category.name} ({formatVND(category.price+"")} VNĐ)
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

              {/* Map and location */}
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
              
              {/* User Balance Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Số dư hiện tại
                </label>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  {isLoadingBalance ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader size={16} className="animate-spin mr-2" />
                      <span className="text-sm text-gray-600">Đang tải số dư...</span>
                    </div>
                  ) : balanceError ? (
                    <div className="text-center py-2">
                      <p className="text-red-600 text-sm">{balanceError}</p>
                      <button
                        onClick={fetchUserBalance}
                        className="text-xs text-blue-600 hover:text-blue-700 mt-1"
                      >
                        Thử lại
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Số dư khả dụng:</span>
                        <span className="font-bold text-lg text-blue-700">
                          {formatVND(userBalance.toString())} VNĐ
                        </span>
                      </div>
                      {userBalance < totalPrice && totalPrice > 0 && (
                        <p className="text-red-600 text-xs mt-1">
                          Số dư không đủ để thực hiện giao dịch này
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {/* Voucher Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Ticket size={16} className="inline mr-1" />
                  Voucher giảm giá
                </label>
                
                {/* Selected voucher display */}
                {selectedVoucher ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-emerald-800">{selectedVoucher.name}</p>
                        <p className="text-sm text-emerald-600">{selectedVoucher.description}</p>
                      </div>
                      <button
                        onClick={removeSelectedVoucher}
                        className="text-emerald-600 hover:text-emerald-800 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="text-sm text-emerald-700">
                      Giảm: {formatVND(selectedVoucher.discountAmount.toString())} VNĐ
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowVoucherList(!showVoucherList)}
                    disabled={isLoadingVouchers || availableVouchers.length === 0}
                    className={`w-full p-3 border rounded-lg text-left transition-all ${
                      isLoadingVouchers || availableVouchers.length === 0
                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200'
                        : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    {isLoadingVouchers ? (
                      <div className="flex items-center">
                        <Loader size={16} className="animate-spin mr-2" />
                        Đang tải voucher...
                      </div>
                    ) : availableVouchers.length === 0 ? (
                      'Không có voucher khả dụng'
                    ) : (
                      `Chọn voucher (${availableVouchers.length} khả dụng)`
                    )}
                  </button>
                )}
                
                {/* Voucher list */}
                {showVoucherList && availableVouchers.length > 0 && (
                  <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-sm">
                    {availableVouchers.map((voucher) => (
                      <button
                        key={voucher.id}
                        onClick={() => handleVoucherSelect(voucher)}
                        className="w-full p-3 text-left hover:bg-emerald-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{voucher.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{voucher.description}</p>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <span>Giảm: {formatVND(voucher.discountAmount.toString())} VNĐ</span>
                              <span className="mx-2">•</span>
                              <span>HSD: {new Date(voucher.endDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {voucherError && (
                  <p className="text-red-500 text-xs mt-1">{voucherError}</p>
                )}
              </div>

              {/* Total price display - updated to show posting fee */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tổng tiền khi đăng việc</h3>
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-gray-50 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600">Giá đăng bài:</span>
                    <span className="font-medium">{formatVND(postingFee.toString())} VNĐ</span>
                  </div>
                  
                  {selectedVoucher && selectedVoucher.discountAmount > 0 && (
                    <div className="flex justify-between items-center mb-1 text-emerald-600">
                      <span>Giảm giá ({selectedVoucher.name}):</span>
                      <span>- {formatVND(selectedVoucher.discountAmount.toString())} VNĐ</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
                    <span className="font-bold text-gray-700">Tổng cộng:</span>
                    <span className={`font-bold text-lg ${
                      userBalance >= totalPrice ? 'text-emerald-700' : 'text-red-600'
                    }`}>
                      {formatVND(totalPrice.toString())} VNĐ
                    </span>
                  </div>
                  
                  {userBalance < totalPrice && totalPrice > 0 && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                      ⚠️ Số dư không đủ. Vui lòng nạp thêm {formatVND((totalPrice - userBalance).toString())} VNĐ
                    </div>
                  )}
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
            disabled={userBalance < totalPrice && totalPrice > 0}
            className={`px-6 py-2.5 rounded-lg transition-all shadow-md font-medium ${
              userBalance < totalPrice && totalPrice > 0
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-green-700 text-white hover:from-emerald-700 hover:to-green-800'
            }`}
          >
            {userBalance < totalPrice && totalPrice > 0 ? 'Số dư không đủ' : 'Tạo công việc'}
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

export default CreateTaskModal;