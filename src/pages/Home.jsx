import React from 'react';

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Nhận trợ giúp với các công việc hàng ngày</h2>
            <p className="text-xl text-gray-600 mb-8">Hàng nghìn người làm việc uy tín sẵn sàng giúp đỡ tại nhà và văn phòng của bạn</p>
            
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row">
                <div className="flex-grow mb-3 md:mb-0 md:mr-2">
                  <input 
                    type="text" 
                    placeholder="Tôi cần giúp đỡ với..." 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
                  Đăng việc
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-10">Danh mục phổ biến</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Dọn dẹp', icon: '🧹' },
              { name: 'Thợ sửa chữa', icon: '🔧' },
              { name: 'Giao hàng', icon: '📦' },
              { name: 'Lắp ráp nội thất', icon: '🪑' },
              { name: 'Cải tạo nhà', icon: '🏠' },
              { name: 'Làm vườn', icon: '🌱' },
            ].map((category) => (
              <div key={category.name} className="flex flex-col items-center cursor-pointer group">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200">
                  <span className="text-blue-600 text-2xl">{category.icon}</span>
                </div>
                <span className="text-center text-gray-700 group-hover:text-blue-600">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-10">Cách thức hoạt động của GiupViecVat</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Đăng việc</h4>
              <p className="text-gray-600">Mô tả công việc bạn cần giúp đỡ và thời gian hoàn thành</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Xem xét các đề nghị</h4>
              <p className="text-gray-600">So sánh kỹ năng, đánh giá và giá cả, sau đó chọn người phù hợp nhất</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Hoàn thành công việc!</h4>
              <p className="text-gray-600">Người giúp việc hoàn thành công việc và bạn thanh toán một cách an toàn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-10">Người dùng nói gì về chúng tôi</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <h5 className="font-medium">Nguyễn Văn A</h5>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"GiupViecVat giúp tôi dễ dàng tìm người hỗ trợ chuyển nhà. Dịch vụ đáng tin cậy và giao tiếp tuyệt vời!"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Sẵn sàng để bắt đầu?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Tham gia cùng hàng nghìn người sử dụng GiupViecVat để hoàn thành nhiều việc hơn mỗi ngày</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100">Đăng việc</button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">Trở thành người giúp việc</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
