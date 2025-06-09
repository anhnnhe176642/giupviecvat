import React, { useState, useEffect, useContext } from 'react';
import TaskOffersModal from '../components/TaskOffersModal';
import RatingModal from '../components/RatingModal';
import { AuthContext } from '../conext/AuthConext';
import toast from 'react-hot-toast';
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
          offers: true, 
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

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await axios.patch(`/tasks/${taskId}/status`, { 
        status: 'completed' 
      });
      
      if (response.data.success) {
        // Refresh the tasks to show the updated status
        fetchTasks(pagination.current);
        
        // Show success message (optional)
        toast('Công việc đã được đánh dấu hoàn thành!');
      } else {
        toast('Không thể cập nhật trạng thái công việc. Vui lòng thử lại!');
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      toast('Đã xảy ra lỗi khi cập nhật trạng thái công việc.');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Vui lòng đăng nhập để xem công việc của bạn</h2>
          <p className="text-gray-600">Bạn cần đăng nhập để xem và quản lý các công việc của mình.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Công việc của tôi</h1>
      
      {/* Task Status Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab('posted')}
            className={`inline-block py-3 px-6 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === 'posted'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Đã đăng (Chưa xác nhận)
          </button>
          <button
            onClick={() => setActiveTab('assigned')}
            className={`inline-block py-3 px-6 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === 'assigned'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Đang thực hiện
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`inline-block py-3 px-6 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === 'completed'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Đã hoàn thành
          </button>
        </div>
      </div>

      {/* Task List Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-gray-500">Đang tải công việc...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : tasks[activeTab] && tasks[activeTab].length > 0 ? (
          <>
            <div className="divide-y divide-gray-200">
              {activeTab === 'posted' && (
                <>
                  {tasks.posted.map(task => (
                    <div key={task._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2 text-gray-800">{task.title}</h3>
                          <div className="flex flex-wrap items-center text-gray-600 text-sm gap-2 mb-3">
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {task.location}
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {task.price.toLocaleString('vi-VN')}đ
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(task.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm inline-flex items-center font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                            </svg>
                            {task.offers?.length || 0} đề nghị
                          </div>
                        </div>
                        <button 
                          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-150 text-sm font-medium shadow-sm flex items-center justify-center"
                          onClick={() => openOffersPopup(task)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
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
                    <div key={task._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2 text-gray-800">{task.title}</h3>
                          <div className="flex flex-wrap items-center text-gray-600 text-sm gap-2 mb-3">
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {task.location}
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {task.price.toLocaleString('vi-VN')}đ
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {task.assignedTo?.name || 'Không xác định'}
                            </span>
                          </div>
                          <div className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm inline-flex items-center font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Hạn: {task.deadline ? new Date(task.deadline).toLocaleDateString('vi-VN') : 'Không có'}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleCompleteTask(task._id)}
                          className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors duration-150 text-sm font-medium shadow-sm flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
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
                    <div key={task._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2 text-gray-800">{task.title}</h3>
                          <div className="flex flex-wrap items-center text-gray-600 text-sm gap-2 mb-3">
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {task.location}
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {task.price.toLocaleString('vi-VN')}đ
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {task.completedAt ? new Date(task.completedAt).toLocaleDateString('vi-VN') : 'Không xác định'}
                            </span>
                          </div>
                          <div className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm inline-flex items-center font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Đã hoàn thành
                          </div>
                        </div>
                        <div className="flex flex-col md:items-end">
                          <p className="text-gray-600 mb-3 text-sm flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Thực hiện bởi: {task.assignedTo?.name || 'Không xác định'}
                          </p>
                          <div className="flex gap-2">
                            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-150 text-sm font-medium flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Xem chi tiết
                            </button>
                            <button 
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-150 text-sm font-medium shadow-sm flex items-center"
                              onClick={() => openRatingModal(task)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              Đánh giá
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            
            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center py-6 px-4 border-t border-gray-200">
                <button 
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={!pagination.hasPrev}
                  className={`mx-1 px-4 py-2 rounded-md flex items-center ${pagination.hasPrev 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'} transition-colors duration-150`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Trước
                </button>
                
                <div className="flex space-x-1 mx-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors duration-150 ${pagination.current === page 
                        ? 'bg-blue-600 text-white font-medium' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={!pagination.hasNext}
                  className={`mx-1 px-4 py-2 rounded-md flex items-center ${pagination.hasNext 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'} transition-colors duration-150`}
                >
                  Sau
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="p-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 mb-4">Không có công việc nào trong mục này</p>
            {activeTab === 'posted' && (
              <button className="mt-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-150 font-medium shadow-sm flex items-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
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
