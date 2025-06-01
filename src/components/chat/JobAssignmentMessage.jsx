import React from 'react';
import { ExternalLink } from 'lucide-react';

const JobAssignmentMessage = ({ job, onViewDetails, timestamp, sender }) => {
  return (
    <div className="col-start-1 col-end-9 p-3 rounded-lg">
      <div className="flex flex-row items-center">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          {sender}
        </div>
        <div className="relative ml-3 text-sm bg-white py-3 px-4 shadow rounded-xl">
          <div className="border-b border-gray-200 pb-2 mb-2">
            <div className="font-medium text-indigo-600 mb-1">Giao việc mới</div>
            <div>Đã giao cho bạn một công việc vào {job.timeSlot} ngày {job.date}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={onViewDetails} 
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center"
            >
              <ExternalLink size={12} className="mr-1" />
              Xem chi tiết
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors">
              Chấp nhận
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors">
              Từ chối
            </button>
          </div>
          <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">{timestamp}</div>
        </div>
      </div>
    </div>
  );
};

export default JobAssignmentMessage;
