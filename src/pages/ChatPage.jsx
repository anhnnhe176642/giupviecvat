import React, { useState } from "react";
import { Menu, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobDetailModal from "../components/JobDetailModal";

// Import chat components
import Message from "../components/chat/Message";
import SystemCard from "../components/chat/SystemCard";
import DateSeparator from "../components/chat/DateSeparator";
import JobAssignmentMessage from "../components/chat/JobAssignmentMessage";
import ChatInput from "../components/chat/ChatInput";
import Header from "../layouts/Header";

const ChatPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState({
    title: "Làm sạch và sắp xếp căn hộ",
    price: "300k",
    time: "2 giờ",
    date: "23/05/2025",
    timeSlot: "8:00 - 10:00",
    location: "42 Nguyễn Huệ, Quận 1, TP. HCM",
    description:
      "Công việc bao gồm dọn dẹp căn hộ 2 phòng ngủ, lau sàn, dọn bếp và sắp xếp đồ đạc gọn gàng. Cần hoàn thành trong buổi sáng để chuẩn bị cho sự kiện vào buổi chiều.",
    skills: ["Cẩn thận", "Tỉ mỉ", "Đúng hẹn"],
    clientName: "Nguyễn Thị B",
    clientImage: "https://randomuser.me/api/portraits/women/21.jpg",
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Here you would add message sending logic
    console.log("Sending message:", message);
    setMessage("");
  };

  const handleAcceptJob = () => {
    console.log("Job accepted");
    setIsJobModalOpen(false);
    // Here you would add logic to handle job acceptance
  };

  const handleDeclineJob = () => {
    console.log("Job declined");
    setIsJobModalOpen(false);
    // Here you would add logic to handle job rejection
  };

  // Sample messages data
  const messages = [
    {
      sender: "A",
      content:
        "Chào bạn, tôi đã xem thông tin công việc của bạn và rất muốn nhận việc này.",
      timestamp: "10:15 AM",
      isOutgoing: true,
    },
    {
      sender: "B",
      content:
        "Xin chào, rất vui khi bạn quan tâm. Bạn có kinh nghiệm về lĩnh vực này không?",
      timestamp: "10:17 AM",
      isOutgoing: false,
    },
    {
      sender: "A",
      content:
        "Vâng, tôi đã làm trong lĩnh vực này được 3 năm và hoàn thành nhiều công việc tương tự.",
      timestamp: "10:19 AM",
      isOutgoing: true,
    },
    {
      sender: "B",
      content:
        "Rất ấn tượng! Tôi nghĩ bạn phù hợp với công việc này. Khi nào bạn có thể bắt đầu?",
      timestamp: "10:23 AM",
      isOutgoing: false,
    },
    {
      sender: "A",
      content: "Tôi có thể làm việc từ 8 giờ sáng vào cuối tuần.",
      timestamp: "10:24 AM",
      isOutgoing: true,
    },
  ];

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex flex-1 antialiased text-gray-800 overflow-hidden">
          <div className="flex flex-row h-full w-full overflow-x-hidden">
            {/* Sidebar */}
            <div
              className={`flex flex-col py-4 md:py-8 pl-4 md:pl-6 pr-2 w-56 md:w-64 bg-white flex-shrink-0 ${
                isMobileMenuOpen ? "block" : "hidden"
              } md:block overflow-y-auto`}
            >
              <div className="flex flex-row items-center justify-center h-12 w-full">
                <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-2 font-bold text-2xl">TaskerChat</div>
              </div>

              {/* Active Conversations */}
              <div className="flex flex-col mt-8">
                <div className="flex flex-row items-center justify-between text-xs">
                  <span className="font-bold">Cuộc trò chuyện hoạt động</span>
                  <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                    4
                  </span>
                </div>

                <div className="flex flex-col space-y-1 mt-4 -mx-2 h-72 overflow-y-auto">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      className={`flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 ${
                        i === 1 ? "bg-gray-100" : ""
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center h-8 w-8 ${
                          i === 1 ? "bg-indigo-200" : "bg-gray-200"
                        } rounded-full`}
                      >
                        {i % 2 ? "N" : "M"}
                      </div>
                      <div className="ml-2 text-sm font-semibold">{`Người dùng ${i}`}</div>
                      {i === 2 && (
                        <div className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none">
                          2
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex flex-col flex-auto h-full p-3 md:p-6 max-w-full">
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden mb-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 mr-2"
                >
                  <Menu size={20} />
                </button>
                <div className="flex items-center">
                  <img
                    src="https://randomuser.me/api/portraits/women/21.jpg"
                    alt="Contact"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="ml-2">
                    <h3 className="font-medium">Nguyễn Thị B</h3>
                    <p className="text-xs text-green-600">Đang hoạt động</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full max-h-full p-2 md:p-4 w-full">
                <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden mb-2 md:mb-4">
                  <div className="flex flex-col h-full w-full">
                    <div className="grid grid-cols-12 gap-y-2 w-full">
                      {/* Date Separator */}
                      <DateSeparator date="Hôm nay" />

                      {/* Job Description Card */}
                      <SystemCard job={jobDetails} />

                      {/* Chat Messages */}
                      {messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`col-span-12 ${
                            msg.isOutgoing
                              ? "col-start-6"
                              : "col-start-1 col-end-9"
                          } break-words`}
                        >
                          <Message
                            content={msg.content}
                            timestamp={msg.timestamp}
                            sender={msg.sender}
                            isOutgoing={msg.isOutgoing}
                          />
                        </div>
                      ))}

                      {/* Job Assignment Message */}
                      <JobAssignmentMessage
                        job={jobDetails}
                        onViewDetails={() => setIsJobModalOpen(true)}
                        timestamp="10:25 AM"
                        sender="B"
                      />
                    </div>
                  </div>
                </div>

                {/* Message input */}
                <ChatInput
                  message={message}
                  setMessage={setMessage}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </div>
          </div>

          {/* Job Detail Modal */}
          <JobDetailModal
            isOpen={isJobModalOpen}
            onClose={() => setIsJobModalOpen(false)}
            job={jobDetails}
            onAccept={handleAcceptJob}
            onDecline={handleDeclineJob}
          />
        </div>
      </div>
    </>
  );
};

export default ChatPage;
