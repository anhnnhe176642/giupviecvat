import React, { useState, useEffect } from 'react';
import { FaLink, FaFacebookF, FaTwitter, FaEnvelope, FaGift, FaCopy, FaCheckCircle, FaUserPlus, FaCoins, FaPercent } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function ReferFriends() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://giupviecvat.vercel.app/ref/G54FNWE4"; // This would be dynamic based on user ID
  const [isVisible, setIsVisible] = useState({});
  
  // Add scrollToShare function
  const scrollToShare = () => {
    const shareSection = document.getElementById('share');
    if (shareSection) {
      shareSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(prevState => ({
            ...prevState,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);

  // Copy referral link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link đã được sao chép!");
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  // Share content for social media
  const shareContent = {
    title: "Nhận ưu đãi đặc biệt khi tham gia GiupViecVat!",
    description: "Đăng ký qua link của tôi và cả hai chúng ta đều nhận được ưu đãi đặc biệt. Hãy tham gia GiupViecVat ngay hôm nay!",
    hashtags: "GiupViecVat,Referral,UuDai"
  };

  // Share to social platforms with actual popup windows
  const shareToSocial = (platform) => {
    let shareUrl = '';
    let width = 550;
    let height = 450;
    
    switch (platform) {
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(shareContent.description)}`;
        break;
      case 'Twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareContent.description)}&hashtags=${shareContent.hashtags.replace(/,/g, '')}`;
        break;
      case 'Email':
        // For email, we'll use mailto protocol instead of a popup
        shareUrl = `mailto:?subject=${encodeURIComponent(shareContent.title)}&body=${encodeURIComponent(shareContent.description + '\n\n' + referralLink)}`;
        window.location.href = shareUrl;
        toast.success(`Email đã được mở để chia sẻ!`);
        return;
      default:
        toast.error("Không hỗ trợ chia sẻ qua nền tảng này");
        return;
    }
    
    // Calculate center position for the popup
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    
    // Open the popup
    const popup = window.open(
      shareUrl,
      `Share to ${platform}`,
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
    );
    
    // If popup was blocked or couldn't be opened
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      toast.error("Popup đã bị chặn. Vui lòng cho phép popup cho trang web này.");
    } else {
      toast.success(`Đã mở cửa sổ chia sẻ đến ${platform}!`);
      
      // Set up an interval to check if the popup was closed
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          toast.success(`Hoàn tất chia sẻ lên ${platform}!`);
        }
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Hero Section */}
      <section id="hero" className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 py-24">
        {/* Animated decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <motion.div 
            initial={{ opacity: 0.1, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            className="absolute -top-10 -right-10 w-80 h-80 bg-white rounded-full"
          />
          <motion.div 
            initial={{ opacity: 0.1, scale: 0.8 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 4, delay: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-40 -left-20 w-72 h-72 bg-green-300 rounded-full"
          />
          <motion.div 
            initial={{ opacity: 0.05, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 5, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute -bottom-10 left-1/4 w-64 h-64 bg-yellow-300 rounded-full"
          />
          
          {/* Floating icons */}
          <div className="absolute inset-0 w-full h-full">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white opacity-10"
                initial={{
                  x: Math.random() * 100 - 50, 
                  y: Math.random() * 100 - 50,
                  scale: Math.random() * 0.5 + 0.5
                }}
                animate={{
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                  transition: { duration: 10 + i, repeat: Infinity, repeatType: "reverse" }
                }}
              >
                {[<FaGift size={25} />, <FaCoins size={25} />, <FaUserPlus size={25} />][i % 3]}
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-gradient-to-r from-yellow-300 to-yellow-400 text-green-800 px-6 py-2 rounded-full mb-8 font-bold text-md shadow-lg"
            >
              Chương trình giới thiệu bạn bè
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl font-extrabold mb-8 text-white leading-tight"
            >
              Giới thiệu bạn bè, <span className="text-yellow-300 inline-block relative">
                nhận quà
                <motion.div 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-300 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span> cùng nhau!
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-2xl mb-12 text-green-50"
            >
              Mời bạn bè tham gia GIupViecVat và cả hai sẽ nhận được ưu đãi đặc biệt
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToShare}
              className="bg-white text-green-700 px-10 py-4 rounded-full hover:bg-yellow-100 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl"
            >
              Bắt đầu giới thiệu ngay
            </motion.button>
          </motion.div>
        </div>
        
        {/* Wave shape divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 transform translate-y-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 text-gray-50">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </section>

      {/* Referral Link Section */}
      <section id="share" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.share ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10 mb-16 border border-gray-100"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-full">
                <FaLink className="text-3xl text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
              Chia sẻ link giới thiệu của bạn
            </h2>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-10">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 p-3 md:p-5 rounded-xl flex-1 flex items-center overflow-x-auto shadow-inner border border-gray-100"
              >
                <span className="text-gray-600 text-sm md:text-base font-medium overflow-hidden overflow-ellipsis break-all">{referralLink}</span>
              </motion.div>
              <motion.button 
                onClick={copyToClipboard} 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-5 rounded-xl font-bold flex items-center justify-center transition-all duration-300 shadow-lg ${copied ? 'bg-green-600 text-white' : 'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white'}`}
              >
                {copied ? (
                  <>
                    <FaCheckCircle className="mr-2" /> Đã sao chép
                  </>
                ) : (
                  <>
                    <FaCopy className="mr-2" /> Sao chép
                  </>
                )}
              </motion.button>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-6 text-lg">Hoặc chia sẻ qua mạng xã hội:</p>
              <div className="flex justify-center space-x-6">
                <motion.button 
                  onClick={() => shareToSocial('Facebook')} 
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center transition-colors shadow-lg"
                >
                  <FaFacebookF size={24} />
                </motion.button>
                <motion.button 
                  onClick={() => shareToSocial('Twitter')} 
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 text-white flex items-center justify-center transition-colors shadow-lg"
                >
                  <FaTwitter size={24} />
                </motion.button>
                <motion.button 
                  onClick={() => shareToSocial('Email')} 
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center transition-colors shadow-lg"
                >
                  <FaEnvelope size={24} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rewards Section */}
      <section id="rewards" className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={isVisible.rewards ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-block bg-green-100 text-green-800 px-5 py-2 rounded-full mb-5 font-medium">
                Ưu đãi hấp dẫn
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-8 relative inline-block">
                Phần thưởng hấp dẫn
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1.5 w-24 bg-green-600 rounded-full"></div>
              </h2>
              <p className="text-xl text-gray-600 mt-8 max-w-3xl mx-auto">
                Cả bạn và bạn bè đều được nhận ưu đãi độc quyền khi tham gia chương trình
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={isVisible.rewards ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 mr-6 shadow-lg">
                    <FaGift className="text-3xl text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-4 text-gray-800">Bạn sẽ nhận được</h3>
                    <ul className="space-y-4">
                      <li className="flex items-center text-lg">
                        <div className="bg-yellow-100 rounded-full p-2 mr-3">
                          <FaCoins className="text-yellow-500" />
                        </div>
                        <span>50.000đ cho mỗi bạn bè đăng ký thành công</span>
                      </li>
                      <li className="flex items-center text-lg">
                        <div className="bg-green-100 rounded-full p-2 mr-3">
                          <FaPercent className="text-green-500" />
                        </div>
                        <span>Giảm 10% cho lần sử dụng dịch vụ tiếp theo</span>
                      </li>
                      <li className="flex items-center text-lg">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <FaUserPlus className="text-blue-500" />
                        </div>
                        <span>Thêm điểm thưởng vào tài khoản thành viên</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={isVisible.rewards ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-yellow-500 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-5 mr-6 shadow-lg">
                    <FaGift className="text-3xl text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl mb-4 text-gray-800">Bạn bè sẽ nhận được</h3>
                    <ul className="space-y-4">
                      <li className="flex items-center text-lg">
                        <div className="bg-yellow-100 rounded-full p-2 mr-3">
                          <FaCoins className="text-yellow-500" />
                        </div>
                        <span>100.000đ vào tài khoản khi đăng ký</span>
                      </li>
                      <li className="flex items-center text-lg">
                        <div className="bg-green-100 rounded-full p-2 mr-3">
                          <FaPercent className="text-green-500" />
                        </div>
                        <span>Giảm 15% cho lần đầu sử dụng dịch vụ</span>
                      </li>
                      <li className="flex items-center text-lg">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <FaUserPlus className="text-blue-500" />
                        </div>
                        <span>Tài khoản VIP trong 1 tháng đầu tiên</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={isVisible['how-it-works'] ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-block bg-blue-100 text-blue-800 px-5 py-2 rounded-full mb-5 font-medium">
                Đơn giản & dễ dàng
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-8 relative inline-block">
                Cách thức hoạt động
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1.5 w-24 bg-blue-600 rounded-full"></div>
              </h2>
              <p className="text-xl text-gray-600 mt-8 max-w-3xl mx-auto">
                Chỉ 3 bước đơn giản để nhận thưởng cùng bạn bè
              </p>
            </motion.div>
            
            <div className="relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-1/2 left-0 h-2 w-full bg-gradient-to-r from-green-200 via-emerald-300 to-green-200 -translate-y-1/2 z-0 rounded-full"></div>
              
              <div className="grid md:grid-cols-3 gap-10 relative z-10">
                {[
                  {
                    step: 1,
                    title: "Chia sẻ link",
                    description: "Sao chép link giới thiệu và chia sẻ với bạn bè qua tin nhắn, email hoặc mạng xã hội",
                    delay: 0.1
                  },
                  {
                    step: 2,
                    title: "Bạn bè đăng ký",
                    description: "Bạn bè của bạn đăng ký tài khoản GIupViecVat thông qua link giới thiệu",
                    delay: 0.3
                  },
                  {
                    step: 3,
                    title: "Nhận thưởng",
                    description: "Cả bạn và bạn bè đều nhận được phần thưởng sau khi họ hoàn thành đăng ký tài khoản",
                    delay: 0.5
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible['how-it-works'] ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: item.delay }}
                    whileHover={{ y: -10 }}
                    className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
                  >
                    <motion.div 
                      whileHover={{ rotate: 5 }}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-lg"
                    >
                      {item.step}
                    </motion.div>
                    <h4 className="text-xl font-semibold mb-4 text-center">{item.title}</h4>
                    <p className="text-gray-600 text-center">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Statistics and Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-20">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="grid md:grid-cols-3 gap-8"
              >
                {[
                  { value: "10K+", label: "Người dùng đã tham gia thông qua giới thiệu", delay: 0.1 },
                  { value: "500M+", label: "Tổng số tiền thưởng đã trao", delay: 0.3 },
                  { value: "85%", label: "Người dùng hài lòng với chương trình", delay: 0.5 }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: stat.delay }}
                    className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                  >
                    <motion.div 
                      initial={{ scale: 0.5 }}
                      animate={isVisible.testimonials ? { scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: stat.delay + 0.3 }}
                      className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 mb-4"
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-gray-600 text-lg">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-white p-10 rounded-2xl shadow-xl"
            >
              <div className="mb-8 text-center">
                <div className="inline-block bg-purple-100 text-purple-800 px-5 py-2 rounded-full mb-5 font-medium">
                  Đánh giá
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">Người dùng nói gì về chương trình</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    text: "Tôi đã giới thiệu GIupViecVat cho 5 người bạn và nhận được khá nhiều ưu đãi. Dịch vụ tuyệt vời và chương trình khuyến mãi cũng rất tốt!",
                    name: "Nguyễn Thị Mai",
                    role: "Khách hàng",
                    avatar: "https://randomuser.me/api/portraits/women/12.jpg"
                  },
                  {
                    text: "Tôi được giới thiệu bởi một người bạn và nhận ngay ưu đãi. Quá đơn giản và tiện lợi. Bây giờ tôi cũng đang giới thiệu cho người khác.",
                    name: "Trần Văn Tùng",
                    role: "Khách hàng",
                    avatar: "https://randomuser.me/api/portraits/men/22.jpg"
                  }
                ].map((testimonial, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                    animate={isVisible.testimonials ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.9 + index * 0.2 }}
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-md"
                  >
                    <div className="mb-4">
                      <svg className="h-8 w-8 text-green-400 mb-4" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 8c-2.2 0-4 1.8-4 4v10h10V12H8c0-1.1.9-2 2-2V8zm12 0c-2.2 0-4 1.8-4 4v10h10V12h-8c0-1.1.9-2 2-2V8z"></path>
                      </svg>
                      <p className="text-gray-600 italic">{testimonial.text}</p>
                    </div>
                    <div className="flex items-center">
                      <img 
                        className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-white shadow-md" 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                      />
                      <div>
                        <div className="font-semibold text-lg">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={isVisible.faq ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-block bg-yellow-100 text-yellow-800 px-5 py-2 rounded-full mb-5 font-medium">
                Hỗ trợ
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-8 relative inline-block">
                Câu hỏi thường gặp
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1.5 w-24 bg-yellow-500 rounded-full"></div>
              </h2>
              <p className="text-xl text-gray-600 mt-8">
                Những thông tin bạn cần biết về chương trình giới thiệu
              </p>
            </motion.div>
            
            <div className="space-y-6">
              {[
                {
                  q: "Tôi có thể giới thiệu bao nhiêu người bạn?",
                  a: "Bạn có thể giới thiệu không giới hạn số lượng bạn bè. Mỗi lần giới thiệu thành công, bạn sẽ nhận được phần thưởng tương ứng."
                },
                {
                  q: "Làm thế nào để theo dõi những người tôi đã giới thiệu?",
                  a: "Bạn có thể theo dõi danh sách người bạn đã giới thiệu và trạng thái giới thiệu trong mục 'Giới thiệu bạn bè' trong tài khoản của bạn."
                },
                {
                  q: "Khi nào tôi nhận được phần thưởng?",
                  a: "Phần thưởng sẽ được cộng vào tài khoản của bạn ngay sau khi người bạn giới thiệu hoàn tất đăng ký và xác minh tài khoản."
                },
                {
                  q: "Phần thưởng có hạn sử dụng không?",
                  a: "Phần thưởng không có thời hạn sử dụng. Mã giảm giá thường có thời hạn 30 ngày kể từ ngày nhận được."
                },
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible.faq ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * idx }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 shadow-md"
                >
                  <h4 className="font-semibold text-lg mb-3">{item.q}</h4>
                  <p className="text-gray-600">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 relative overflow-hidden">
          {/* Decorative elements */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-64 -right-64 w-96 h-96 bg-white opacity-5 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-5 rounded-full"
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <motion.h3 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-8"
            >
              Sẵn sàng nhận thưởng cùng bạn bè?
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl mb-10 opacity-90 max-w-2xl mx-auto"
            >
              Hãy bắt đầu chia sẻ ngay hôm nay và cùng nhau tận hưởng những ưu đãi hấp dẫn
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToShare}
              className="bg-white text-green-700 px-10 py-5 rounded-full hover:bg-yellow-100 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-xl transform hover:-translate-y-1"
            >
              Chia sẻ ngay bây giờ
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default ReferFriends;
