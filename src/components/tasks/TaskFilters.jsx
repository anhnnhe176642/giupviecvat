import React from 'react';
import { Filter, Compass } from "lucide-react";

const TaskFilters = ({ 
  showFilters, 
  setShowFilters, 
  locationActive, 
  toggleLocation,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchRadius,
  setSearchRadius 
}) => {
  return (
    <div className="absolute top-2 right-2 z-10 flex gap-2">
      {/* Location button */}
      <button
        className={`${
          locationActive ? "bg-green-600 text-white" : "bg-white text-gray-700"
        } px-4 py-2 rounded-md shadow hover:bg-${locationActive ? "green-700" : "gray-100"} text-sm font-medium flex items-center transition-colors duration-200`}
        onClick={toggleLocation}
      >
        <Compass className="w-4 h-4 mr-2" />
        {locationActive ? "Đang định vị" : "Định vị"}
      </button>

      {/* Filter button */}
      <button
        className="bg-white px-4 py-2 rounded-md shadow hover:bg-gray-100 text-sm font-medium flex items-center"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter className="w-4 h-4 mr-2" />
        Bộ lọc
      </button>

      {showFilters && (
        <div className="absolute right-0 mt-12 w-72 bg-white rounded-md shadow-lg p-4">
          {/* Category chips */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục công việc
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition-all`}
                  style={
                    selectedCategory === category.name
                      ? {
                          backgroundColor: category.color,
                          color: "white",
                        }
                      : { backgroundColor: "#f3f4f6", color: "#374151" }
                  }
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.icon}
                  <span className="ml-1">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Radius slider - only show when location is active */}
          {locationActive && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bán kính tìm kiếm: {searchRadius/1000} km
              </label>
              <div className="flex items-center">
                <span className="mr-2 text-xs">1km</span>
                <input
                  type="range"
                  min="1000"
                  max="500000"
                  step="1000"
                  className="flex-1 accent-green-600"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                />
                <span className="ml-2 text-xs">500km</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
