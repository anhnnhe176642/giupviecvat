import React, { useState } from "react";
import { Menu, ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import JobDetailModal from "../components/JobDetailModal";
import toast from "react-hot-toast"; // Add this import
import axios from "axios";

// Import chat components
import Message from "../components/chat/Message";
import SystemCard from "../components/chat/SystemCard";
import DateSeparator from "../components/chat/DateSeparator";
import JobAssignmentMessage from "../components/chat/JobAssignmentMessage";
import ChatInput from "../components/chat/ChatInput";
import JobForm from "../components/chat/JobForm"; // Add JobForm import
import Header from "../layouts/Header";
import { useContext } from "react";
import { ChatContext } from "../conext/ChatContext";
import { AuthContext } from "../conext/AuthContext";
import { useEffect } from "react";
import { useRef } from "react";

const ChatPage = () => {
  const {
    getConversations,
    conversations,
    currentConversation,
    setCurrentConversation,
    unseenMessages,
    messages,
    setMessages,
    loadMoreMessages,
    hasMore,
    isLoadingConversations,
    setConversations,
    isLoadingMore,
    sendMessage,
  } = useContext(ChatContext);

  const { onlineUsers, user } = useContext(AuthContext);
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
  }, []);

  useEffect(() => {
    setCurrentConversation(null);
    setMessages([]);
    setConversations([]);
  }, [user]);

  const navigate = useNavigate();
  const params = useParams();
  const conversationId = params.id;
  
  // Use useEffect to set the current conversation when the ID changes or conversations load
  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const foundConversation = conversations.find(c => c._id === conversationId);
      if (foundConversation) {
        setCurrentConversation(foundConversation);
      }
    }
  }, [conversationId, conversations, setCurrentConversation]);
  
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

  // Function to toggle job form
  const toggleJobForm = () => {
    setShowJobForm(!showJobForm);
    // Pre-fill with existing job details as template if showing form
    const postTask = currentConversation?.postTask || {};
    if (!showJobForm) {
      setTempJobDetails({
        title: postTask.title || "",
        price: postTask.price || "",
        time: "2 giờ", // Default time
        date: new Date().toISOString().split("T")[0], // Today's date
        timeSlot: postTask.time || "",
        location: postTask.location || "",
        description: postTask.description || "",
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
      // Store current scroll height and ref before new messages are added
      const container = messagesContainerRef.current;
      const scrollHeight = container.scrollHeight;

      // After new messages are loaded and rendered, adjust the scroll position
      return () => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - scrollHeight;
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
      const response = await axios.put(`/jobs/${jobId}/status`, { status, postTaskId: currentConversation.postTask._id, acceptTo: user._id });
      
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
        

        
        toast.success(
          status === 'accepted' 
            ? 'Bạn đã chấp nhận công việc này!' 
            : status === 'rejected'
              ? 'Bạn đã từ chối công việc này!'
              : 'Bạn đã huỷ công việc này!'
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
              {/* Current Task Details - Always show panel */}
              <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-medium text-sm text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  Thông tin công việc
                </h3>
                <div className="space-y-2 text-xs">
                  <p className="flex items-center justify-between">
                    <span className="font-semibold text-gray-600">Tiêu đề:</span> 
                    <span className="text-gray-800 font-medium max-w-35 truncate">{currentConversation?.postTask?.title || "Không có tiêu đề"}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="font-semibold text-gray-600">Ngân sách:</span> 
                    <span className="text-gray-800 font-medium">{currentConversation?.postTask?.price ? `${currentConversation.postTask.price.toLocaleString()}đ` : "Chưa có giá"}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="font-semibold text-gray-600">Địa điểm:</span> 
                    <span className="text-gray-800 font-medium max-w-35 truncate">{currentConversation?.postTask?.location || "Không có địa điểm"}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="font-semibold text-gray-600">Trạng thái:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      !currentConversation?.postTask ? 'bg-gray-100 text-gray-800' :
                      currentConversation.postTask.status === 'open' ? 'bg-blue-100 text-blue-800' :
                      currentConversation.postTask.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                      currentConversation.postTask.status === 'completed' ? 'bg-green-100 text-green-800' :
                      currentConversation.postTask.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      currentConversation.postTask.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {!currentConversation?.postTask ? 'Không có thông tin' :
                       currentConversation.postTask.status === 'open' ? 'Đang mở' :
                       currentConversation.postTask.status === 'assigned' ? 'Đã giao' :
                       currentConversation.postTask.status === 'completed' ? 'Hoàn thành' :
                       currentConversation.postTask.status === 'cancelled' ? 'Đã huỷ' :
                       currentConversation.postTask.status === 'closed' ? 'Đã đóng' : 
                       'Đang xử lý'}
                    </span>
                  </p>
                  <p className="flex items-center justify-between border-t border-gray-100 pt-1 mt-1">
                    <span className="font-semibold text-gray-600">Người đăng:</span>
                    <span className={`flex items-center ${currentConversation?.postTask?.poster === user?._id ? 'text-indigo-600 font-medium' : 'text-gray-700'}`}>
                      {!currentConversation?.postTask ? 'Không xác định' :
                       currentConversation.postTask.poster === user?._id ? (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
                          Bạn
                        </>
                      ) : currentConversation.participants?.find(participant => participant._id !== user?._id)?.name || 'Người khác'}
                    </span>
                  </p>
                </div>
              </div>
              
              

              {/* Active Conversations */}
              {isLoadingConversations && conversations?.length == 0 ? (
                <div className="flex flex-col mt-8">
                  <div className="flex flex-row items-center justify-between text-xs">
                    <span className="font-bold">Đang tải cuộc trò chuyện...</span>
                  </div>
                  <div className="flex justify-center items-center h-72 mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  </div>
                </div>
              ) :(conversations) ? <div className="flex flex-col mt-8">
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
                        navigate(`/chat/conversation/${conversation._id}`);
                      }}
                    >
                      <div
                        className={`flex items-center justify-center h-8 w-8 ${
                          conversation._id === currentConversation?._id ? "bg-indigo-200" : "bg-gray-200"
                        } rounded-full`}
                      >
                        {conversation.name?.charAt(0) || <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>}
                      </div>
                      <div className="flex-1 ml-2">
                        <div className="flex justify-between items-center max-w-40 truncate">
                          <span className={`text-sm font-semibold ${unseenMessages[conversation._id] > 0 ? 'font-bold text-black' : 'font-medium text-gray-700'}`}>
                            {conversation.postTask?.title || "Unknown"}
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
              </div> : (
                <div className="flex items-center justify-center h-72">
                  <p className="text-gray-500">Không có cuộc trò chuyện nào</p>
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className="flex flex-col flex-auto h-[82vh] p-3 md:p-6 max-w-full">
              {/* Mobile menu button */}
              <div className="flex items-center mb-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 mr-2"
                >
                  <Menu size={20} />
                </button>
                <div className="flex items-center">
                  {currentConversation && (
                    <>
                      <img
                        src={currentConversation.participants?.find(participant => participant._id !== user?._id)?.profilePicture || "https://randomuser.me/api/portraits/lego/1.jpg"}
                        alt="Contact"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="ml-2">
                        <h3 className="font-medium">
                          {currentConversation.participants?.find(participant => participant._id !== user?._id)?.name || "Unknown User"}
                        </h3>
                        <p className="text-xs text-green-600">
                          {onlineUsers?.includes(currentConversation.participants?.find(participant => participant._id !== user?._id)?._id) 
                            ? "Online" 
                            : "Offline"}
                        </p>
                      </div>
                    </>
                  )}
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
                              className={`col-span-12 whitespace-pre-wrap ${
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
                                  profilePicture={msg.sender.profilePicture}
                                />
                              ) : (
                                <Message
                                  content={msg.text}
                                  timestamp={formatMessageTime(msg.createdAt)}
                                  sender={msg.sender.name}
                                  isOutgoing={msg.sender._id === user._id}
                                  image={msg.image}
                                  profilePicture={msg.sender.profilePicture}
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

                    {/* Replace job form with new component */}
                    {showJobForm && (
                      <JobForm 
                        tempJobDetails={tempJobDetails}
                        setTempJobDetails={setTempJobDetails}
                        onSubmit={handleJobFormSubmit}
                        onCancel={() => setShowJobForm(false)}
                        sendingMessage={sendingMessage}
                      />
                    )}

                    {/* Message input */}
                    <ChatInput
                      message={message}
                      setMessage={setMessage}
                      onSendMessage={handleSendMessage}
                      isLoading={sendingMessage}
                      onToggleJobForm={toggleJobForm}
                      showJobForm={showJobForm}
                      isShow={ currentConversation.postTask.poster == user._id ? currentConversation.postTask.status == 'open' ? true: false : false }
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
