import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { AuthContext } from "../conext/AuthContext";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, googleLogin } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await login({ email, password })) {
      navigate("/");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    googleLogin(credentialResponse).then(() => {
      navigate("/");
    });
  };

  const handleGoogleError = () => {
    toast.error("Đăng nhập bằng Google không thành công. Vui lòng thử lại.");
    console.error("Google login failed");
  };

  return (
    <div className="h-screen bg-gray-100 text-gray-900 flex justify-center overflow-hidden">
      <div className="max-w-screen-xl max-h-full m-0 sm:m-5 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-4 sm:p-6 overflow-y-auto">
          <div className="flex justify-center">
            <Link to="/" className="w-32 mx-auto">
              <p className="text-2xl font-bold text-center text-blue-600">
                <img
                  src={`${import.meta.env.BASE_URL}giupviecvatlogo.png`}
                  className="h-25 w-auto mx-auto"
                  alt="Giupviecvat"
                />
              </p>
            </Link>
          </div>
          <div className="mt-6 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Đăng nhập</h1>
            <div className="w-full flex-1 mt-6">
              <div className="flex flex-col items-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  width="100%"
                  shape="pill"
                  text="signin_with"
                  locale="vi"
                  theme="outline"
                  size="large"
                  logo_alignment="left"
                />
              </div>
              <div className="my-8 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Hoặc đăng nhập bằng email
                </div>
              </div>
              <form onSubmit={handleSubmit} className="mx-auto max-w-xs">
                <input
                  className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-4"
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="cursor-pointer mt-4 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <svg
                    className="w-5 h-5 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy={7} r={4} />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">Đăng nhập</span>
                </button>
                <p className="mt-4 text-xs text-gray-600 text-center">
                  Bạn chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    className="border-b border-gray-500 border-dotted hover:text-indigo-600 transition-colors"
                  >
                    Đăng ký
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-6 xl:m-12 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                'url("https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg")',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
