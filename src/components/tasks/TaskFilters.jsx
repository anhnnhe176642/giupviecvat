import React, { useState, useEffect } from 'react';
import { MapPin, Sliders, ArrowDownAZ, FileText, Ruler, Tag } from 'lucide-react';
import { Range, getTrackBackground } from 'react-range';
import { getCategoryIconElement } from '../../utils/categoryHelpers';

function TaskFilters({
  showFilters,
  setShowFilters,
  locationActive,
  toggleLocation,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchRadius,
  setSearchRadius,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  selectedStatus,
  setSelectedStatus
}) {
  // Track active filter screen
  const [activeFilterScreen, setActiveFilterScreen] = useState('category'); // 'category', 'distance', 'sort_price', 'status'
  
  // Temporary price states for immediate UI feedback
  const [tempMinPrice, setTempMinPrice] = useState(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);
  // Temporary search radius for immediate UI feedback
  const [tempSearchRadius, setTempSearchRadius] = useState(searchRadius);

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };
  
  // Update temp states when props change
  useEffect(() => {
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
    setTempSearchRadius(searchRadius);
  }, [minPrice, maxPrice, searchRadius]);

  // Status options with corresponding styles
  const statusOptions = [
    { value: 'all', label: 'Tất cả', style: 'bg-gray-100 text-gray-800' },
    { value: 'open', label: 'Mở', style: 'bg-blue-100 text-blue-800' },
    { value: 'assigned', label: 'Đã giao', style: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Hoàn thành', style: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Đã hủy', style: 'bg-red-100 text-red-800' },
    { value: 'closed', label: 'Đã đóng', style: 'bg-gray-100 text-gray-800' }
  ];

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-3">
      {/* Location button */}
      <button
        onClick={toggleLocation}
        className={`p-2 rounded-full shadow-md w-10 h-10 flex items-center justify-center ${
          locationActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
        }`}
      >
        <MapPin size={20} />
      </button>
      {/* Filter button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`p-2 rounded-full shadow-md w-10 h-10 flex items-center justify-center ${
          showFilters ? 'bg-green-600 text-white' : 'bg-white text-gray-700'
        }`}
      >
        <Sliders size={20} />
      </button>

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-5 absolute top-10 right-0 bg-white rounded-lg shadow-lg p-4 w-64 animate-fade-in">
          <h3 className="font-semibold text-gray-800 mb-3">Bộ lọc</h3>
          
          {/* Filter navigation tabs */}
          <div className="flex border-b border-gray-200 mb-4 flex-wrap">
            <button 
              className={`flex-1 pb-2 text-xs font-medium text-center ${
                activeFilterScreen === 'category' 
                  ? 'border-b-2 border-green-500 text-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveFilterScreen('category')}
            >
              <FileText size={16} className="mx-auto mb-1" />
              Danh mục
            </button>
            <button 
              className={`flex-1 pb-2 text-xs font-medium text-center ${
                activeFilterScreen === 'distance' 
                  ? 'border-b-2 border-green-500 text-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveFilterScreen('distance')}
            >
              <Ruler size={16} className="mx-auto mb-1" />
              Km
            </button>
            <button 
              className={`flex-1 pb-2 text-xs font-medium text-center ${
                activeFilterScreen === 'status' 
                  ? 'border-b-2 border-green-500 text-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveFilterScreen('status')}
            >
              <Tag size={16} className="mx-auto mb-1" />
              Trạng thái
            </button>
            <button 
              className={`flex-1 pb-2 text-xs font-medium text-center ${
                activeFilterScreen === 'sort_price' 
                  ? 'border-b-2 border-green-500 text-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveFilterScreen('sort_price')}
            >
              <ArrowDownAZ size={16} className="mx-auto mb-1" />
              Sắp xếp
            </button>
          </div>
          
          {/* Category filter screen */}
          {activeFilterScreen === 'category' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn danh mục
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-50 overflow-y-auto pr-1">
                {categories.map((category) => {
                  // Check if this category is in the selected list
                  const isSelected = selectedCategory
                    ? selectedCategory.split(',').includes(category._id)
                    : false;
                    
                  return (
                    <button
                      key={category._id}
                      onClick={() => {
                        // Toggle category selection
                        let selectedCategories = selectedCategory ? selectedCategory.split(',') : [];
                        
                        // Special handling for "all" category
                        if (category._id === "all") {
                          // If "all" is clicked, deselect everything else and select only "all"
                          selectedCategories = ["all"];
                        } else {
                          if (isSelected) {
                            // Remove category if already selected
                            selectedCategories = selectedCategories.filter(id => id !== category._id);
                          } else {
                            // Add category if not selected
                            selectedCategories.push(category._id);
                            // If "all" was previously selected, remove it
                            selectedCategories = selectedCategories.filter(id => id !== "all");
                          }
                        }
                        
                        // Join back to comma-separated string and update state
                        setSelectedCategory(selectedCategories.join(','));
                      }}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                        isSelected
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {getCategoryIconElement(category)}
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Distance filter screen */}
          {activeFilterScreen === 'distance' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bán kính tìm kiếm
              </label>
              
              <div className="text-center text-lg font-semibold text-green-600 mb-2">
                {tempSearchRadius / 1000} km
              </div>
              
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={tempSearchRadius}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  setTempSearchRadius(newValue);
                }}
                onMouseUp={() => {
                  setSearchRadius(tempSearchRadius);
                }}
                onTouchEnd={() => {
                  setSearchRadius(tempSearchRadius);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1 km</span>
                <span>50 km</span>
              </div>
              
              {!locationActive && (
                <div className="mt-4 p-2 bg-amber-50 text-amber-700 rounded-lg text-xs text-center">
                  Bạn cần bật định vị để sử dụng tính năng này
                </div>
              )}
            </div>
          )}
          
          {/* Status filter screen */}
          {activeFilterScreen === 'status' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái công việc
              </label>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setSelectedStatus(status.value)}
                    className={`flex items-center justify-center gap-2 p-2 rounded-lg text-sm transition-all ${
                      selectedStatus === status.value
                        ? `${status.style} border border-gray-300 font-medium`
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Sorting and Price filter screen */}
          {activeFilterScreen === 'sort_price' && (
            <div>
              {/* Sorting options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sắp xếp theo
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_low">Giá thấp nhất</option>
                  <option value="price_high">Giá cao nhất</option>
                  {locationActive && <option value="nearest">Gần nhất</option>}
                </select>
              </div>
              
              {/* Price range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Khoảng giá
                </label>
                
                <div className="text-center text-sm font-medium text-green-600 mb-3">
                  {formatPrice(tempMinPrice)}đ - {formatPrice(tempMaxPrice)}đ
                </div>
                
                <div className="py-4">
                  <Range
                    step={100000}
                    min={0}
                    max={5000000}
                    values={[tempMinPrice, tempMaxPrice]}
                    onChange={(values) => {
                      setTempMinPrice(values[0]);
                      setTempMaxPrice(values[1]);
                    }}
                    onFinalChange={(values) => {
                      setMinPrice(values[0]);
                      setMaxPrice(values[1]);
                    }}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="w-full h-2 bg-gray-200 rounded-lg"
                        style={{
                          background: getTrackBackground({
                            values: [tempMinPrice, tempMaxPrice],
                            colors: ['#e5e7eb', '#10b981', '#e5e7eb'],
                            min: 0,
                            max: 5000000,
                          }),
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        className="w-5 h-5 bg-white border-2 border-green-500 rounded-full focus:outline-none shadow"
                      />
                    )}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0đ</span>
                  <span>5M+ đ</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskFilters;
