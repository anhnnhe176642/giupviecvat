import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function Footer() {
  const [buttonText, setButtonText] = useState("Lấy Code");
  const [isDisabled, setIsDisabled] = useState(false);

  // Add the script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s.traffic100.com/s/script-100.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Check if code already exists in localStorage
    const key = localStorage.getItem('keyCodeAccess');
    if (key) {
      const currentUrl = window.location.href;
      const type = document.referrer.includes('https://www.google.com') ? 'search' : 'direct';
      const userAgent = navigator.userAgent;
      
      fetch('https://s.traffic100.com/s/link/get-code-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: currentUrl,
          type: type,
          agent: userAgent,
        }),
      })
      .then(response => response.json())
      .then(response => {
        if (response.data.length === 6) {
          setButtonText(response.data);
          setIsDisabled(true);
        }
      });
    }
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const handleButtonClick = async () => {
    if (isDisabled) return;
    
    setIsDisabled(true);
    
    // Detect Incognito functionality
    if (window.detectIncognito) {
      try {
        const result = await window.detectIncognito();
        if (result.isPrivate) {
          toast('Vui lòng tắt chế độ ẩn danh (riêng tư) của trình duyệt');
          setIsDisabled(false);
          return;
        }
      } catch (error) {
        console.error('Đã xảy ra lỗi trong quá trình kiểm tra:', error);
      }
    }
    
    // Start countdown
    const countdownSeconds = Math.floor(Math.random() * (80 - 60 + 1)) + 60;
    startCountdown(countdownSeconds);
  };
  
  const startCountdown = (seconds) => {
    setButtonText(`Đợi lấy mã: ${seconds}s`);
    
    const countdownInterval = setInterval(() => {
      seconds--;
      setButtonText(`Đợi lấy mã: ${seconds}s`);
      
      if (seconds <= 0) {
        clearInterval(countdownInterval);
        const currentUrl = window.location.href;
        const type = document.referrer.includes('https://www.google.com') ? 'search' : 'direct';
        const userAgent = navigator.userAgent;
        
        fetch('https://s.traffic100.com/s/link/get-code-website', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: currentUrl,
            type: type,
            agent: userAgent,
          }),
        })
        .then(response => response.json())
        .then(response => {
          if (response.data.length === 6) {
            setButtonText(response.data);
          } else {
            localStorage.setItem('keyCodeAccess', 'keyCodeAccess');
            setButtonText(response.data);
          }
        });
      }
    }, 1000);
  };
  
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">GiupViecVat</h4>
            <p className="text-gray-300">Giải pháp tìm kiếm những người giúp việc đáng tin cậy.</p>
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
        
        {/* Add the Get Code button */}
        <div className="mt-8 flex justify-center">
          <div 
            id="get-code-website" 
            className={`inline-block w-[200px] h-[50px] pt-[10px] m-[10px] text-base font-bold text-center cursor-pointer rounded-lg ${isDisabled ? 'bg-orange-500' : 'bg-[#4CAF50] hover:bg-[#45a049]'} text-white border-none transition-colors duration-300 ease-in-out ${isDisabled ? 'pointer-events-none' : ''}`}
            onClick={handleButtonClick}
          >
            <span>{buttonText}</span>
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
