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

  if (!task || !task.offersList) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/5 backdrop-blur-sm"
         onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-fadeIn"
           onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-blue-800">{task.offers} đề nghị cho "{task.title}"</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Offers List */}
        <div className="overflow-y-auto flex-grow">
          {task.offersList.map(offer => (
            <div key={offer.id} className="border-b border-gray-200 p-6 hover:bg-gray-50">
              <div className="flex items-start">
                {/* User Avatar and Info */}
                <div className="flex-shrink-0 mr-4">
                  <img 
                    src={offer.avatar} 
                    alt={offer.name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                
                <div className="flex-grow">
                  {/* User Details */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{offer.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="flex items-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {offer.rating}
                        </div>
                        <div>
                          {offer.completedTasks} công việc đã hoàn thành
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-blue-600">{offer.price}</div>
                    </div>
                  </div>
                  
                  {/* Greeting Message */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <p className="text-gray-700">{offer.greeting}</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      Xem hồ sơ
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      onClick={() => window.location.href = '/chat'}
                    >
                      Liên hệ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
