import { X, MapPin, Calendar, Clock, Star, Award } from "lucide-react";
import { useEffect } from "react";

const JobDetailModal = ({ isOpen, onClose, job, onAccept, onDecline }) => {
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

  if (!isOpen || !job) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-100 animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center border-b p-4 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-blue-800">Chi tiết công việc được giao</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-2">{job.title || "Làm sạch và sắp xếp căn hộ"}</h1>
          
          {/* Price and badges */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-blue-600 text-xl font-bold">{job.price || "300k"} VNĐ</span>
            <div className="flex gap-2">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                <Clock size={12} className="mr-1" /> {job.time || "2 giờ"}
              </span>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                Đang chờ xác nhận
              </span>
            </div>
          </div>
          
          {/* Date and Time */}
          <div className="flex items-center mb-4 text-gray-600">
            <Calendar className="w-5 h-5 mr-2" /> 
            <span>{job.date || "23/05/2025"}, {job.timeSlot || "8:00 - 10:00"}</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center mb-4 text-gray-600">
            <MapPin className="w-5 h-5 mr-2" /> 
            <span>{job.location || "42 Nguyễn Huệ, Quận 1, TP. HCM"}</span>
          </div>
          
          {/* Task description */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Mô tả công việc</h3>
            <p className="text-gray-700">
              {job.description || 'Công việc bao gồm dọn dẹp căn hộ 2 phòng ngủ, lau sàn, dọn bếp và sắp xếp đồ đạc gọn gàng. Cần hoàn thành trong buổi sáng để chuẩn bị cho sự kiện vào buổi chiều.'}
            </p>
          </div>
          
          {/* Skills required */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Kỹ năng yêu cầu</h3>
            <div className="flex flex-wrap gap-2">
              {(job.skills || ['Cẩn thận', 'Tỉ mỉ', 'Đúng hẹn']).map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="border-t p-4 flex gap-3 justify-end bg-gray-50">
          <button 
            onClick={onDecline}
            className="px-5 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
          >
            Từ chối
          </button>
          <button 
            onClick={onAccept}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            Chấp nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
