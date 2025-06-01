import React from 'react';
import { MapPin } from 'lucide-react';

const SystemCard = ({ job }) => {
  return (
    <div className="col-start-3 col-end-11 p-3 rounded-lg">
      <div className="bg-white py-3 px-4 shadow rounded-xl border border-indigo-100">
        <div className="border-b border-gray-200 pb-2 mb-2 text-center">
          <div className="font-medium text-indigo-600 mb-1">Thông tin công việc</div>
        </div>
        <div className="mb-2">
          <div className="font-semibold text-gray-800 text-center">{job.title}</div>
          <div className="flex items-center text-sm text-gray-600 mt-2 justify-center">
            <MapPin size={14} className="mr-1" /> 
            <span>{job.location}</span>
          </div>
          <div className="flex justify-between mt-3 px-2">
            <span className="text-blue-600 font-semibold">{job.price} VNĐ</span>
            <span className="text-gray-500 text-xs">{job.time} làm việc</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">Đã đăng 1 giờ trước</div>
      </div>
    </div>
  );
};

export default SystemCard;
