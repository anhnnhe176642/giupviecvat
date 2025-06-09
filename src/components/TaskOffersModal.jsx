import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const TaskOffersModal = ({ task, onClose }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
         onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden border-0 animate-in zoom-in-95 duration-200"
           onClick={e => e.stopPropagation()}
           style={{boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)'}}>
        {/* Header */}
        <div className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-50 via-white to-blue-50 shrink-0 border-b border-gray-100">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            {task.offers && task.offers.length > 0 ? 
              `${task.offers.length} đề nghị cho "${task.title}"` : 
              `Đề nghị cho "${task.title}"`}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-50 rounded-full p-1.5 transition-all shadow-sm border border-gray-100 hover:border-gray-200"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Offers List */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {!task.offers || task.offers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg font-medium">Chưa có đề nghị nào cho công việc này</p>
              <p className="text-gray-400 mt-2">Các đề nghị sẽ xuất hiện ở đây khi ai đó quan tâm đến công việc của bạn</p>
            </div>
          ) : (
            task.offers.map(offer => (
              <div key={offer.conversationId} className="border-b border-gray-100 p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  {/* User Avatar and Info */}
                  <div className="flex-shrink-0 mr-4">
                    <img 
                      src={offer.sender.profilePicture || "https://cdn-icons-png.flaticon.com/512/10337/10337609.png"} 
                      alt={offer.sender.name} 
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md flex-shrink-0"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    {/* User Details */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{offer.sender.name}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="text-gray-500">
                            Ngày: {new Date(offer.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Last Message */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                      <p className="text-gray-700">{offer.lastMessage || "Chưa có tin nhắn"}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                      <button className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium hover:border-gray-300">
                        Xem hồ sơ
                      </button>
                      <button
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md font-medium"
                        onClick={() => window.location.href = `/chat/conversation/${offer.conversationId}`}
                      >
                        Liên hệ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-5 flex justify-end bg-gradient-to-r from-gray-50 to-white shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium hover:border-gray-300"
          >
            Đóng
          </button>
        </div>
      </div>
      
      {/* Add custom scrollbar styles */}
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

export default TaskOffersModal;
