import React, { useState, useEffect, useContext } from 'react';
import TaskOffersModal from '../components/TaskOffersModal';
import RatingModal from '../components/RatingModal';
import { AuthContext } from '../conext/AuthConext';

const MyTasks = () => {
  const [activeTab, setActiveTab] = useState('posted');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOffersPopup, setShowOffersPopup] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { user } = useContext(AuthContext);
  // Mock task data - in a real app, you'd fetch this from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockTasks = {
        posted: [
          { 
            id: 1, 
            title: 'Sửa máy giặt', 
            budget: '200.000đ', 
            location: 'Hoà Lạc', 
            postedDate: '01/06/2025', 
            offers: 5,
            offersList: [
              { id: 101, userId: 201, name: 'Nguyễn Văn A', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', rating: 4.8, completedTasks: 27, greeting: 'Tôi có 5 năm kinh nghiệm sửa máy giặt và có thể hoàn thành công việc trong 7 ngày.' },
              { id: 102, userId: 202, name: 'Trần Thị B', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', rating: 4.9, completedTasks: 42, greeting: 'Chào bạn! Tôi chuyên sửa chữa các loại máy giặt với hơn 50 ca thành công.' },
              { id: 103, userId: 203, name: 'Lê Văn C', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', rating: 4.7, completedTasks: 18, greeting: 'Tôi cam kết sẽ sửa chữa máy giặt của bạn nhanh chóng và hiệu quả.' },
              { id: 104, userId: 204, name: 'Phạm Thị D', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', rating: 5.0, completedTasks: 31, greeting: 'Tôi có thể sửa chữa tất cả các loại máy giặt với chất lượng tốt nhất.' },
              { id: 105, userId: 205, name: 'Hoàng Văn E', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', rating: 4.6, completedTasks: 15, greeting: 'Với kinh nghiệm sửa chữa máy giặt cho nhiều gia đình, tôi tự tin có thể đáp ứng yêu cầu của bạn.' }
            ]
          },
          { 
            id: 2, 
            title: 'Sửa máy tính', 
            budget: '500.000đ', 
            location: 'Hà Nội', 
            postedDate: '03/06/2025', 
            offers: 2,
            offersList: [
              { id: 106, userId: 206, name: 'Vũ Văn F', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', rating: 4.5, completedTasks: 23, greeting: 'Tôi là kỹ thuật viên với 7 năm kinh nghiệm sửa chữa máy tính.' },
              { id: 107, userId: 207, name: 'Đặng Thị G', avatar: 'https://randomuser.me/api/portraits/women/7.jpg', rating: 4.3, completedTasks: 12, greeting: 'Tôi có thể sửa chữa phần cứng và phần mềm cho máy tính của bạn trong vòng 2 giờ.' }
            ]
          },
        ],
        assigned: [
          { id: 3, title: 'Dọn dẹp nhà cửa', budget: '300.000đ', location: 'Hồ Chí Minh', assignedTo: 'Nguyễn Văn A', dueDate: '10/06/2025' },
        ],
        completed: [
          { id: 4, title: 'Dạy học piano', budget: '1.500.000đ', location: 'Đà Nẵng', completedDate: '28/05/2025', tasker: 'Trần Thị B' },
        ],
      };
      
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, []);

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
    // For now, just log it to console
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
        ) : tasks[activeTab] && tasks[activeTab].length > 0 ? (
          <div className="divide-y divide-gray-200">
            {activeTab === 'posted' && (
              <>
                {tasks.posted.map(task => (
                  <div key={task.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm space-x-4 mb-3">
                          <span>{task.location}</span>
                          <span>•</span>
                          <span>Ngân sách: {task.budget}</span>
                          <span>•</span>
                          <span>Đăng ngày: {task.postedDate}</span>
                        </div>
                        <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm inline-block">
                          {task.offers} đề nghị
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
                  <div key={task.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm space-x-4 mb-3">
                          <span>{task.location}</span>
                          <span>•</span>
                          <span>Ngân sách: {task.budget}</span>
                          <span>•</span>
                          <span>Thực hiện bởi: {task.assignedTo}</span>
                        </div>
                        <div className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm inline-block">
                          Hạn: {task.dueDate}
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
                  <div key={task.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm space-x-4 mb-3">
                          <span>{task.location}</span>
                          <span>•</span>
                          <span>Ngân sách: {task.budget}</span>
                          <span>•</span>
                          <span>Hoàn thành: {task.completedDate}</span>
                        </div>
                        <div className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm inline-block">
                          Đã hoàn thành
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-2">Thực hiện bởi: {task.tasker}</p>
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
