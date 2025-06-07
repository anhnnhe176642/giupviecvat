import { AuthContext } from "./AuthConext";
import { ChatContext } from "./ChatConext";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState({});
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { socket, axios, user } = useContext(AuthContext);

  const getConversations = async () => {
    try {
      const response = await axios.get("/conversations");
      if (response.data.success) {
        setConversations(response.data.conversations);
        setUnseenMessages(response.data.unseenMessages);
      } else {
        toast.error(response.data.message || "Failed to fetch conversations.");
        console.error("Failed to fetch conversations:", response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while fetching conversations.");
      console.error("Error fetching conversations:", error);
    }
  };
  
  // Function to fetch messages for a specific conversation
  const getMessages = async (conversationId, newPage = 1, append = false) => {
    try {
      setIsLoadingMore(newPage > 1);
      const response = await axios.get(`/messages/${conversationId}?page=${newPage}&limit=20`); // Increased limit for better UX
      
      if (response.data.success) {
        // Messages come newest first from API, we need to reverse for display
        const receivedMessages = [...response.data.messages];
        
        if (append) {
          // When loading more messages, add older messages at the beginning
          setMessages(prevMessages => [...receivedMessages.reverse(), ...prevMessages]);
        } else {
          // For initial load, just reverse to show oldest first
          setMessages(receivedMessages.reverse());
        }
        
        // Update pagination info if provided
        if (response.data.pagination) {
          setPage(response.data.pagination.page);
          setHasMore(response.data.pagination.hasMore);
        } else {
          setHasMore(false);
        }
      } else {
        toast.error(response.data.message || "Failed to fetch messages.");
        console.error("Failed to fetch messages:", response.data.message);
      }
      
      setIsLoadingMore(false);
    } catch (error) {
      setIsLoadingMore(false);
      toast.error("An error occurred while fetching messages.");
      console.error("Error fetching messages:", error);
    }
  };
  
  // Function to load more (older) messages when scrolling up
  const loadMoreMessages = async () => {
    if (!currentConversation || !hasMore || isLoadingMore) return;
    
    const nextPage = page + 1;
    await getMessages(currentConversation._id, nextPage, true);
  };

  // Function to send a new message
  const sendMessage = async (conversationId, text, image = null) => {
    try {
      const response = await axios.post(`/messages/send/${conversationId}`, {
        text,
        image,
      });
      if (response.data.success) {
        // Add new message to the end (newest at bottom)
        setMessages(prevMessages => [...prevMessages, response.data.message]);
        
        // Also update the conversation list to show this is the most recent conversation
        getConversations();
      } else {
        toast.error(response.data.message || "Failed to send message.");
        console.error("Failed to send message:", response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while sending the message.");
      console.error("Error sending message:", error);
    }
  };

  // Function to subscribe to new messages (regardless of current conversation)
  const subscribeToNewMessages = () => {
    if (!socket) return;
    
    // Remove any existing global message listeners
    socket.off("newMessage");
    
    // Add new listener for all messages
    socket.on("newMessage", (newMessageData) => {
      console.log("Received new message:", newMessageData);
      
      try {
        // Convert IDs to strings for reliable comparison
        const msgConversationId = newMessageData.conversation?.toString();
        const currentConvId = currentConversation?._id?.toString();
        
        // Check if message belongs to current conversation
        if (currentConversation && msgConversationId === currentConvId) {
          // Mark as seen if we're in the conversation
          newMessageData.seen = true;
          setMessages(prevMessages => [...prevMessages, newMessageData]);
          
          // Let server know we've seen it
          axios.put(`/messages/mark-as-read/${newMessageData._id}`).catch(err => {
            console.error("Error marking message as read:", err);
          });
        } else {
          // Update unread count for other conversations
          setUnseenMessages(prevUnseenMessages => {
            const updatedCounts = {...prevUnseenMessages};
            if (msgConversationId) {
              updatedCounts[msgConversationId] = (updatedCounts[msgConversationId] || 0) + 1;
            }
            return updatedCounts;
          });
          
          // Update the conversations list to show the new message
          getConversations();
        }
      } catch (error) {
        console.error("Error processing new message:", error);
      }
    });
  };

  // Replace subscribeToConversation with our new function
  const subscribeToConversation = subscribeToNewMessages;

  // Function to unsubscribe from a conversation
  const unsubscribeFromConversation = () => {
    if (!socket) return;
    socket.off("newMessage");
  };

  // Function to mark all messages in a conversation as read
  const markConversationAsRead = async (conversationId) => {
    if (!conversationId) return;
    
    try {
      await axios.put(`/conversations/${conversationId}/read`);
      
      // Update local state to show messages as read
      setUnseenMessages(prev => ({
        ...prev,
        [conversationId]: 0
      }));
      
      // Also update conversations list to reflect read status
      const updatedConversations = conversations.map(conv => {
        if (conv._id === conversationId && conv.lastMessagePreview) {
          return {
            ...conv,
            lastMessagePreview: {
              ...conv.lastMessagePreview,
              seen: true
            }
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
    } catch (error) {
      console.error("Error marking conversation as read:", error);
    }
  };

  useEffect(() => {
    if (socket) {
      subscribeToNewMessages();
      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket, currentConversation]); // Add currentConversation as dependency

  useEffect(() => {
    if (currentConversation) {
      // Reset pagination when changing conversations
      setPage(1);
      setHasMore(true);
      
      // Fetch messages for the new conversation
      getMessages(currentConversation._id, 1, false);
      
      // Mark this conversation as read when opened
      if (unseenMessages[currentConversation._id] > 0) {
        markConversationAsRead(currentConversation._id);
      }
    }
  }, [currentConversation]);

  // Add these functions to the context value
  const chatContextValue = {
    messages,
    setMessages,
    currentConversation,
    setCurrentConversation,
    conversations,
    setConversations,
    unseenMessages,
    setUnseenMessages,
    getConversations,
    getMessages,
    sendMessage,
    subscribeToConversation,
    unsubscribeFromConversation,
    loadMoreMessages,
    hasMore,
    isLoadingMore,
    markConversationAsRead,
  };

  return (
    <ChatContext.Provider value={chatContextValue}>
      {children}
    </ChatContext.Provider>
  );
};
