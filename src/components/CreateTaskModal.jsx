import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Compass, Loader } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Location picker component to handle map clicks
const LocationPicker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });

  // Center map on position when it changes
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position ? <Marker position={position} /> : null;
};

const CreateTaskModal = ({ isOpen, onClose, onCreateTask }) => {
  // Form state
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('Linh hoạt');
  const [skills, setSkills] = useState(['']);
  const [markerPosition, setMarkerPosition] = useState([21.0285, 105.8544]); // Default to hanoi
  const [address, setAddress] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [mapStyle, setMapStyle] = useState('stadiaBright'); // Add state for map style

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

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
    if (!price || price <= 0) errors.price = 'Vui lòng nhập giá hợp lệ';
    if (!description.trim()) errors.description = 'Vui lòng nhập mô tả công việc';
    if (!markerPosition) errors.location = 'Vui lòng chọn vị trí trên bản đồ';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      const newTask = {
        title,
        price: Number(price),
        description,
        time,
        skills: skills.filter(skill => skill.trim() !== ''),
        location: address,
        lat: markerPosition[0],
        lng: markerPosition[1],
      };
      
      onCreateTask(newTask);
      onClose();
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
    setDescription('');
    setTime('Linh hoạt');
    setSkills(['']);
    setMarkerPosition([21.0285, 105.8544]); // Default to FPT
    setAddress('');
    setFormErrors({});
    setLocationError(null);
    setMapStyle('stadiaBright'); // Reset map style too
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-100 animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-blue-800">Tạo công việc mới</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto p-6 max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Form fields */}
            <div>
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề công việc <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Dọn dẹp nhà cửa, Sửa máy giặt..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
              </div>
              
              {/* Price */}
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="VD: 100000"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <span className="absolute right-3 top-2 text-gray-500">VNĐ</span>
                </div>
                {formErrors.price && <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>}
              </div>
              
              {/* Time/Duration */}
              <div className="mb-4">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian thực hiện
                </label>
                <select
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả công việc <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả chi tiết công việc cần thực hiện..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                ></textarea>
                {formErrors.description && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                )}
              </div>
              
              {/* Skills */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kỹ năng yêu cầu
                </label>
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      placeholder={`Kỹ năng ${index + 1}`}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {index === skills.length - 1 ? (
                      <button
                        type="button"
                        onClick={addSkillField}
                        className="ml-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        <Plus size={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeSkillField(index)}
                        className="ml-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        <Minus size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right column - Map and location */}
            <div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Vị trí công việc <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className={`flex items-center text-sm px-2 py-1 rounded ${
                      isGettingLocation 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {isGettingLocation ? (
                      <>
                        <Loader size={14} className="animate-spin mr-1" />
                        Đang tìm...
                      </>
                    ) : (
                      <>
                        <Compass size={14} className="mr-1" />
                        Vị trí hiện tại
                      </>
                    )}
                  </button>
                </div>

                {/* Map Style Selection */}
                <div className="mb-2 flex gap-1">
                  {Object.keys(tileProviders).map(style => (
                    <button
                      key={style}
                      type="button"
                      className={`text-xs px-2 py-1 rounded ${
                        mapStyle === style
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      onClick={() => setMapStyle(style)}
                    >
                      {tileProviders[style].name}
                    </button>
                  ))}
                </div>

                <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
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
                  <p className="text-red-500 text-xs mt-1">{locationError}</p>
                )}

                <p className="text-sm text-gray-500 mt-1">
                  Nhấp vào bản đồ để chọn vị trí hoặc sử dụng nút "Vị trí hiện tại"
                </p>

                {formErrors.location && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
                )}
              </div>
              
              {/* Location display */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ đã chọn
                </label>
                <div className="p-3 bg-gray-100 rounded-md min-h-[80px] break-words text-sm">
                  {address || "Chưa chọn vị trí"}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="border-t p-4 flex gap-3 justify-end bg-gray-50">
          <button 
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Tạo công việc
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
