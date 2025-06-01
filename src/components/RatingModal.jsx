import React, { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';

const RatingModal = ({ isOpen, onClose, task, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

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

  const handleSubmit = () => {
    onSubmit({
      taskId: task.id,
      rating,
      comment,
      taskerId: task.taskerId || task.tasker // Depending on your data structure
    });
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-blue-800">Đánh giá công việc</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-medium mb-2">{task.title}</h3>
          <p className="text-gray-600 mb-6">Thực hiện bởi: {task.tasker}</p>
          
          {/* Star Rating */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Đánh giá chất lượng công việc</h4>
            <div className="flex items-center justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    fill={(hoveredRating || rating) >= star ? '#FFD700' : 'none'}
                    stroke={(hoveredRating || rating) >= star ? '#FFD700' : '#CBD5E0'}
                    className="transition-all duration-150"
                  />
                </button>
              ))}
            </div>
            <p className="text-center mt-2 text-sm text-gray-600">
              {rating ? `Bạn đã đánh giá ${rating} sao` : 'Nhấn vào sao để đánh giá'}
            </p>
          </div>
          
          {/* Comment */}
          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Nhận xét của bạn (tùy chọn)
            </label>
            <textarea
              id="comment"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ cảm nhận của bạn về chất lượng công việc..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="border-t p-4 flex gap-3 justify-end bg-gray-50">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSubmit}
            disabled={rating === 0}
            className={`px-4 py-2 rounded-lg text-white transition-colors shadow-sm ${
              rating > 0 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
