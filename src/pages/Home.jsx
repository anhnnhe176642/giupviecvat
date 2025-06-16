import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import CreateTaskModal from '../components/CreateTaskModal';
import { FaArrowRight, FaBroom, FaTools, FaBox, FaChair, FaHome, FaSeedling } from 'react-icons/fa';

function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();

  // Handle create task
  const handleCreateTask = async (newTask) => {
    try {
      // Send data to backend API
      const response = await axios.post("/tasks", newTask);
      
      if (response.data.success) {
        // Show success message
        toast.success("Công việc đã được tạo thành công!");
        
        // Redirect to browse tasks page after successful creation
        navigate('/browse-tasks');
      } else {
        // Show error message
        toast.error(response.data.message || "Lỗi khi tạo công việc.");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Đã xảy ra lỗi khi tạo công việc. Vui lòng thử lại sau.");
    }
    setIsCreateModalOpen(false);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sample testimonial data
  const testimonials = [
    {
      name: "Nguyễn Văn Nghĩa",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      stars: 5,
      text: "GiupViecVat giúp tôi dễ dàng tìm người hỗ trợ chuyển nhà. Dịch vụ đáng tin cậy và giao tiếp tuyệt vời!"
    },
    {
      name: "Trần Thị Hằng",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      stars: 5,
      text: "Tôi đã tìm được người sửa chữa điện nước chuyên nghiệp chỉ trong vòng 2 giờ. Rất ấn tượng với chất lượng dịch vụ!"
    },
    {
      name: "Lê Minh Tuấn",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      stars: 4,
      text: "Đặt dịch vụ dọn dẹp nhà cửa trên ứng dụng rất dễ dàng và người giúp việc đến đúng giờ, làm việc rất chăm chỉ."
    },
  ];

  // Categories with proper icons
  const categories = [
    { name: 'Dọn dẹp', icon: <FaBroom className="text-3xl" /> },
    { name: 'Sửa chữa', icon: <FaTools className="text-3xl" /> },
    { name: 'Giao hàng', icon: <FaBox className="text-3xl" /> },
    { name: 'Lắp nội thất', icon: <FaChair className="text-3xl" /> },
    { name: 'Cải tạo nhà', icon: <FaHome className="text-3xl" /> },
    { name: 'Làm vườn', icon: <FaSeedling className="text-3xl" /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image and Overlay */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-800 py-24">
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-green-300 opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-emerald-400 opacity-10 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block bg-green-500 text-white px-4 py-1 rounded-full mb-6 font-medium text-sm animate-pulse">
              Tìm người giúp việc một cách dễ dàng
            </div>
            
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-white leading-tight">
              Nhận trợ giúp với <span className="text-yellow-300">các công việc</span> hàng ngày
            </h2>
            
            <p className="text-xl opacity-90 mb-10 text-green-100 leading-relaxed">
              Hàng nghìn người làm việc uy tín sẵn sàng giúp đỡ tại nhà và văn phòng của bạn
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <button 
                className="bg-white text-green-700 px-8 py-4 rounded-lg hover:bg-yellow-100 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full md:w-auto"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Đăng việc ngay
              </button>
              
              <button 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-bold text-lg w-full md:w-auto"
                onClick={() => navigate('/browse-tasks')}
              >
                Tìm công việc
              </button>
            </div>
          </div>
        </div>
        
        {/* Wave shape divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 transform">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 text-white">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Công việc đã hoàn thành' },
              { number: '8K+', label: 'Người dùng đã đăng ký' },
              { number: '4.8', label: 'Đánh giá trung bình' },
              { number: '24/7', label: 'Hỗ trợ khách hàng' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-md transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Categories - Enhanced */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="relative">
              <h3 className="text-3xl font-extrabold text-center mb-3">Danh mục phổ biến</h3>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-green-600 rounded-full"></div>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-8 mb-12 max-w-2xl mx-auto">Chọn từ các danh mục dịch vụ phổ biến nhất của chúng tôi để tìm sự trợ giúp bạn cần</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {categories.map((category, index) => (
              <div key={category.name} className="relative group cursor-pointer">
                <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center transform transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
                  <div className="w-20 h-20 rounded-full mb-4 bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white">
                    {category.icon}
                  </div>
                  <span className="font-semibold text-gray-800 group-hover:text-green-600">{category.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works - Enhanced */}
      <div className="py-20 bg-white overflow-hidden relative">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-50 rounded-bl-full opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-emerald-50 rounded-tr-full opacity-70"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-center">
            <div className="relative">
              <h3 className="text-3xl font-extrabold text-center mb-3">Cách thức hoạt động</h3>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-green-600 rounded-full"></div>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-8 mb-16 max-w-2xl mx-auto">
            Chúng tôi kết nối bạn với những người giúp việc đáng tin cậy chỉ trong vài bước đơn giản
          </p>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 h-1 w-full bg-green-200 -translate-y-1/2 z-0"></div>
            
            <div className="grid md:grid-cols-3 gap-10 relative z-10">
              <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-b-4 border-green-600">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-lg">1</div>
                <h4 className="text-xl font-semibold mb-4 text-center">Đăng việc</h4>
                <p className="text-gray-600 text-center">Mô tả chi tiết công việc bạn cần giúp đỡ và thời gian hoàn thành</p>
                <div className="mt-6 text-center">
                  <button className="text-green-600 font-medium flex items-center justify-center mx-auto hover:underline">
                    <span>Xem thêm</span>
                    <FaArrowRight className="ml-1" />
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-b-4 border-green-600">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-lg">2</div>
                <h4 className="text-xl font-semibold mb-4 text-center">Xem xét các đề nghị</h4>
                <p className="text-gray-600 text-center">So sánh kỹ năng, đánh giá và giá cả, sau đó chọn người phù hợp nhất</p>
                <div className="mt-6 text-center">
                  <button className="text-green-600 font-medium flex items-center justify-center mx-auto hover:underline">
                    <span>Xem thêm</span>
                    <FaArrowRight className="ml-1" />
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-b-4 border-green-600">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-lg">3</div>
                <h4 className="text-xl font-semibold mb-4 text-center">Hoàn thành công việc!</h4>
                <p className="text-gray-600 text-center">Người giúp việc hoàn thành công việc và bạn thanh toán một cách an toàn</p>
                <div className="mt-6 text-center">
                  <button className="text-green-600 font-medium flex items-center justify-center mx-auto hover:underline">
                    <span>Xem thêm</span>
                    <FaArrowRight className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Services */}
      <div className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="relative">
              <h3 className="text-3xl font-extrabold text-center mb-3">Dịch vụ nổi bật</h3>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-green-600 rounded-full"></div>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-8 mb-16 max-w-2xl mx-auto">
            Khám phá các dịch vụ phổ biến nhất được cung cấp bởi cộng đồng của chúng tôi
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {title: "Dọn dẹp nhà cửa", image: "https://enic.vn/wp-content/uploads/2025/01/don-dep-nha-cua-theo-trinh-tu-giup-qua-trinh-tro-nen-nhanh-chong-hon.jpg"},
              {title: "Sửa chữa điện", image: "https://lh3.googleusercontent.com/B87ppilk_YreDqS2C1t7wZ5mL9Hl6wFNqaT31Uxj-VSJU2oYM7BjZMtY-lRW4S0DJJNkoObhD6U6ZWiFBWFex0O1ZqxwsxgpsZEoDJ7UY4IOWGECJyfCxG8G1pJEB_ethIM3ZRGG"},
              {title: "Chuyển nhà", image: "https://chuyennhatrongoigiare.com.vn/wp-content/uploads/2023/11/chuyen-nha-tron-goi-quan-hoan-kiem-1.png"},
            ].map((service, idx) => (
              <div key={idx} className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h4 className="text-xl font-bold mb-2">{service.title}</h4>
                  <div className="flex items-center justify-between w-full">
                    <span className="bg-green-600 px-3 py-1 rounded-full text-sm font-medium">Xem thêm</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials - Enhanced with Carousel */}
      <div className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-green-50"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-emerald-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-center">
            <div className="relative">
              <h3 className="text-3xl font-extrabold text-center mb-3">Người dùng nói gì về chúng tôi</h3>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-green-600 rounded-full"></div>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-8 mb-16 max-w-2xl mx-auto">
            Khám phá trải nghiệm của những người đã sử dụng dịch vụ của chúng tôi
          </p>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Large quote marks */}
              <div className="absolute -top-10 -left-4 text-green-100 text-8xl font-serif">"</div>
              <div className="absolute -bottom-10 -right-4 text-green-100 text-8xl font-serif">"</div>
              
              <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                {testimonials.map((testimonial, idx) => (
                  <div 
                    key={idx} 
                    className={`transition-opacity duration-500 ${idx === activeTestimonial ? 'opacity-100' : 'opacity-0 hidden'}`}
                  >
                    <div className="flex flex-col items-center text-center mb-6">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-20 h-20 rounded-full border-4 border-white shadow-lg mb-4"
                      />
                      <h4 className="text-xl font-bold text-gray-800">{testimonial.name}</h4>
                      <div className="flex text-yellow-400 my-2">
                        {[...Array(testimonial.stars)].map((_, i) => (
                          <span key={i} className="text-lg">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg italic text-center">{testimonial.text}</p>
                  </div>
                ))}
              </div>
              
              {/* Testimonial navigation dots */}
              <div className="flex justify-center mt-8">
                {testimonials.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveTestimonial(idx)}
                    className={`w-3 h-3 mx-1 rounded-full transition-all ${idx === activeTestimonial ? 'bg-green-600 w-6' : 'bg-gray-300'}`}
                    aria-label={`Testimonial ${idx + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-green-600 to-emerald-800 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-white opacity-10"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
              Sẵn sàng để bắt đầu <span className="text-yellow-300">thay đổi</span> cách bạn thực hiện công việc?
            </h3>
            <p className="text-xl mb-10 opacity-90 leading-relaxed">
              Tham gia cùng hàng nghìn người sử dụng GiupViecVat để hoàn thành nhiều việc hơn mỗi ngày
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <button 
                className="bg-white text-green-700 px-8 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-yellow-100"
                onClick={() => navigate('/register')}
              >
                Kiếm thêm thu nhập ngay
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-green-700 transition-all duration-300">
                Trở thành người giúp việc
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Create Task Modal */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
}

export default Home;
