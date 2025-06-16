import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

const LoginRequired = () => {
  return (
    <div className="login-required-container">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Vui lòng đăng nhập để xem các tin nhắn của bạn</h2>
                  <p className="text-gray-600">Bạn cần đăng nhập để xem và quản lý các tin nhắn của mình.</p>
                  <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
                      <Link
                        to="/login"
                        className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors duration-200 text-center text-lg"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        className="border border-green-600 text-green-600 px-8 py-3 rounded-full hover:bg-green-50 transition-colors duration-200 text-center text-lg"
                      >
                        Đăng ký
                      </Link>
                    </div>
                    <div className="mt-8">
                      <Link
                        to="/"
                        className="text-green-600 hover:underline text-lg"
                      >
                        Quay lại trang chủ
                      </Link>
                    </div>
                </div>
              </div>
        <Footer />
    </div>
  );
};

export default LoginRequired;
