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
import { useContext } from "react";
import { ChatContext } from "../conext/ChatConext";
import { AuthContext } from "../conext/AuthConext";
import { useEffect } from "react";
import { useRef } from "react";

const ChatPage = () => {
  const {
    getConversations,
    conversations,
    currentConversation,
    setCurrentConversation,
    unseenMessages,
    setUnseenMessages,
    messages,
    loadMoreMessages,
    hasMore,
    isLoadingMore,
    sendMessage,
  } = useContext(ChatContext);

  const { onlineUsers, user } = useContext(AuthContext);
  const messagesContainerRef = useRef(null);
  const scrollEnd = useRef();
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

  useEffect(() => {
    getConversations();
  }, [onlineUsers]);

  // Periodically refresh conversations to get updated unread counts
  useEffect(() => {
    // Initial fetch
    getConversations();
    
    // Set up interval to refresh conversations list every 30 seconds
    const refreshInterval = setInterval(() => {
      if (!currentConversation) {
        // Only auto-refresh when no conversation is selected to avoid interrupting users
        getConversations();
      }
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  const navigate = useNavigate();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(currentConversation._id, message);
    setMessage("");
  };

  // Function to handle scroll to load more messages
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    // If user scrolled to near the top, load more messages
    const { scrollTop } = messagesContainerRef.current;
    if (scrollTop < 50 && hasMore && !isLoadingMore) {
      loadMoreMessages();
    }
  };

  // Keep scroll position when loading older messages
  useEffect(() => {
    if (isLoadingMore && messagesContainerRef.current) {
      // Store current scroll height before new messages are added
      const scrollHeight = messagesContainerRef.current.scrollHeight;

      // After new messages are loaded and rendered, adjust the scroll position
      return () => {
        if (messagesContainerRef.current) {
          const newScrollHeight = messagesContainerRef.current.scrollHeight;
          messagesContainerRef.current.scrollTop = newScrollHeight - scrollHeight;
        }
      };
    }
  }, [isLoadingMore]);

  // Add this state to track initial loading of conversation
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Modify the useEffect that handles conversation changes
  useEffect(() => {
    if (currentConversation) {
      // Mark this as an initial load when conversation changes
      setIsInitialLoad(true);
    }
  }, [currentConversation]);

  // Modify the scroll effect to properly handle initial loads
  useEffect(() => {
    // Only run this effect if we have messages and the scrollEnd ref exists
    if (messages.length > 0 && scrollEnd.current) {
      // If it's the initial load of the conversation OR user is adding a new message
      // then we want to scroll to the bottom
      if (isInitialLoad) {
        // Use a short timeout to ensure DOM is fully rendered
        setTimeout(() => {
          scrollEnd.current.scrollIntoView({ behavior: "auto" });
          setIsInitialLoad(false);
        }, 100);
      } else if (messagesContainerRef.current) {
        // For new messages, only scroll if user is already near the bottom
        const { scrollHeight, clientHeight, scrollTop } = messagesContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
        
        if (isNearBottom) {
          scrollEnd.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [messages, isInitialLoad]);

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

  // Function to format time
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    
    // If same day, show time only
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } 
    // If this year, show month and day
    else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    // Otherwise show year too
    else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' });
    }
  };

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
                    {conversations?.length || 0}
                  </span>
                </div>

                <div className="flex flex-col space-y-1 mt-4 -mx-2 h-72 overflow-y-auto">
                  {/* Fix the unread message count display */}
                  {conversations?.map((conversation) => (
                    <button
                      key={conversation._id}
                      className={`flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 ${
                        conversation._id === currentConversation?._id ? "bg-gray-100" : ""
                      }`}
                      onClick={() => {
                        setCurrentConversation(conversation);
                      }}
                    >
                      <div
                        className={`flex items-center justify-center h-8 w-8 ${
                          conversation._id === currentConversation?._id ? "bg-indigo-200" : "bg-gray-200"
                        } rounded-full`}
                      >
                        {conversation.name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 ml-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-semibold ${unseenMessages[conversation._id] > 0 ? 'font-bold text-black' : 'font-medium text-gray-700'}`}>
                            {conversation.name}
                          </span>
                          {conversation.lastMessagePreview && (
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(conversation.lastMessagePreview.time)}
                            </span>
                          )}
                        </div>
                        
                        {conversation.lastMessagePreview && (
                          <div className="flex items-center">
                            <p className={`text-xs truncate max-w-[120px] ${unseenMessages[conversation._id] > 0 ? 'font-medium text-black' : 'text-gray-500'}`}>
                              {conversation.sender?._id === user?._id ? 'You: ' : ''}
                              {conversation.lastMessagePreview.text}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {unseenMessages[conversation._id] > 0 && (
                        <div className="flex items-center justify-center ml-2 min-w-[20px] h-5 px-1.5 text-xs text-white bg-indigo-500 rounded-full leading-none">
                          {unseenMessages[conversation._id] > 99 ? '99+' : unseenMessages[conversation._id]}
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
              {currentConversation ? (
                <>
                  <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full max-h-full p-2 md:p-4 w-full">
                    <div
                      className="flex flex-col h-full overflow-y-auto overflow-x-hidden mb-2 md:mb-4"
                      ref={messagesContainerRef}
                      onScroll={handleScroll}
                    >
                      <div className="flex flex-col h-full w-full">
                        <div className="grid grid-cols-12 gap-y-2 w-full">
                          {/* Loading indicator */}
                          {isLoadingMore && (
                            <div className="col-span-12 flex justify-center py-2">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                            </div>
                          )}

                          {/* Load more button */}
                          {hasMore && !isLoadingMore && (
                            <div className="col-span-12 flex justify-center py-2">
                              <button
                                onClick={loadMoreMessages}
                                className="text-xs text-indigo-600 hover:text-indigo-800"
                              >
                                Tải thêm tin nhắn cũ hơn
                              </button>
                            </div>
                          )}

                          {/* Date Separator - only show this after system card */}
                          <DateSeparator date="Hôm nay" />

                          {/* Chat Messages */}
                          {messages?.map((msg, index) => (
                            <div
                              key={msg._id || index}
                              className={`col-span-12 ${
                                msg.sender._id === user._id
                                  ? "col-start-6"
                                  : "col-start-1 col-end-9"
                              } break-words`}
                            >
                              <Message
                                content={msg.text}
                                timestamp={msg.createdAt}
                                sender={msg.sender.name}
                                isOutgoing={msg.sender._id === user._id}
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

                          {/* Debug indicator - can be removed later */}
                          <div className="col-span-12 text-center text-xs text-gray-400 py-1">
                            {isInitialLoad ? "Loading conversation..." : ""}
                          </div>

                          {/* Scroll to this element - make sure it's always at the end */}
                          <div ref={scrollEnd} className="col-span-12 h-1" />
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
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-2xl">
                  <div className="text-gray-500 text-center p-8">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <h3 className="text-xl font-medium mb-1">Không có cuộc trò chuyện nào được chọn</h3>
                    <p>Vui lòng chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin</p>
                  </div>
                </div>
              )}
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
