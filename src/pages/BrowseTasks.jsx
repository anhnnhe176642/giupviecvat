import { useState } from "react";
import {
  MapPin,
  Calendar,
  User,
  Plus,
  Search,
  Star,
  Clock,
  ChevronDown,
  Filter,
  Briefcase,
  Home,
  Trash2,
  Truck,
  Flower,
  Package,
  Cpu,
  MoreHorizontal,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
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
    description:
      "Tôi cần người giúp quét khoảng 200 trang tài liệu và sắp xếp chúng thành các thư mục có hệ thống trên máy tính. Cần người cẩn thận và có kinh nghiệm xử lý tài liệu.",
    skills: ["Sắp xếp", "Tin học văn phòng", "Tỉ mỉ"],
    posterName: "Minh Anh",
    posterImage: "https://randomuser.me/api/portraits/women/44.jpg",
    featured: true,
    postedDate: "2 giờ trước",
    category: "Dọn dẹp",
  },
  {
    title: "Sửa chữa máy hút bụi Tineco S5 bị hỏng pin",
    price: 150,
    location: "TP. Hồ Chí Minh, Quận 1",
    lat: 10.8231,
    lng: 106.6297,
    time: "Linh hoạt - Buổi trưa",
    description:
      "Máy hút bụi Tineco S5 của tôi bị hỏng pin, không giữ được điện. Cần người có kinh nghiệm sửa chữa đồ điện tử để kiểm tra và thay thế pin mới.",
    skills: ["Sửa chữa", "Điện tử", "Điện gia dụng"],
    posterName: "Hoàng Nam",
    posterImage: "https://randomuser.me/api/portraits/men/22.jpg",
    featured: false,
    postedDate: "1 ngày trước",
    category: "Điện tử",
  },
  {
    title: "Lắp đặt bạt nhún",
    price: 80,
    location: "Đà Nẵng, Ngũ Hành Sơn",
    lat: 16.0583,
    lng: 108.2772,
    time: "Hôm nay",
    description:
      "Cần lắp đặt bạt nhún cho sân chơi trẻ em, diện tích khoảng 50m2. Yêu cầu có kinh nghiệm lắp đặt và đảm bảo an toàn cho trẻ nhỏ.",
    skills: ["Lắp đặt", "Kỹ thuật viên", "An toàn"],
    posterName: "Nguyễn Văn A",
    posterImage: "https://randomuser.me/api/portraits/men/11.jpg",
    featured: true,
    postedDate: "3 giờ trước",
    category: "Vườn",
  },
  {
    title: "Cắt lỗ cho quạt thông gió trên cửa sổ",
    price: 50,
    location: "Nha Trang, Khánh Hòa",
    lat: 12.2431,
    lng: 109.1969,
    time: "Linh hoạt",
    description:
      "Cần cắt lỗ trên cửa sổ để lắp quạt thông gió, kích thước lỗ cắt khoảng 30x30cm. Cần người có kinh nghiệm và dụng cụ đầy đủ.",
    skills: ["Cắt gọt", "Lắp đặt", "Kỹ thuật viên"],
    posterName: "Trần Thị B",
    posterImage: "https://randomuser.me/api/portraits/women/12.jpg",
    featured: false,
    postedDate: "2 ngày trước",
    category: "Nhà cửa",
  },
  {
    title: "Lắp đặt khóa cửa thông minh",
    price: 90,
    location: "Hà Nội, Long Biên",
    lat: 21.0367,
    lng: 105.8855,
    time: "Cuối tuần",
    description:
      "Cần người có kinh nghiệm lắp đặt khóa cửa thông minh Samsung SHP-DP738 cho cửa gỗ. Bao gồm khoan lỗ, đi dây và cài đặt ứng dụng.",
    skills: ["Lắp đặt", "Điện tử", "Thợ mộc"],
    posterName: "Nguyễn Thị Lan",
    posterImage: "https://randomuser.me/api/portraits/women/28.jpg",
    featured: true,
    postedDate: "5 giờ trước",
    category: "Nhà cửa",
  },
  {
    title: "Sửa chữa tủ lạnh không lạnh",
    price: 200,
    location: "TP. Hồ Chí Minh, Quận 7",
    lat: 10.7285,
    lng: 106.7019,
    time: "Gấp - Trong ngày",
    description:
      "Tủ lạnh Toshiba 180L không làm lạnh, có tiếng kêu bất thường. Cần thợ chuyên nghiệp kiểm tra và sửa chữa.",
    skills: ["Sửa chữa", "Điện lạnh", "Điện gia dụng"],
    posterName: "Trần Văn Hùng",
    posterImage: "https://randomuser.me/api/portraits/men/45.jpg",
    featured: false,
    postedDate: "8 giờ trước",
    category: "Điện tử",
  },
  {
    title: "Dọn dẹp căn hộ 60m2 sau xây dựng",
    price: 300,
    location: "TP. Hồ Chí Minh, Quận 2",
    lat: 10.7868,
    lng: 106.7506,
    time: "Thứ 7, ngày 15/06",
    description:
      "Căn hộ mới xây dựng cần người dọn dẹp toàn bộ, lau chùi sàn, bếp, nhà vệ sinh. Bao gồm vệ sinh cửa kính và loại bỏ vết xi măng.",
    skills: ["Vệ sinh", "Lau chùi", "Dọn dẹp chuyên sâu"],
    posterName: "Lê Minh Tâm",
    posterImage: "https://randomuser.me/api/portraits/men/33.jpg",
    featured: true,
    postedDate: "1 ngày trước",
    category: "Dọn dẹp",
  },
  {
    title: "Chăm sóc cây cảnh trong văn phòng",
    price: 70,
    location: "Hà Nội, Hoàn Kiếm",
    lat: 21.0278,
    lng: 105.8342,
    time: "Hàng tuần",
    description:
      "Văn phòng 150m2 có khoảng 20 chậu cây cảnh cần người chăm sóc định kỳ hàng tuần, bao gồm tưới nước, cắt tỉa, bón phân và xử lý sâu bệnh.",
    skills: ["Làm vườn", "Chăm sóc cây cảnh", "Kiểm soát sâu bệnh"],
    posterName: "Phạm Thị Hương",
    posterImage: "https://randomuser.me/api/portraits/women/56.jpg",
    featured: false,
    postedDate: "3 ngày trước",
    category: "Vườn",
  },
  {
    title: "Vận chuyển tủ lạnh từ quận 1 đến quận 9",
    price: 150,
    location: "TP. Hồ Chí Minh, Quận 1",
    lat: 10.7756,
    lng: 106.7019,
    time: "Ngày mai, buổi sáng",
    description:
      "Cần vận chuyển tủ lạnh Panasonic 300L từ quận 1 đến căn hộ ở quận 9. Yêu cầu có xe tải nhỏ và 2 người bốc vác, đảm bảo an toàn cho thiết bị.",
    skills: ["Vận chuyển", "Bốc vác", "Lái xe"],
    posterName: "Vũ Hoàng Nam",
    posterImage: "https://randomuser.me/api/portraits/men/67.jpg",
    featured: true,
    postedDate: "1 giờ trước",
    category: "Chuyển nhà",
  },
  {
    title: "Giao gấp tài liệu quan trọng",
    price: 60,
    location: "Đà Nẵng, Hải Châu",
    lat: 16.0471,
    lng: 108.2096,
    time: "Hôm nay, trước 17h",
    description:
      "Cần người giao gấp bộ tài liệu từ văn phòng ở Hải Châu đến đối tác ở Sơn Trà (khoảng 8km). Yêu cầu giao nhận cẩn thận, có xác nhận và bảo mật.",
    skills: ["Giao hàng nhanh", "Bảo mật", "Tin cậy"],
    posterName: "Trần Thu Hà",
    posterImage: "https://randomuser.me/api/portraits/women/35.jpg",
    featured: false,
    postedDate: "4 giờ trước",
    category: "Giao hàng",
  },
  {
    title: "Dịch thuật tài liệu y tế Anh-Việt",
    price: 250,
    location: "Online",
    lat: 16.4637,
    lng: 107.5909, // Huế coordinates as placeholder for online work
    time: "Trong 3 ngày tới",
    description:
      "Cần dịch 20 trang tài liệu y tế từ tiếng Anh sang tiếng Việt. Yêu cầu kinh nghiệm trong lĩnh vực y tế, chính xác về thuật ngữ chuyên ngành.",
    skills: ["Dịch thuật", "Tiếng Anh", "Y tế"],
    posterName: "Nguyễn Đức Minh",
    posterImage: "https://randomuser.me/api/portraits/men/76.jpg",
    featured: true,
    postedDate: "2 ngày trước",
    category: "Khác",
  },
  {
    title: "Sơn lại tường phòng khách",
    price: 180,
    location: "Hải Phòng, Lê Chân",
    lat: 20.8464,
    lng: 106.6881,
    time: "Cuối tuần này",
    description:
      "Cần sơn lại tường phòng khách 25m2, đã chuẩn bị sơn và dụng cụ. Yêu cầu thợ có kinh nghiệm, làm sạch, và hoàn thành trong 1 ngày.",
    skills: ["Sơn tường", "Trang trí nội thất", "Tỉ mỉ"],
    posterName: "Đặng Văn Tú",
    posterImage: "https://randomuser.me/api/portraits/men/81.jpg",
    featured: false,
    postedDate: "2 ngày trước",
    category: "Nhà cửa",
  },
  {
    title: "Sửa máy tính bị lỗi màn hình xanh",
    price: 100,
    location: "Cần Thơ, Ninh Kiều",
    lat: 10.0341,
    lng: 105.7882,
    time: "Linh hoạt - Trong tuần này",
    description:
      "Máy tính Windows thường xuyên bị màn hình xanh khi khởi động. Cần người có kiến thức về phần cứng và phần mềm để kiểm tra và khắc phục sự cố.",
    skills: ["Sửa máy tính", "Windows", "Phần cứng"],
    posterName: "Lý Thị Mai",
    posterImage: "https://randomuser.me/api/portraits/women/49.jpg",
    featured: true,
    postedDate: "1 ngày trước",
    category: "Điện tử",
  },
  {
    title: "Giặt và ủi đồng phục công sở",
    price: 45,
    location: "TP. Hồ Chí Minh, Tân Bình",
    lat: 10.8007,
    lng: 106.6526,
    time: "Giao nhận trong ngày",
    description:
      "Cần giặt và ủi 10 bộ đồng phục công sở (áo sơ mi và quần tây). Yêu cầu giặt sạch, ủi phẳng, và giao trả trong ngày.",
    skills: ["Giặt ủi", "Chăm sóc vải", "Nhanh chóng"],
    posterName: "Ngô Thanh Tùng",
    posterImage: "https://randomuser.me/api/portraits/men/54.jpg",
    featured: false,
    postedDate: "6 giờ trước",
    category: "Dọn dẹp",
  },
  {
    title: "Thiết kế logo cho tiệm cafe",
    price: 300,
    location: "Online",
    lat: 21.0244,
    lng: 105.8412, // Hà Nội coordinates as placeholder for online work
    time: "Trong vòng 5 ngày",
    description:
      "Cần thiết kế logo cho tiệm cafe mới khai trương. Phong cách hiện đại, mang hơi hướng vintage. Bao gồm thiết kế logo và hướng dẫn sử dụng.",
    skills: ["Thiết kế đồ họa", "Logo", "Branding"],
    posterName: "Hoàng Minh Tuấn",
    posterImage: "https://randomuser.me/api/portraits/men/37.jpg",
    featured: true,
    postedDate: "3 ngày trước",
    category: "Khác",
  },
  {
    title: "Chuyển nhà từ Bình Thạnh đến Phú Nhuận",
    price: 250,
    location: "TP. Hồ Chí Minh, Bình Thạnh",
    lat: 10.8106,
    lng: 106.7197,
    time: "Thứ 7 tuần sau",
    description:
      "Chuyển đồ từ căn hộ 2 phòng ngủ (Bình Thạnh) đến nhà mới ở Phú Nhuận. Có khoảng 15 thùng đồ, 1 tủ quần áo, 1 giường, và các vật dụng gia đình khác.",
    skills: ["Vận chuyển", "Đóng gói", "Sắp xếp"],
    posterName: "Lê Thị Hồng",
    posterImage: "https://randomuser.me/api/portraits/women/62.jpg",
    featured: false,
    postedDate: "5 ngày trước",
    category: "Chuyển nhà",
  },
  {
    title: "Giao đồ ăn cho sự kiện 30 người",
    price: 120,
    location: "Hà Nội, Đống Đa",
    lat: 21.0184,
    lng: 105.8294,
    time: "Thứ 6, 12h trưa",
    description:
      "Cần giao đồ ăn từ nhà hàng đến địa điểm tổ chức sự kiện cho 30 người. Yêu cầu giao đúng giờ, đảm bảo đồ ăn còn nóng và nguyên vẹn.",
    skills: ["Giao hàng", "Đúng giờ", "Cẩn thận"],
    posterName: "Trần Văn Phong",
    posterImage: "https://randomuser.me/api/portraits/men/23.jpg",
    featured: true,
    postedDate: "2 ngày trước",
    category: "Giao hàng",
  },
  {
    title: "Tỉa cây và làm cỏ sân vườn",
    price: 110,
    location: "Vũng Tàu, Phường 2",
    lat: 10.3465,
    lng: 107.0843,
    time: "Cuối tuần này",
    description:
      "Cần người tỉa cây, làm cỏ và chăm sóc khu vườn 100m2. Công việc bao gồm cắt tỉa bụi cây, nhổ cỏ dại, và bón phân cho cây ăn quả.",
    skills: ["Làm vườn", "Cắt tỉa", "Chăm sóc cây trồng"],
    posterName: "Phan Thị Hương",
    posterImage: "https://randomuser.me/api/portraits/women/78.jpg",
    featured: false,
    postedDate: "4 ngày trước",
    category: "Vườn",
  },
];

