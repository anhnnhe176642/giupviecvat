import React, { useState, useEffect, useContext } from 'react';
import TaskOffersModal from '../components/TaskOffersModal';
import RatingModal from '../components/RatingModal';
import { AuthContext } from '../conext/AuthConext';
import axios from 'axios';

const MyTasks = () => {
  const [activeTab, setActiveTab] = useState('posted');
  const [tasks, setTasks] = useState({
    posted: [],
    assigned: [],
    completed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOffersPopup, setShowOffersPopup] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { user } = useContext(AuthContext);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 5,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Function to fetch tasks based on active tab
  const fetchTasks = async (page = 1) => {
    if (!user?._id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Determine status based on activeTab
      let status;
      switch (activeTab) {
        case 'posted':
          status = 'open'; // Tasks posted but not assigned yet
          break;
        case 'assigned':
          status = 'assigned'; // Tasks that are assigned and in progress
          break;
        case 'completed':
          status = 'completed'; // Completed tasks
          break;
        default:
          status = 'open';
      }
      
      const response = await axios.get('/tasks', {
        params: {
          poster: user._id,
          status: status,
          page: page,
          limit: pagination.limit
        }
      });
      
      if (response.data.success) {
        // Update tasks based on the active tab
        setTasks(prev => ({
          ...prev,
          [activeTab]: response.data.tasks
        }));
        
        // Update pagination state
        setPagination(response.data.pagination);
      } else {
        setError('Failed to load tasks');
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Error loading tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks when tab changes or user changes
  useEffect(() => {
    fetchTasks(1); // Reset to first page when tab changes
  }, [activeTab, user?._id]);

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchTasks(newPage);
  };

  const openOffersPopup = (task) => {
    setSelectedTask(task);
    setShowOffersPopup(true);
  };

  const closeOffersPopup = () => {
    setShowOffersPopup(false);
    setSelectedTask(null);
  };

  const openRatingModal = (task) => {
    setSelectedTask(task);
    setShowRatingModal(true);
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
    setSelectedTask(null);
  };

  const handleRatingSubmit = (ratingData) => {
    console.log('Rating submitted:', ratingData);
    // Here you would typically send this data to your API
  };

  // if (!user) {
  //   return (
  //     <div className="container mx-auto px-4 py-8 text-center">
  //       <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập để xem công việc của bạn</h2>
  //       <p>Bạn cần đăng nhập để xem và quản lý các công việc của mình.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Công việc của tôi</h1>
      
      {/* Task Status Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab('posted')}
            className={`inline-block p-4 border-b-2 font-medium text-sm ${
              activeTab === 'posted'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Đã đăng (Chưa xác nhận)
          </button>
          <button
            onClick={() => setActiveTab('assigned')}
            className={`inline-block p-4 border-b-2 font-medium text-sm ${
              activeTab === 'assigned'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Đang thực hiện
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`inline-block p-4 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Đã hoàn thành
          </button>
        </div>
      </div>

      {/* Task List Content */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Đang tải công việc...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : tasks[activeTab] && tasks[activeTab].length > 0 ? (
          <>
            <div className="divide-y divide-gray-200">
              {activeTab === 'posted' && (
                <>
                  {tasks.posted.map(task => (
                    <div key={task._id} className="p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                          <div className="flex items-center text-gray-600 text-sm space-x-4 mb-3">
                            <span>{task.location}</span>
                            <span>•</span>
                            <span>Ngân sách: {task.price.toLocaleString('vi-VN')}đ</span>
                            <span>•</span>
                            <span>Đăng ngày: {new Date(task.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm inline-block">
                            {task.offers?.length || 0} đề nghị
                          </div>
                        </div>
                        <button 
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                          onClick={() => openOffersPopup(task)}
                        >
                          Xem đề nghị
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {activeTab === 'assigned' && (
                <>
                  {tasks.assigned.map(task => (
                    <div key={task._id} className="p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                          <div className="flex items-center text-gray-600 text-sm space-x-4 mb-3">
                            <span>{task.location}</span>
                            <span>•</span>
                            <span>Ngân sách: {task.price.toLocaleString('vi-VN')}đ</span>
                            <span>•</span>
                            <span>Thực hiện bởi: {task.assignedTo?.name || 'Không xác định'}</span>
                          </div>
                          <div className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm inline-block">
                            Hạn: {task.deadline ? new Date(task.deadline).toLocaleDateString('vi-VN') : 'Không có'}
                          </div>
                        </div>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">
                          Hoàn thành
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {activeTab === 'completed' && (
                <>
                  {tasks.completed.map(task => (
                    <div key={task._id} className="p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                          <div className="flex items-center text-gray-600 text-sm space-x-4 mb-3">
                            <span>{task.location}</span>
                            <span>•</span>
                            <span>Ngân sách: {task.price.toLocaleString('vi-VN')}đ</span>
                            <span>•</span>
                            <span>Hoàn thành: {task.completedAt ? new Date(task.completedAt).toLocaleDateString('vi-VN') : 'Không xác định'}</span>
                          </div>
                          <div className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm inline-block">
                            Đã hoàn thành
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-2">Thực hiện bởi: {task.assignedTo?.name || 'Không xác định'}</p>
                          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 text-sm mr-2">
                            Xem chi tiết
                          </button>
                          <button 
                            className="bg-blue-500 text-gray-50 px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                            onClick={() => openRatingModal(task)}
                          >
                            Đánh giá
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            
            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center p-6 border-t border-gray-200">
                <button 
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={!pagination.hasPrev}
                  className={`mx-1 px-3 py-1 rounded ${pagination.hasPrev 
                    ? 'bg-gray-200 hover:bg-gray-300' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  &lt; Trước
                </button>
                
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`mx-1 px-3 py-1 rounded ${pagination.current === page 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={!pagination.hasNext}
                  className={`mx-1 px-3 py-1 rounded ${pagination.hasNext 
                    ? 'bg-gray-200 hover:bg-gray-300' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  Sau &gt;
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">Không có công việc nào trong mục này</p>
            {activeTab === 'posted' && (
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                Đăng công việc mới
              </button>
            )}
          </div>
        )}
      </div>

      {/* Task Offers Popup */}
      {showOffersPopup && selectedTask && (
        <TaskOffersModal
          task={selectedTask} 
          onClose={closeOffersPopup} 
        />
      )}

      {/* Rating Modal */}
      {showRatingModal && selectedTask && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={closeRatingModal}
          task={selectedTask}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
};

export default MyTasks;
