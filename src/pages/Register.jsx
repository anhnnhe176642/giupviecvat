import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { AuthContext } from "../conext/AuthContext";
import {Link} from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { validateReferralCode } from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralInfo, setReferralInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingReferral, setIsValidatingReferral] = useState(false);
  const navigate = useNavigate();
  const { googleLogin } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  // Check for referral code in URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      validateReferral(refCode);
    }
  }, [searchParams]);

  // Validate referral code
  const validateReferral = async (code) => {
    if (!code || code.length < 3) {
      setReferralInfo(null);
      return;
    }

    try {
      setIsValidatingReferral(true);
      const response = await validateReferralCode(code);
      if (response.success) {
        setReferralInfo(response.data);
        toast.success(`Mã giới thiệu hợp lệ từ ${response.data.referrerName}!`);
      } else {
        setReferralInfo(null);
        toast.error('Mã giới thiệu không hợp lệ');
      }
    } catch (error) {
      setReferralInfo(null);
      console.error('Error validating referral:', error);
    } finally {
      setIsValidatingReferral(false);
    }
  };

  const handleReferralCodeChange = (e) => {
    const code = e.target.value.toUpperCase();
    setReferralCode(code);
    
    // Debounce validation
    setTimeout(() => {
      if (code === referralCode) {
        validateReferral(code);
      }
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const requestData = {
        name,
        email,
        password
      };
      
      // Include referral code if provided
      if (referralCode) {
        requestData.referralCode = referralCode;
      }
      
      const response = await axios.post("/auth/register", requestData);
      
      if (response.data.success) {
        let successMessage = "Đăng ký thành công! Vui lòng đăng nhập.";
        if (response.data.message && response.data.message.includes('bonus')) {
          successMessage = response.data.message;
        }
        toast.success(successMessage);
        navigate("/login");
      } else {
        toast.error(response.data.message || "Đăng ký không thành công");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi đăng ký");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    googleLogin(credentialResponse).then(() => {
      navigate("/");
    });
  };

  const handleGoogleError = () => {
    toast.error("Đăng ký bằng Google không thành công. Vui lòng thử lại.");
    console.error("Google registration failed");
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
            <h1 className="text-2xl xl:text-3xl font-extrabold">Đăng ký tài khoản</h1>
            <div className="w-full flex-1 mt-6">
              <div className="flex flex-col items-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  width="100%"
                  shape="pill"
                  text="signup_with"
                  locale="vi"
                  theme="outline"
                  size="large"
                  logo_alignment="left"
                />
              </div>
              <div className="my-8 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Hoặc đăng ký bằng email
                </div>
              </div>
              <form onSubmit={handleSubmit} className="mx-auto max-w-xs">
                <input
                  className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  placeholder="Họ và tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-4"
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
                
                {/* Referral Code Section */}
                <div className="mt-4">
                  <div className="relative">
                    <input
                      className={`w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border placeholder-gray-500 text-sm focus:outline-none focus:bg-white ${
                        referralInfo ? 'border-green-400 bg-green-50' : 
                        referralCode && !referralInfo ? 'border-red-400 bg-red-50' : 
                        'border-gray-200'
                      }`}
                      type="text"
                      placeholder="Mã giới thiệu (tùy chọn)"
                      value={referralCode}
                      onChange={handleReferralCodeChange}
                      maxLength={20}
                    />
                    {isValidatingReferral && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {referralInfo && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-green-700 font-medium">
                          Được giới thiệu bởi: {referralInfo.referrerName}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-green-600">
                        🎉 Bạn sẽ nhận 100,000đ + voucher giảm giá 15% sau khi đăng ký!
                      </div>
                    </div>
                  )}
                  
                  {referralCode && !referralInfo && !isValidatingReferral && (
                    <div className="mt-2 text-xs text-red-600">
                      Mã giới thiệu không hợp lệ
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="cursor-pointer mt-4 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </div>
                  ) : (
                    <>
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
                      <span className="ml-3">Đăng ký</span>
                    </>
                  )}
                </button>
                <p className="mt-4 text-xs text-gray-600 text-center">
                  Bạn đã có tài khoản?{" "}
                  <Link
                    to="/login"
                    className="border-b border-gray-500 border-dotted hover:text-indigo-600 transition-colors"
                  >
                    Đăng nhập
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

export default Register;
