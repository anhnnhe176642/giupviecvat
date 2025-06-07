import React, { useState } from "react";
import { Menu, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobDetailModal from "../components/JobDetailModal";
import toast from "react-hot-toast"; // Add this import
import axios from "axios";

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
    setMessages,
    loadMoreMessages,
    hasMore,
    isLoadingMore,
    sendMessage,
  } = useContext(ChatContext);

  const { onlineUsers, user, socket } = useContext(AuthContext);
  const messagesContainerRef = useRef(null);
  const scrollEnd = useRef();
  const [message, setMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [msg, setMsg] = useState({});
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [tempJobDetails, setTempJobDetails] = useState({
    title: "",
    price: "",
    time: "",
    date: "",
    timeSlot: "",
    location: "",
    description: "",
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

  const handleSendMessage = async (e, imageData = null) => {
    e.preventDefault();

    // Don't send if there's nothing to send
    if (!message.trim() && !imageData) return;

    try {
      setSendingMessage(true);
      await sendMessage(currentConversation._id, message, imageData);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Function to send job details as a message
  const handleSendJobDetails = async (jobToSend = null) => {
    if (!currentConversation || !jobToSend) return;

    try {
      setSendingMessage(true);

      // Use the job details passed or the current job details state
      const jobToShare = jobToSend || msg.jobDetails;

      // Generate a descriptive message about the job
      const jobMessage = `📋 Công việc: ${jobToShare.title}`;

      await sendMessage(
        currentConversation._id,
        jobMessage,
        null, // No image
        jobToShare // Pass job details
      );
    } catch (error) {
      console.error("Error sending job details:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Function to toggle job form
  const toggleJobForm = () => {
    setShowJobForm(!showJobForm);
    // Pre-fill with existing job details as template if showing form
    if (!showJobForm) {
      setTempJobDetails({
        title: "",
        price: "",
        time: "",
        date: new Date().toISOString().split("T")[0], // Today's date
        timeSlot: "",
        location: "",
        description: "",
      });
    }
  };

  // Function to handle job form submission
  const handleJobFormSubmit = async (e) => {
    e.preventDefault();

    if (!currentConversation) {
      toast.error("Please select a conversation first");
      return;
    }

    if (!tempJobDetails.title) {
      toast.error("Job title is required");
      return;
    }

    try {
      setSendingMessage(true);

      // Create job object with required fields
      const jobToSend = {
        ...tempJobDetails,
        // Add any required fields that might be missing
        skills: tempJobDetails.skills || ["Không yêu cầu"],
        clientName: user?.name || "Unknown",
        clientImage: user?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg",
      };

      await sendMessage(
        currentConversation._id,
        null, // No text message
        null, // No image
        jobToSend // Pass job details
      );

      // Reset form and hide it
      setShowJobForm(false);
      setTempJobDetails({
        title: "",
        price: "",
        time: "",
        date: "",
        timeSlot: "",
        location: "",
        description: "",
      });
      
      // Trigger scroll to bottom after sending job
      setTimeout(() => {
        scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error sending job details:", error);
      toast.error("Failed to send job details");
    } finally {
      setSendingMessage(false);
    }
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

  // Add a function to update job status
  const updateJobStatus = async (jobId, status) => {
    if (!jobId) return;
    
    try {
      const response = await axios.put(`/jobs/${jobId}/status`, { status });
      
      if (response.data.success) {
        // Update job status in the UI
        setMessages(prevMessages => 
          prevMessages.map(message => {
            if (message.messageType === 'job' && message.jobDetails && message.jobDetails._id === jobId) {
              return {
                ...message,
                jobDetails: {
                  ...message.jobDetails,
                  status: status
                }
              };
            }
            return message;
          })
        );
        
        // Also update the job details modal if it's currently showing this job
        if (isJobModalOpen && msg.jobDetails && msg.jobDetails._id === jobId) {
          setMsg(prev => ({
            ...prev,
            jobDetails: {
              ...prev.jobDetails,
              status: status
            }
          }));
        }
        
        // Notify the client using socket that we updated the job status
        // This is for debugging purposes, actual updates are sent from server
        if (socket) {
          socket.emit("jobStatusUpdateClient", {
            jobId,
            status,
            conversationId: currentConversation?._id
          });
        }
        
        toast.success(
          status === 'accepted' 
            ? 'Bạn đã chấp nhận công việc này!' 
            : status === 'rejected'
              ? 'Bạn đã từ chối công việc này!'
              : 'Trạng thái công việc đã được cập nhật!'
        );
      } else {
        toast.error("Không thể cập nhật trạng thái công việc");
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái");
    }
  };

  const handleAcceptJob = (jobId) => {
    updateJobStatus(jobId, 'accepted');
    setIsJobModalOpen(false);
  };

  const handleDeclineJob = (jobId) => {
    updateJobStatus(jobId, 'rejected');
    setIsJobModalOpen(false);
  };

  // Add a function to cancel a job
  const handleCancelJob = (jobId) => {
    updateJobStatus(jobId, 'cancelled');
    setIsJobModalOpen(false);
    toast.success('Công việc đã được huỷ!');
  };

  // Function to format time
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();

    // If same day, show time only
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    // If this year, show month and day
    else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
    // Otherwise show year too
    else {
      return date.toLocaleDateString([], { month: "short", day: "numeric", year: "2-digit" });
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
                              {msg.messageType === 'job' ? (
                                <JobAssignmentMessage
                                  job={msg.jobDetails}
                                  onViewDetails={() => {
                                    setMsg(msg);
                                    setIsJobModalOpen(true);
                                  }}
                                  timestamp={formatMessageTime(msg.createdAt)}
                                  sender={msg.sender.name}
                                  isOutgoing={msg.sender._id === user._id}
                                  onAccept={() => handleAcceptJob(msg.jobDetails._id)}
                                  onDecline={() => handleDeclineJob(msg.jobDetails._id)}
                                  onCancel={() => handleCancelJob(msg.jobDetails._id)}
                                />
                              ) : (
                                <Message
                                  content={msg.text}
                                  timestamp={formatMessageTime(msg.createdAt)}
                                  sender={msg.sender.name}
                                  isOutgoing={msg.sender._id === user._id}
                                  image={msg.image}
                                />
                              )}
                            </div>
                          ))}

                          {/* Debug indicator - can be removed later */}
                          <div className="col-span-12 text-center text-xs text-gray-400 py-1">
                            {isInitialLoad ? "Loading conversation..." : ""}
                          </div>

                          {/* Scroll to this element - make sure it's always at the end */}
                          <div ref={scrollEnd} className="col-span-12 h-1" />
                        </div>
                      </div>
                    </div>

                    {/* Add job form */}
                    {showJobForm && (
                      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium text-lg text-gray-800">Tạo thông tin công việc</h3>
                          <button 
                            onClick={() => setShowJobForm(false)}
                            className="text-gray-400 hover:text-gray-600"
                            aria-label="Close form"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        
                        <form onSubmit={handleJobFormSubmit}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Tiêu đề công việc *</label>
                              <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={tempJobDetails.title}
                                onChange={(e) => setTempJobDetails({...tempJobDetails, title: e.target.value})}
                                placeholder="Nhập tiêu đề công việc"
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Giá tiền</label>
                              <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={tempJobDetails.price}
                                onChange={(e) => setTempJobDetails({...tempJobDetails, price: e.target.value})}
                                placeholder="VD: 300k"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Thời gian làm việc</label>
                              <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={tempJobDetails.time}
                                onChange={(e) => setTempJobDetails({...tempJobDetails, time: e.target.value})}
                                placeholder="VD: 2 giờ"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Ngày</label>
                              <input
                                type="date"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={tempJobDetails.date}
                                onChange={(e) => setTempJobDetails({...tempJobDetails, date: e.target.value})}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Khung giờ</label>
                              <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={tempJobDetails.timeSlot}
                                onChange={(e) => setTempJobDetails({...tempJobDetails, timeSlot: e.target.value})}
                                placeholder="VD: 8:00 - 10:00"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Kỹ năng yêu cầu</label>
                              <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="VD: Cẩn thận, Tỉ mỉ (phân cách bằng dấu phẩy)"
                                onChange={(e) => {
                                  const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
                                  setTempJobDetails({...tempJobDetails, skills: skillsArray});
                                }}
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-gray-700 mb-1">Địa điểm</label>
                              <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={tempJobDetails.location}
                                onChange={(e) => setTempJobDetails({...tempJobDetails, location: e.target.value})}
                                placeholder="Nhập địa chỉ công việc"
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                              <textarea
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                rows="3"
                                value={tempJobDetails.description}
                                onChange={(e) => setTempJobDetails({...tempJobDetails, description: e.target.value})}
                                placeholder="Mô tả chi tiết công việc"
                              ></textarea>
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-2 mt-4">
                            <button
                              type="button"
                              onClick={() => setShowJobForm(false)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                              Hủy
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              disabled={sendingMessage}
                            >
                              {sendingMessage ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Đang gửi...
                                </>
                              ) : (
                                'Gửi công việc'
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Message input */}
                    <ChatInput
                      message={message}
                      setMessage={setMessage}
                      onSendMessage={handleSendMessage}
                      isLoading={sendingMessage}
                      onToggleJobForm={toggleJobForm}
                      showJobForm={showJobForm}
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
            job={msg.jobDetails}
            onAccept={() => msg.jobDetails && handleAcceptJob(msg.jobDetails._id)}
            onDecline={() => msg.jobDetails && handleDeclineJob(msg.jobDetails._id)}
            onCancel={() => msg.jobDetails && handleCancelJob(msg.jobDetails._id)}
            isSender={msg?.sender?._id === user?._id}
          />
        </div>
      </div>
    </>
  );
};

export default ChatPage;
