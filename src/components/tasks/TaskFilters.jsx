import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Sliders, ArrowDownAZ, FileText, Ruler } from 'lucide-react';
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
  setSortBy
}) {
  // Track active filter screen
  const [activeFilterScreen, setActiveFilterScreen] = useState('category'); // 'category', 'distance', 'sort_price'
  
  // Temporary price states for immediate UI feedback
  const [tempMinPrice, setTempMinPrice] = useState(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);
  // Temporary search radius for immediate UI feedback
  const [tempSearchRadius, setTempSearchRadius] = useState(searchRadius);
  
  // Reference for timeout to implement debouncing
  const priceTimeoutRef = useRef(null);
  const radiusTimeoutRef = useRef(null);

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
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (priceTimeoutRef.current) {
        clearTimeout(priceTimeoutRef.current);
      }
      if (radiusTimeoutRef.current) {
        clearTimeout(radiusTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      {/* Filter button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`p-2 rounded-full shadow-md w-10 h-10 flex items-center justify-center ${
          showFilters ? 'bg-green-600 text-white' : 'bg-white text-gray-700'
        }`}
      >
        <Sliders size={20} />
      </button>

      {/* Location button */}
      <button
        onClick={toggleLocation}
        className={`p-2 rounded-full shadow-md w-10 h-10 flex items-center justify-center ${
          locationActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
        }`}
      >
        <MapPin size={20} />
      </button>

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-5 absolute top-20 right-0 bg-white rounded-lg shadow-lg p-4 w-64 animate-fade-in">
          <h3 className="font-semibold text-gray-800 mb-3">Bộ lọc</h3>
          
          {/* Filter navigation tabs */}
          <div className="flex border-b border-gray-200 mb-4">
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
              Khoảng cách
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
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category._id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                      selectedCategory === category._id
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {getCategoryIconElement(category.name)}
                    <span>{category.name}</span>
                  </button>
                ))}
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
                max="500000"
                step="1000"
                value={tempSearchRadius}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  setTempSearchRadius(newValue);
                  
                  // Debounce the actual state update
                  if (radiusTimeoutRef.current) {
                    clearTimeout(radiusTimeoutRef.current);
                  }
                  
                  radiusTimeoutRef.current = setTimeout(() => {
                    setSearchRadius(newValue);
                  }, 100);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1 km</span>
                <span>500 km</span>
              </div>
              
              {!locationActive && (
                <div className="mt-4 p-2 bg-amber-50 text-amber-700 rounded-lg text-xs text-center">
                  Bạn cần bật định vị để sử dụng tính năng này
                </div>
              )}
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
                    max={10000000}
                    values={[tempMinPrice, tempMaxPrice]}
                    onChange={(values) => {
                      setTempMinPrice(values[0]);
                      setTempMaxPrice(values[1]);
                      
                      // Debounce the actual state update
                      if (priceTimeoutRef.current) {
                        clearTimeout(priceTimeoutRef.current);
                      }
                      
                      priceTimeoutRef.current = setTimeout(() => {
                        setMinPrice(values[0]);
                        setMaxPrice(values[1]);
                      }, 100);
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
                            max: 10000000,
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
                  <span>10M+ đ</span>
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
