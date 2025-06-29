import React, { useState, useEffect } from 'react';
import { X, Upload, Palette, Loader } from 'lucide-react';

const CategoryModal = ({ isOpen, onClose, onSave, category }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#10b981', // Màu của icon
    iconSvg: '',
    price: 0,
    description: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formattedPrice, setFormattedPrice] = useState('');

  // Predefined colors for quick selection
  const predefinedColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc',
    '#d946ef', '#ec4899', '#f43f5e', '#6b7280', '#374151'
  ];

  // Predefined icon SVGs for common categories
  const predefinedIcons = [
    {
      name: 'Nhà cửa',
      svg: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>'
    },
    {
      name: 'Dọn dẹp',
      svg: '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>'
    },
    {
      name: 'Giao hàng',
      svg: '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>'
    },
    {
      name: 'Công cụ',
      svg: '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>'
    },
    {
      name: 'Nấu ăn',
      svg: '<circle cx="12" cy="12" r="8"></circle><path d="M12 8v4l2 2"></path>'
    },
    {
      name: 'Người',
      svg: '<circle cx="12" cy="8" r="4"></circle><path d="M6 20v-2a6 6 0 0 1 12 0v2"></path>'
    },
    {
      name: 'Xe',
      svg: '<circle cx="12" cy="12" r="4"></circle><path d="M4 20l8-8 8 8"></path>'
    },
    {
      name: 'Khác',
      svg: '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>'
    }
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name || '',
          color: category.color || '#10b981', // Màu của icon
          iconSvg: category.iconSvg || '',
          price: category.price || 0,
          description: category.description || '',
          isActive: category.isActive !== undefined ? category.isActive : true
        });
        setFormattedPrice(formatVND(category.price || 0));
      } else {
        setFormData({
          name: '',
          color: '#10b981', // Màu của icon
          iconSvg: '',
          price: 0,
          description: '',
          isActive: true
        });
        setFormattedPrice('');
      }
      setErrors({});
    }
  }, [isOpen, category]);

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

  // Format VND currency
  const formatVND = (val) => {
    if (!val) return '';
    if(typeof val !== 'string') val = val.toString();
    const number = parseInt(val.replace(/\D/g, ''), 10) || 0;
    return number.toLocaleString('vi-VN');
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục không được để trống';
    }

    if (!formData.color) {
      newErrors.color = 'Màu icon không được để trống';
    }

    if (!formData.iconSvg.trim()) {
      newErrors.iconSvg = 'Icon SVG không được để trống';
    }

    if (formData.price < 0) {
      newErrors.price = 'Giá không được âm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Extract SVG content before saving (remove outer <svg> tag)
      const processedFormData = {
        ...formData,
        iconSvg: extractSvgContent(formData.iconSvg)
      };
      
      await onSave(processedFormData);
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
    if (errors.color) {
      setErrors(prev => ({
        ...prev,
        color: ''
      }));
    }
  };

  // Handle icon selection
  const handleIconSelect = (iconSvg) => {
    setFormData(prev => ({
      ...prev,
      iconSvg
    }));
    if (errors.iconSvg) {
      setErrors(prev => ({
        ...prev,
        iconSvg: ''
      }));
    }
  };

  // Function to render SVG - handles both SVG paths and full SVG tags
  const renderSvg = (svgContent, color = formData.color, size = 20) => {
    if (!svgContent) return null;

    // Check if it's a full SVG tag
    if (svgContent.trim().startsWith('<svg')) {
      // Parse the SVG and clean up color attributes
      let svgWithColor = svgContent;
      
      // Remove stroke attributes to let CSS handle it
      svgWithColor = svgWithColor.replace(/\s*stroke="[^"]*"/g, '');
      
      // Remove fill attributes except fill="none"
      svgWithColor = svgWithColor.replace(/\s*fill="(?!none)[^"]*"/g, '');
      
      // Remove color attributes
      svgWithColor = svgWithColor.replace(/\s*color="[^"]*"/g, '');
      
      // Ensure the SVG has proper sizing
      if (!svgWithColor.includes('width=')) {
        svgWithColor = svgWithColor.replace(/<svg([^>]*)>/i, `<svg$1 width="${size}" height="${size}">`);
      }
      
      return (
        <div
          dangerouslySetInnerHTML={{ __html: svgWithColor }}
          style={{ 
            width: size, 
            height: size, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: color, // This will be used by currentColor
            stroke: color, // Default stroke color
            fill: color // Default fill color for elements without fill="none"
          }}
        />
      );
    } else {
      // It's SVG path content - remove color attributes
      let processedContent = svgContent;
      
      // Remove stroke attributes
      processedContent = processedContent.replace(/\s*stroke="[^"]*"/g, '');
      
      // Remove fill attributes except fill="none"
      processedContent = processedContent.replace(/\s*fill="(?!none)[^"]*"/g, '');
      
      // Remove color attributes
      processedContent = processedContent.replace(/\s*color="[^"]*"/g, '');
      
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: color }} // Support for currentColor
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      );
    }
  };

  // Function to extract SVG content (remove outer svg tag, keep only inner content)
  const extractSvgContent = (svgString) => {
    if (!svgString) return '';
    
    const trimmed = svgString.trim();
    let result = '';
    
    // If it's already just SVG content (not wrapped in <svg>), process it directly
    if (!trimmed.startsWith('<svg')) {
      result = trimmed;
    } else {
      // Extract content between <svg> and </svg>
      const match = trimmed.match(/<svg[^>]*>(.*?)<\/svg>/s);
      if (match && match[1]) {
        result = match[1].trim();
      } else {
        // Fallback: if no closing tag found, try to extract everything after the opening tag
        const openTagMatch = trimmed.match(/<svg[^>]*>(.*)/s);
        if (openTagMatch && openTagMatch[1]) {
          result = openTagMatch[1].replace(/<\/svg>$/, '').trim();
        } else {
          result = trimmed;
        }
      }
    }
    
    // Clean up color attributes from the extracted content
    result = result.replace(/\s*stroke="[^"]*"/g, '');
    result = result.replace(/\s*fill="(?!none)[^"]*"/g, '');
    result = result.replace(/\s*color="[^"]*"/g, '');
    
    return result;
  };

  // Handle price change with formatting
  const handlePriceChange = (e) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      price: parseInt(numericValue) || 0
    }));
    setFormattedPrice(formatVND(numericValue));
    
    if (errors.price) {
      setErrors(prev => ({
        ...prev,
        price: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-2xl max-h-[90vh] overflow-hidden border-0 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
        style={{boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)'}}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 bg-gradient-to-r from-emerald-50 via-white to-green-50 shrink-0 border-b border-gray-100">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
            {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-50 rounded-full p-1.5 transition-all shadow-sm border border-gray-100 hover:border-gray-200"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="overflow-y-auto p-6 max-h-[70vh] custom-scrollbar">
            <div className="space-y-5">
              {/* Category Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên danh mục"
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Màu icon <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm bg-gray-100 flex items-center justify-center"
                  >
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: formData.color }}
                    ></div>
                  </div>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleColorSelect(e.target.value)}
                    className="w-16 h-10 border border-gray-200 rounded-lg cursor-pointer shadow-sm"
                  />
                  <span className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">{formData.color}</span>
                </div>
                <div className="grid grid-cols-10 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                        formData.color === color ? 'border-gray-600 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                {errors.color && <p className="text-red-500 text-xs mt-1.5">{errors.color}</p>}
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Icon SVG <span className="text-red-500">*</span>
                </label>
                <div className="mb-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 border-2 border-gray-300 shadow-sm"
                    >
                      {formData.iconSvg && renderSvg(formData.iconSvg)}
                    </div>
                    <span className="text-sm text-gray-600">Xem trước icon</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {predefinedIcons.map((icon) => (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => handleIconSelect(icon.svg)}
                        className={`p-3 border rounded-lg hover:bg-gray-50 transition-all ${
                          formData.iconSvg === icon.svg ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                        }`}
                        title={icon.name}
                      >
                        <div className="w-6 h-6 mx-auto flex items-center justify-center">
                          {renderSvg(icon.svg, formData.color, 20)}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{icon.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  name="iconSvg"
                  value={formData.iconSvg}
                  onChange={handleInputChange}
                  placeholder="Nhập SVG path hoặc full SVG tag, VD: <svg>...</svg> hoặc <path d='...'></path>"
                  rows="4"
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm font-mono text-sm ${
                    errors.iconSvg ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Có thể nhập:
                  <br />• SVG path: <code className="bg-gray-100 px-1 rounded">&lt;path d="M3 9l9-7..."&gt;&lt;/path&gt;</code>
                  <br />• Full SVG: <code className="bg-gray-100 px-1 rounded">&lt;svg&gt;...&lt;/svg&gt;</code>
                  <br />• <strong>Note:</strong> Các thuộc tính màu (stroke, fill, color) sẽ bị xóa để sử dụng màu đã chọn
                  <br />• <strong>Tip:</strong> Giữ lại <code className="bg-gray-100 px-1 rounded">fill="none"</code> để chỉ hiển thị đường viền
                  <br />• <strong>Lưu ý:</strong> Khi lưu, chỉ nội dung bên trong thẻ SVG sẽ được giữ lại
                <br />
                • Tham khảo icon miễn phí: <a href="https://freesvgicons.com/packs/carbon" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline hover:text-emerald-800">freesvgicons.com/packs/carbon</a>
                </div>
                {errors.iconSvg && <p className="text-red-500 text-xs mt-1.5">{errors.iconSvg}</p>}
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Giá cơ bản (VNĐ)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="price"
                    value={formattedPrice}
                    onChange={handlePriceChange}
                    placeholder="VD: 50,000"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm ${
                      errors.price ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  <span className="absolute right-3 top-2.5 text-gray-500 font-medium">VNĐ</span>
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1.5">{errors.price}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả danh mục..."
                  rows="4"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-gray-50 rounded-lg border border-gray-100">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Kích hoạt danh mục</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="border-t border-gray-100 p-5 flex gap-3 justify-end bg-gradient-to-r from-gray-50 to-white shrink-0">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium hover:border-gray-300"
            >
              Hủy
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  Đang lưu...
                </>
              ) : (
                category ? 'Cập nhật' : 'Tạo mới'
              )}
            </button>
          </div>
        </form>
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

export default CategoryModal;
