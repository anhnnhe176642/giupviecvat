import React, { useState, useEffect, useContext } from "react";
import { X, MapPin, Calendar, Clock, Star, Award, Edit, Trash2, Loader, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../conext/AuthContext";
import EditTaskModal from "./tasks/EditTaskModal";
import toast from "react-hot-toast";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from "axios"; // Add axios import

// Function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Helper functions for status display
const getStatusText = (status) => {
  const statusMap = {
    'open': 'Đang mở',
    'assigned': 'Đã giao',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy',
    'closed': 'Đã đóng'
  };
  return statusMap[status] || 'Đang mở';
};

const getStatusStyle = (status) => {
  const styleMap = {
    'open': 'bg-green-50 text-green-700',
    'assigned': 'bg-yellow-50 text-yellow-700',
    'completed': 'bg-blue-50 text-blue-700',
    'cancelled': 'bg-red-50 text-red-700',
    'closed': 'bg-gray-50 text-gray-700'
  };
  return styleMap[status] || 'bg-green-50 text-green-700';
};

const TaskDetailModal = ({ isOpen, onClose, task, onEditTask, onDeleteTask }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Check if current user is the task poster
  const isTaskOwner = user && task && task.poster && user._id === task.poster._id;
  
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

  const handleContactClick = async () => {
    try {
      // Send POST request to create a conversation
      const response = await axios.post(`/conversations/posttask/${task._id}`);
      
      // Check if response contains conversation ID
      if (response.data && response.data.conversation._id) {
        onClose(); // Close the modal first
        // Navigate to the specific conversation
        navigate(`/chat/conversation/${response.data.conversation._id}`);
      } else {
        throw new Error('Conversation ID not found in response');
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Không thể tạo cuộc trò chuyện. Vui lòng thử lại sau.");
      onClose();
    }
  };
  
  const handleEditClick = () => {
    setShowEditModal(true);
  };
  
  const handleDeleteClick = async () => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa công việc này?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            setIsDeleting(true);
            try {
              await onDeleteTask(task._id);
              setIsDeleting(false);
              onClose();
              toast.success("Xóa công việc thành công");
            } catch (error) {
              console.error("Error deleting task:", error);
              setIsDeleting(false);
              toast.error("Không thể xóa công việc. Vui lòng thử lại sau.");
            }
          },
          className: 'bg-red-600 text-white hover:bg-red-700'
        },
        {
          label: 'Không',
          onClick: () => {},
          className: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
      overlayClassName: "confirm-alert-overlay",
      customUI: ({ title, message, onClose, buttons }) => (
        <div className='bg-white rounded-xl shadow-lg p-6 min-w-[300px] max-w-md'>
          <h1 className='text-xl font-bold text-gray-800 mb-2'>{title}</h1>
          <p className='text-gray-600 mb-6'>{message}</p>
          <div className='flex justify-end gap-3'>
            {buttons.map((button, i) => (
              <button
                key={i}
                onClick={() => {
                  button.onClick();
                  onClose();
                }}
                className={`px-4 py-2 rounded-lg font-medium ${button.className}`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      )
    });
  };

  const handleEditTask = (editedTask) => {
    // Pass the entire editedTask object to the parent component
    onEditTask(editedTask);
  };

  if (!isOpen || !task) return null;
  
  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border-0 animate-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
          style={{boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)'}}
        >
          {/* Header with close button */}
          <div className="flex justify-between items-center p-5 bg-gradient-to-r from-emerald-50 via-white to-green-50 shrink-0 border-b border-gray-100">
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">Chi tiết công việc</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-50 rounded-full p-1.5 transition-all shadow-sm border border-gray-100 hover:border-gray-200"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 p-6 custom-scrollbar">
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800 break-all">{task.title}</h1>
              
              {/* Price and badges */}
              <div className="flex flex-wrap items-center justify-between pb-5 gap-4 border-b border-gray-100">
                <span className="text-emerald-600 text-2xl font-bold">{formatCurrency(task.price)}</span>
                <div className="flex gap-2">
                  <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full flex items-center font-medium shadow-sm">
                    <Clock size={12} className="mr-1.5" /> {task.time}
                  </span>
                  <span className={`${getStatusStyle(task.status)} text-xs px-3 py-1.5 rounded-full font-medium shadow-sm`}>
                    {getStatusText(task.status)}
                  </span>
                </div>
              </div>
              
              {/* Task details */}
              <div className="space-y-6">
                {/* Posted Date */}
                <div className="flex items-center text-gray-600 rounded-lg p-3 bg-gray-50 shadow-sm">
                  <Calendar className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" /> 
                  <span>Đăng ngày: <span className="font-medium text-gray-700">{formatDate(task.createdAt)}</span></span>
                </div>
                
                {/* Location */}
                <div className="flex items-center text-gray-600 rounded-lg p-3 bg-gray-50 shadow-sm">
                  <MapPin className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" /> 
                  <span className="font-medium text-gray-700">{task.location}</span>
                </div>
                
                {/* Category */}
                <div className="flex items-center text-gray-600 rounded-lg p-3 bg-gray-50 shadow-sm">
                  <Tag className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" /> 
                  <span className="font-medium text-gray-700">{task.category?.name || "Chưa phân loại"}</span>
                </div>
                
                {/* Task description */}
                <div className="pt-2">
                  <h3 className="font-semibold text-gray-800 mb-3 text-lg">Mô tả công việc</h3>
                  <p className="text-gray-700 bg-white p-4 rounded-xl shadow-sm border border-gray-100 break-words">
                    {task.description || 'Tôi đang cần người giúp đỡ hoàn thành công việc này. Vui lòng liên hệ nếu bạn có kinh nghiệm và kỹ năng phù hợp. Công việc cần được hoàn thành trong thời gian sớm nhất.'}
                  </p>
                </div>
                
                {/* Skills required */}
                <div className="pt-2">
                  <h3 className="font-semibold text-gray-800 mb-3 text-lg">Kỹ năng yêu cầu</h3>
                  <div className="flex flex-wrap gap-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    {(task.skills && task.skills.length > 0) ? (
                      task.skills.map((skill, index) => (
                        <span key={index} className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm border-0">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">Không có kỹ năng yêu cầu</span>
                    )}
                  </div>
                </div>
                
                {/* Task poster */}
                <div className="mt-6 p-5 bg-gradient-to-r from-green-50 via-emerald-50 to-white rounded-xl shadow-sm overflow-hidden relative">
                  <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg relative">Người đăng việc</h3>
                  <div className="flex items-center relative">
                    <img 
                      src={task.poster?.profilePicture || "https://cdn-icons-png.flaticon.com/512/10337/10337609.png"} 
                      alt="Poster" 
                      className="w-14 h-14 rounded-full mr-4 object-cover ring-4 ring-white shadow-md flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{task.poster?.name || "Người dùng TaskerAir"}</p>
                      <div className="flex flex-wrap items-center text-sm mt-1 gap-2">
                        <div className="bg-yellow-50 border border-yellow-100 px-2 py-0.5 rounded-md flex items-center">
                          <Star size={14} className="text-yellow-500 mr-1" />
                          <span className="font-medium text-yellow-700">{task.poster?.rating || "N/A"}</span>
                        </div>
                        <span className="text-gray-500 truncate">
                          Thành viên từ {task.poster?.createdAt ? 
                            new Date(task.poster.createdAt).toLocaleDateString('vi-VN', {month: 'short', year: 'numeric'}) : 
                            "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action buttons - fixed at bottom */}
          <div className="border-t border-gray-100 p-5 flex flex-wrap gap-3 justify-end bg-gradient-to-r from-gray-50 to-white shrink-0">
            {isTaskOwner ? (
              // Show edit/delete options for task owner
              <>
                <button 
                  onClick={onClose}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium hover:border-gray-300"
                >
                  Đóng
                </button>
                <button 
                  onClick={handleEditClick}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all shadow-md flex items-center font-medium"
                >
                  <Edit size={16} className="mr-2" /> Chỉnh sửa
                </button>
                <button 
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md flex items-center font-medium disabled:opacity-70"
                >
                  {isDeleting ? (
                    <>
                      <Loader size={16} className="mr-2 animate-spin" /> Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-2" /> Xóa
                    </>
                  )}
                </button>
              </>
            ) : (
              // Show contact button for non-owners
              <>
                <button 
                  onClick={onClose}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium hover:border-gray-300"
                >
                  Đóng
                </button>
                <button 
                  onClick={handleContactClick}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg hover:from-emerald-700 hover:to-green-800 transition-all shadow-md font-medium"
                >
                  Liên hệ ngay
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Add global styles for custom scrollbar and grid pattern */}
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
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
      
      {/* Edit Task Modal */}
      {showEditModal && (
        <EditTaskModal 
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          task={task}
          onEditTask={(editedTask) => {
            handleEditTask(editedTask);
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
};

export default TaskDetailModal;
