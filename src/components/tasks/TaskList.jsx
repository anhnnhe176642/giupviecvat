import React from 'react';
import TaskCard from './TaskCard';

// Helper functions for status display
const getStatusText = (status) => {
  const statusMap = {
    'open': 'Mở',
    'assigned': 'Đã giao',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy',
    'closed': 'Đã đóng'
  };
  return statusMap[status] || 'Mở';
};

const getStatusStyle = (status) => {
  const styleMap = {
    'open': 'bg-blue-100 text-blue-800',
    'assigned': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'closed': 'bg-gray-100 text-gray-800'
  };
  return styleMap[status] || 'bg-blue-100 text-blue-800';
};

const TaskList = ({ 
  isLoading, 
  error, 
  filteredTasks, 
  selectedTask, 
  setSelectedTask, 
  handleViewTaskDetails, 
  getPosterName, 
  getPosterImage, 
  isLoadingMore, 
  hasMore, 
  loadMoreTasks 
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        <p className="mt-3 text-gray-500">Đang tải công việc...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="inline-block rounded-full h-12 w-12 bg-red-100 items-center justify-center">
          <span className="text-red-500 text-2xl">!</span>
        </div>
        <p className="mt-3 text-red-500">{error}</p>
        <button 
          className="mt-2 text-green-600 hover:underline"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!isLoading && filteredTasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Không tìm thấy công việc phù hợp.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredTasks.map((task, index) => (
        <TaskCard
          key={task._id || index}
          task={task}
          index={index}
          isSelected={selectedTask === index}
          onClick={setSelectedTask}
          onViewDetails={handleViewTaskDetails}
          getPosterImage={getPosterImage}
          getPosterName={getPosterName}
          statusText={getStatusText(task.status || 'open')}
          statusStyle={getStatusStyle(task.status || 'open')}
        />
      ))}
      
      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-2 text-sm text-gray-500">Đang tải thêm...</p>
        </div>
      )}
      
      {/* End of list message */}
      {!isLoadingMore && !hasMore && filteredTasks.length > 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Đã hiển thị tất cả công việc</p>
        </div>
      )}
      
      {/* Load more button (fallback for when scroll doesn't work) */}
      {!isLoading && !isLoadingMore && hasMore && (
        <div className="text-center py-3">
          <button
            onClick={loadMoreTasks}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Tải thêm
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
