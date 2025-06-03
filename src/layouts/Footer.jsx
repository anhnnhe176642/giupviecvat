function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">GiupViecVat</h4>
            <p className="text-gray-300">Giải pháp quản lý công việc của bạn trên đám mây.</p>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Giới thiệu</h5>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Cách hoạt động</a></li>
              <li><a href="#" className="hover:text-white">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-white">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-white">Báo chí</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Hỗ trợ</h5>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-white">Liên hệ</a></li>
              <li><a href="#" className="hover:text-white">Cộng đồng</a></li>
              <li><a href="#" className="hover:text-white">An toàn & Bảo mật</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Theo dõi chúng tôi</h5>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">FB</a>
              <a href="#" className="hover:text-white">IG</a>
              <a href="#" className="hover:text-white">TW</a>
              <a href="#" className="hover:text-white">LI</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-gray-300">© 2025 GiupViecVat. Chưa đăng ký bản quyền.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-white">Điều khoản</a>
            <a href="#" className="text-gray-300 hover:text-white">Quyền riêng tư</a>
            <a href="#" className="text-gray-300 hover:text-white">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
