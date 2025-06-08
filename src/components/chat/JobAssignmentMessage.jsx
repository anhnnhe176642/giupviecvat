import React from 'react';
import { ExternalLink, CheckCircle, XCircle, Clock, Trash } from 'lucide-react';

const JobAssignmentMessage = ({ job, onViewDetails, timestamp, sender, isOutgoing, onAccept, onDecline, onCancel, profilePicture }) => {
  // Function to format date in a more readable way
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (error) {
      return dateString || 'Không xác định';
    }
  };

  // Get correct status color and text
  const getStatusInfo = () => {
    if (!job) return { color: 'gray', text: 'Không xác định', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    
    switch (job.status) {
      case 'accepted':
        return { 
          color: 'green', 
          text: 'Đã chấp nhận', 
          bgColor: 'bg-green-100', 
          textColor: 'text-green-800',
          icon: <CheckCircle size={12} className="mr-1" />
        };
      case 'rejected':
        return { 
          color: 'red', 
          text: 'Đã từ chối', 
          bgColor: 'bg-red-100', 
          textColor: 'text-red-800',
          icon: <XCircle size={12} className="mr-1" />
        };
      case 'cancelled':
        return {
          color: 'gray',
          text: 'Đã huỷ',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: <Trash size={12} className="mr-1" />
        };
      default:
        return { 
          color: 'yellow', 
          text: 'Chờ phản hồi', 
          bgColor: 'bg-yellow-100', 
          textColor: 'text-yellow-800',
          icon: <Clock size={12} className="mr-1" />
        };
    }
  };

  const statusInfo = getStatusInfo();
  
  return (
    <div className="p-3 rounded-lg">
      <div className={`flex flex-row items-center ${isOutgoing ? 'justify-end' : ''}`}>
        {/* Only show avatar for incoming messages */}
        {!isOutgoing && (
          <div className="flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0 overflow-hidden">
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt={sender}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-indigo-500 text-white">
                {sender?.charAt(0) || '?'}
              </div>
            )}
          </div>
        )}
        
        <div 
          className={`relative text-sm py-3 px-4 shadow rounded-xl max-w-[85%] border-l-2
            ${isOutgoing ? 'bg-indigo-50 border-indigo-200 mr-2' : 'bg-white ml-3 border-' + statusInfo.color + '-400'}
          `}
        >
          <div className="border-b border-gray-200 pb-2 mb-2">
            <div className="font-medium text-indigo-600 mb-1 flex justify-between items-center">
              <span>📋 Thông tin công việc</span>
              <span className={`text-xs ${statusInfo.bgColor} ${statusInfo.textColor} px-2 py-0.5 rounded-full flex items-center ml-2`}>
                {statusInfo.icon} {statusInfo.text}
              </span>
            </div>
            <div className="font-semibold text-gray-800">{job?.title || 'Không có tiêu đề'}</div>
            <div className="text-gray-600 text-xs mt-1 flex items-center">
              <span className="mr-3">{formatDate(job?.date)} {job?.timeSlot || ''}</span>
              <span>{job?.price || ''}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={onViewDetails} 
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center"
            >
              <ExternalLink size={12} className="mr-1" />
              Xem chi tiết
            </button>
            
            {/* Show different action buttons based on whether the user is the sender or receiver */}
            {job?.status === 'pending' && (
              <>
                {/* If user is job creator, show cancel option */}
                {isOutgoing ? (
                  <button 
                    onClick={onCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    <Trash size={12} className="mr-1 inline" />
                    Huỷ công việc
                  </button>
                ) : (
                  /* If user is job receiver, show accept/decline options */
                  <>
                    <button 
                      onClick={onAccept}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      Chấp nhận
                    </button>
                    <button 
                      onClick={onDecline}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      Từ chối
                    </button>
                  </>
                )}
              </>
            )}
          </div>
          
          <div className={`absolute text-xs bottom-0 ${isOutgoing ? 'left-0 -mb-5 ml-2' : 'right-0 -mb-5 mr-2'} text-gray-500`}>
            {timestamp}
          </div>
        </div>
        
        {/* Only show avatar for outgoing messages on the right */}
        {isOutgoing && (
          <div className="flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0 overflow-hidden">
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt={sender}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-indigo-600 text-white">
                {sender?.charAt(0) || 'Me'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobAssignmentMessage;
