import React from 'react';
import { MapPin, Calendar } from "lucide-react";

const TaskCard = ({ task, index, isSelected, onClick, onViewDetails, getPosterImage, getPosterName }) => {
  const formatVND = (amount) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  
  return (
    <div
      key={task._id || index}
      className={`task-item border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "bg-green-50 border-green-300 shadow-md"
          : "hover:bg-gray-50 border-gray-200"
      }`}
      onClick={() => onClick(index)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-900 leading-tight">
          {task.title}
        </h3>
        <span className="text-green-600 font-bold text-lg">
          {formatVND(task.price)}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-600 mt-2">
        <MapPin className="w-4 h-4 mr-1.5 text-green-500" /> {task.location}
      </div>
      <div className="flex items-center text-sm text-gray-600 mt-1.5">
        <Calendar className="w-4 h-4 mr-1.5 text-green-500" /> {task.time}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {task.skills && task.skills.slice(0, 2).map((skill, idx) => (
          <span
            key={idx}
            className="bg-gray-100 text-xs px-2 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
        {task.skills && task.skills.length > 2 && (
          <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
            +{task.skills.length - 2}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between text-sm mt-3 pt-2 border-t border-gray-100">
        <div className="flex items-center">
          <img
            src={getPosterImage(task)}
            alt={getPosterName(task)}
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="text-gray-700">{getPosterName(task)}</span>
        </div>
        <button
          className="text-green-600 hover:text-green-800 font-medium bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(index);
          }}
        >
          Chi tiết
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