// Categories for filter dropdown with updated icons
const categories = [
  { name: "Tất cả", icon: <Briefcase size={18} />, color: "#4b5563" },
  { name: "Nhà cửa", icon: <Home size={18} />, color: "#ef4444" },
  { name: "Dọn dẹp", icon: <Trash2 size={18} />, color: "#3b82f6" },
  { name: "Chuyển nhà", icon: <Truck size={18} />, color: "#f97316" },
  { name: "Vườn", icon: <Flower size={18} />, color: "#10b981" },
  { name: "Giao hàng", icon: <Package size={18} />, color: "#8b5cf6" },
  { name: "Điện tử", icon: <Cpu size={18} />, color: "#f59e0b" },
  { name: "Khác", icon: <MoreHorizontal size={18} />, color: "#6b7280" },
];

// Function to create custom marker icon based on category
const createCategoryIcon = (category) => {
  // Find the category from our list, or use the "Khác" (Other) category as fallback
  const categoryInfo =
    categories.find((cat) => cat.name === category) ||
    categories.find((cat) => cat.name === "Khác");

  return L.divIcon({
    className: "custom-marker-icon",
    html: `<div style="background-color: ${
      categoryInfo.color
    }; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${getCategoryIconPath(category)}
            </svg>
          </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

// Helper function to get SVG path for each category icon
function getCategoryIconPath(category) {
  switch (category) {
    case "Nhà cửa":
      return '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>';
    case "Dọn dẹp":
      return '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>';
    case "Chuyển nhà":
      return '<rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>';
    case "Vườn":
      return '<path d="M12 10c3.976 0 7-3.024 7-7h-4.586a1 1 0 0 0-.707.293l-1.414 1.414a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 0 1-1.414 0l-1.414-1.414a1 1 0 0 0-1.414 0L8.052 9.76c1.033.153 2.083.24 3.125.24z"></path><path d="M10.121 20.364a7.001 7.001 0 0 1-7.193-7.316A7 7 0 0 1 9.172 6.364"></path>';
    case "Giao hàng":
      return '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>';
    case "Điện tử":
      return '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>';
    default:
      return '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>';
  }
}

function BrowseTasks() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter tasks based on search term and category
  const filteredTasks = tasks.filter(
    (task) =>
      (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "Tất cả" || task.category === selectedCategory)
  );

  // Handle view task details
  const handleViewTaskDetails = (index) => {
    setSelectedTask(index);
    setIsModalOpen(true);
  };

  // Handle create task
  const handleCreateTask = (newTask) => {
    // In a real app, this would send data to a backend API
    console.log("New task created:", newTask);
    // You would typically refresh the task list or add the new task to the state
    alert("Công việc đã được tạo thành công!");
  };

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row justify-center px-4 md:px-12 lg:px-32 py-3 gap-4">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 lg:max-w-md overflow-y-auto p-5 bg-white shadow-lg rounded-xl md:rounded-l-xl md:rounded-r-none border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text font-bold text-gray-800">Tìm công việc</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow"
            >
              <Plus size={15} className="mr-1.5" />
              Tạo công việc
            </button>
          </div>

          {/* Search input */}
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm công việc..."
              className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Task count */}
          <p className="text-gray-600 mb-5 font-medium flex items-center">
            <Filter className="w-4 h-4 mr-2 text-green-500" />
            Tìm thấy{" "}
            <span className="text-green-600 mx-1">
              {filteredTasks.length}
            </span>{" "}
            công việc
          </p>

          {/* Task list */}
          <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-1 space-y-4">
            {filteredTasks.map((task, index) => (
              <div
                key={index}
                className={`task-item border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTask === index
                    ? "bg-green-50 border-green-300 shadow-md"
                    : "hover:bg-gray-50 border-gray-200"
                }`}
                onClick={() => setSelectedTask(index)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                    {task.title}
                  </h3>
                  <span className="text-green-600 font-bold text-lg">
                    {task.price}k VNĐ
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <MapPin className="w-4 h-4 mr-1.5 text-green-500" />{" "}
                  {task.location}
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1.5">
                  <Calendar className="w-4 h-4 mr-1.5 text-green-500" />{" "}
                  {task.time}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {task.skills.slice(0, 2).map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {task.skills.length > 2 && (
                    <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">
                      +{task.skills.length - 2}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm mt-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center">
                    <img
                      src={task.posterImage}
                      alt={task.posterName}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span className="text-gray-700">{task.posterName}</span>
                  </div>
                  <button
                    className="text-green-600 hover:text-green-800 font-medium bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewTaskDetails(index);
                    }}
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map section */}
        <div className="w-full md:w-2/3 md:flex-1 bg-gray-100 relative rounded-xl md:rounded-l-none md:rounded-r-xl overflow-hidden h-[50vh] md:h-[85vh]">
          <MapContainer
            center={[16.0583, 108.2772]}
            zoom={5}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution=" "
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {/* 5km radius circle around "Giúp quét và sắp xếp tài liệu" task */}

            {/* <Circle
              center={[21.0285, 105.8542]}
              radius={5000}
              pathOptions={{
                color: "#16a34a", // green-600
                fillColor: "#16a34a",
                fillOpacity: 0.1,
              }}
            /> */}

            {filteredTasks.map((task, idx) => (
              <Marker
                key={idx}
                position={[task.lat, task.lng]}
                icon={createCategoryIcon(task.category)}
              >
                <Popup minWidth={250}>
                  <div className="popup-content">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      {getCategoryIconElement(task.category)}
                      <span
                        className="ml-2 text-sm font-medium"
                        style={{ color: getCategoryColor(task.category) }}
                      >
                        {task.category}
                      </span>
                    </div>
                    <strong className="block text-lg mb-1">{task.title}</strong>
                    <p className="mb-2 font-medium text-green-600">
                      {task.price}k VNĐ
                    </p>
                    <p className="mb-2 text-sm text-gray-600">
                      <MapPin className="w-3 h-3 inline mr-1" /> {task.location}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewTaskDetails(idx);
                      }}
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm font-medium w-full text-center"
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
              className="bg-white px-4 py-2 rounded-md shadow hover:bg-gray-100 text-sm font-medium flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg p-4">
                {/* Category chips - moved from sidebar */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục công việc
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition-all ${
                          selectedCategory === category.name
                            ? `bg-${category.color.replace("#", "")} text-white`
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                        style={
                          selectedCategory === category.name
                            ? {
                                backgroundColor: category.color,
                                color: "white",
                              }
                            : {}
                        }
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        {category.icon}
                        <span className="ml-1">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* <div className="mb-4">
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
                    className="flex-1 accent-green-600"
                    defaultValue="200"
                  />
                  <span className="ml-2">200k+</span>
                </div>
              </div>
              
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Áp dụng
              </button> */}
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
      </div>
    </>
  );
}

// Helper function to get category color
function getCategoryColor(categoryName) {
  const category = categories.find((cat) => cat.name === categoryName);
  return category ? category.color : "#6b7280";
}

// Helper function to get category icon element
function getCategoryIconElement(categoryName) {
  const category = categories.find((cat) => cat.name === categoryName);
  if (category) {
    const IconComponent = category.icon.type;
    return <IconComponent size={16} color={category.color} />;
  }
  return <MoreHorizontal size={16} color="#6b7280" />;
}

export default BrowseTasks;
