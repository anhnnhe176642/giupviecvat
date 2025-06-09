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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/5 backdrop-blur-sm"
         onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-fadeIn"
           onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-blue-800">
            {task.offers && task.offers.length > 0 ? 
              `${task.offers.length} đề nghị cho "${task.title}"` : 
              `Đề nghị cho "${task.title}"`}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Offers List */}
        <div className="overflow-y-auto flex-grow">
          {!task.offers || task.offers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg">Chưa có đề nghị nào cho công việc này</p>
              <p className="text-gray-400 mt-2">Các đề nghị sẽ xuất hiện ở đây khi ai đó quan tâm đến công việc của bạn</p>
            </div>
          ) : (
            task.offers.map(offer => (
              <div key={offer.conversationId} className="border-b border-gray-200 p-6 hover:bg-gray-50">
                <div className="flex items-start">
                  {/* User Avatar and Info */}
                  <div className="flex-shrink-0 mr-4">
                    <img 
                      src={offer.sender.profilePicture} 
                      alt={offer.sender.name} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    {/* User Details */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{offer.sender.name}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="text-gray-500">
                            Ngày: {new Date(offer.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Last Message */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                      <p className="text-gray-700">{offer.lastMessage || "Chưa có tin nhắn"}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        Xem hồ sơ
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
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
        <div className="border-t p-4 flex justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskOffersModal;
