import { useState } from "react";
import { MapPin, Calendar, User, Plus } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import TaskDetailModal from "../components/TaskDetailModal";
import CreateTaskModal from "../components/CreateTaskModal";
import Header from "../layouts/Header";

// Enhance task data with descriptions
const tasks = [
  {
    title: "Giúp quét và sắp xếp tài liệu",
    price: 120,
    location: "Hà Nội, Cầu Giấy",
    lat: 21.0285,
    lng: 105.8542,
    time: "Linh hoạt",
    description: "Tôi cần người giúp quét khoảng 200 trang tài liệu và sắp xếp chúng thành các thư mục có hệ thống trên máy tính. Cần người cẩn thận và có kinh nghiệm xử lý tài liệu.",
    skills: ["Sắp xếp", "Tin học văn phòng", "Tỉ mỉ"],
    posterName: "Minh Anh",
    posterImage: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    title: "Sửa chữa máy hút bụi Tineco S5 bị hỏng pin",
    price: 150,
    location: "TP. Hồ Chí Minh, Quận 1",
    lat: 10.8231,
    lng: 106.6297,
    time: "Linh hoạt - Buổi trưa",
    description: "Máy hút bụi Tineco S5 của tôi bị hỏng pin, không giữ được điện. Cần người có kinh nghiệm sửa chữa đồ điện tử để kiểm tra và thay thế pin mới.",
    skills: ["Sửa chữa", "Điện tử", "Điện gia dụng"],
    posterName: "Hoàng Nam",
    posterImage: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    title: "Lắp đặt bạt nhún",
    price: 80,
    location: "Đà Nẵng, Ngũ Hành Sơn",
    lat: 16.0583,
    lng: 108.2772,
    time: "Hôm nay",
    description: "Cần lắp đặt bạt nhún cho sân chơi trẻ em, diện tích khoảng 50m2. Yêu cầu có kinh nghiệm lắp đặt và đảm bảo an toàn cho trẻ nhỏ.",
    skills: ["Lắp đặt", "Kỹ thuật viên", "An toàn"],
    posterName: "Nguyễn Văn A",
    posterImage: "https://randomuser.me/api/portraits/men/11.jpg"
  },
  {
    title: "Cắt lỗ cho quạt thông gió trên cửa sổ",
    price: 50,
    location: "Nha Trang, Khánh Hòa",
    lat: 12.2431,
    lng: 109.1969,
    time: "Linh hoạt",
    description: "Cần cắt lỗ trên cửa sổ để lắp quạt thông gió, kích thước lỗ cắt khoảng 30x30cm. Cần người có kinh nghiệm và dụng cụ đầy đủ.",
    skills: ["Cắt gọt", "Lắp đặt", "Kỹ thuật viên"],
    posterName: "Trần Thị B",
    posterImage: "https://randomuser.me/api/portraits/women/12.jpg"
  },
];

// Categories for filter dropdown
const categories = ['Tất cả', 'Nhà cửa', 'Dọn dẹp', 'Chuyển nhà', 'Vườn', 'Giao hàng', 'Điện tử', 'Khác'];

function BrowseTasks() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle view task from map marker
  const handleViewTaskFromMap = (index) => {
    setSelectedTask(index);
    // Scroll to the task in the sidebar if needed
    const taskElements = document.querySelectorAll('.task-item');
    if (taskElements[index]) {
      taskElements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handle view task details
  const handleViewTaskDetails = (index) => {
    setSelectedTask(index);
    setIsModalOpen(true);
  };

  // Handle create task
  const handleCreateTask = (newTask) => {
    // In a real app, this would send data to a backend API
    console.log('New task created:', newTask);
    // You would typically refresh the task list or add the new task to the state
    alert('Công việc đã được tạo thành công!');
  };

  return (<>
      <Header />
    <div className="flex flex-col md:flex-row justify-center px-4 md:px-12 lg:px-32 py-3 gap-4">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 lg:max-w-md overflow-y-auto p-5 bg-white shadow-lg rounded-xl md:rounded-l-xl md:rounded-r-none border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text font-bold text-gray-800">Tìm công việc</h2>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow"
          >
            <Plus size={15} className="mr-1.5" />
            Tạo công việc
          </button>
        </div>
        
        {/* Search input */}
        <div className="mb-2 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm công việc..."
            className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Task count */}
        <p className="text-gray-600 mb-4 font-medium">Tìm thấy <span className="text-blue-600">{filteredTasks.length}</span> công việc</p>
        
        {/* Task list */}
        <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-1 space-y-4">
          {filteredTasks.map((task, index) => (
            <div
              key={index}
              className={`task-item border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedTask === index 
                  ? "bg-blue-50 border-blue-300 shadow-md" 
                  : "hover:bg-gray-50 border-gray-200"
              }`}
              onClick={() => setSelectedTask(index)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-900 leading-tight">{task.title}</h3>
                <span className="text-blue-600 font-bold text-lg">{task.price}k VNĐ</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <MapPin className="w-4 h-4 mr-1.5 text-gray-500" /> {task.location}
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-1.5">
                <Calendar className="w-4 h-4 mr-1.5 text-gray-500" /> {task.time}
              </div>
              <div className="flex items-center justify-between text-sm mt-3 pt-2 border-t border-gray-100">
                <div className="flex items-center text-blue-600">
                  <span className="mr-2 font-medium">Mở</span>
                  <User className="w-4 h-4" />
                </div>
                <button 
                  className="text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewTaskDetails(index);
                  }}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map section */}
      <div className="w-full md:w-2/3 md:flex-1 bg-gray-100 relative rounded-xl md:rounded-l-none md:rounded-r-xl overflow-hidden h-[50vh] md:h-[85vh]">
        <MapContainer center={[16.0583, 108.2772]} zoom={5} className="w-full h-full z-0">
          <TileLayer
            attribution=' '
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {/* 5km radius circle around "Giúp quét và sắp xếp tài liệu" task */}
          <Circle 
            center={[21.0285, 105.8542]}
            radius={5000} 
            pathOptions={{ 
              color: 'blue', 
              fillColor: 'blue', 
              fillOpacity: 0.1 
            }} 
          />
          {tasks.map((task, idx) => (
            <Marker 
              key={idx} 
              position={[task.lat, task.lng]}
            >
              <Popup minWidth={250}>
                <div className="popup-content">
                  <strong className="block text-lg mb-1">{task.title}</strong>
                  <p className="mb-2">{task.price}k VNĐ</p>
                  <p className="mb-2 text-sm text-gray-600">
                    <MapPin className="w-3 h-3 inline mr-1" /> {task.location}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewTaskDetails(idx);
                    }} 
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm font-medium w-full text-center"
                  >
                    Xem công việc
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Filter button and dropdown */}
        <div className="absolute top-2 right-2 z-10">
          <button 
            className="bg-white px-4 py-2 rounded-md shadow hover:bg-gray-100 text-sm font-medium"
            onClick={() => setShowFilters(!showFilters)}
          >
            Bộ lọc
          </button>
          
          {showFilters && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khoảng giá
                </label>
                <div className="flex items-center">
                  <span className="mr-2">0k</span>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    className="flex-1"
                    defaultValue="200"
                  />
                  <span className="ml-2">200k+</span>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Áp dụng
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Task Detail Modal */}
      <TaskDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={selectedTask !== null ? tasks[selectedTask] : null}
      />

      {/* Create Task Modal */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
      />
    </div></>
  );
}

export default BrowseTasks;
