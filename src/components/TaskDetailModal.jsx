import { X, MapPin, Calendar, Clock, Star, Award } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TaskDetailModal = ({ isOpen, onClose, task }) => {
  const navigate = useNavigate();
  
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

  const handleContactClick = () => {
    onClose(); // Close the modal first
    navigate('/chat'); // Navigate to chat page
  };

  if (!isOpen || !task) return null;
  
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
          <h2 className="text-xl font-bold text-blue-800">Chi tiết công việc</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
          
          {/* Price and badges */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-blue-600 text-xl font-bold">{task.price}k VNĐ</span>
            <div className="flex gap-2">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                <Clock size={12} className="mr-1" /> {task.time}
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Đang mở
              </span>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center mb-4 text-gray-600">
            <MapPin className="w-5 h-5 mr-2" /> 
            <span>{task.location}</span>
          </div>
          
          {/* Task description */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Mô tả công việc</h3>
            <p className="text-gray-700">
              {task.description || 'Tôi đang cần người giúp đỡ hoàn thành công việc này. Vui lòng liên hệ nếu bạn có kinh nghiệm và kỹ năng phù hợp. Công việc cần được hoàn thành trong thời gian sớm nhất.'}
            </p>
          </div>
          
          {/* Skills required */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Kỹ năng yêu cầu</h3>
            <div className="flex flex-wrap gap-2">
              {(task.skills || ['Cẩn thận', 'Tỉ mỉ', 'Đúng hẹn']).map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          {/* Task poster */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">Người đăng việc</h3>
            <div className="flex items-center">
              <img 
                src={task.posterImage || "https://randomuser.me/api/portraits/men/32.jpg"} 
                alt="Poster" 
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className="font-medium">{task.posterName || "Nguyễn Văn A"}</p>
                <div className="flex items-center text-sm">
                  <Star size={14} className="text-yellow-500 mr-1" />
                  <span className="mr-2">4.9</span>
                  <span className="text-gray-500">Thành viên từ T10/2022</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="border-t p-4 flex gap-3 justify-end bg-gray-50">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
          <button 
            onClick={handleContactClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Liên hệ ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
