import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Send, Calendar, Image, X } from "lucide-react";

const ChatInput = ({
  message,
  setMessage,
  onSendMessage,
  isLoading,
  onToggleJobForm,
  showJobForm,
  isShow
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef();
  const textInputRef = useRef(null); // New ref for text input

  // Auto focus the input when component mounts
  useEffect(() => {
    textInputRef.current?.focus();
    adjustTextareaHeight();
  }, []);

  // Add this useEffect to focus the input when isLoading changes from true to false
  useEffect(() => {
    if (!isLoading && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isLoading]);
  
  // Auto-adjust height when message content changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);
  
  // Function to adjust the textarea height based on content
  const adjustTextareaHeight = () => {
    const textarea = textInputRef.current;
    if (!textarea) return;
    
    // Reset height to auto so scrollHeight measurement is accurate
    textarea.style.height = 'auto';
    
    // Set the height based on content
    const newHeight = Math.min(textarea.scrollHeight, 120);
    textarea.style.height = `${newHeight}px`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);
  };

  const clearImagePreview = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageFile(null);
    fileInputRef.current.value = "";
  };

  const handleKeyDown = (e) => {
    // Add new line when Shift+Enter is pressed
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      setMessage(prev => prev + '\n');
      
      // Wait for state update, then adjust height
      setTimeout(adjustTextareaHeight, 0);
    } 
    // Submit the form when Enter (without Shift) is pressed
    else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() && !imageFile) return;

    // Convert image file to base64 if present
    let imageData = null;
    if (imageFile) {
      imageData = await convertFileToBase64(imageFile);
    }

    // Call the parent handler with message text and image data
    await onSendMessage(e, imageData);

    // Clear the image preview after sending
    if (imagePreview) {
      clearImagePreview();
    }
    
    // More reliable focus approach
    setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 10);
  };

  // Function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-white rounded-lg py-2"
    >
      {/* Image preview */}
      {imagePreview && (
        <div className="px-4 py-2 relative">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Upload preview"
              className="h-32 rounded-lg object-contain border border-gray-200"
            />
            <button
              type="button"
              onClick={clearImagePreview}
              className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-center px-3">
        {/* Job button */}
        { isShow && (<button
          type="button"
          onClick={onToggleJobForm}
          className={`p-2 rounded-full ${
            showJobForm
              ? "bg-indigo-100 text-indigo-600"
              : "hover:bg-gray-200"
          } mr-1`}
          title="Gửi công việc"
        >
          <Calendar size={20} />
        </button>)}

        {/* File input (hidden) */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Attachment button */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="p-2 rounded-full hover:bg-gray-200"
          disabled={isLoading || isUploading}
        >
          <Paperclip size={20} className="text-gray-600" />
        </button>

        {/* Replace textarea with auto-expanding version */}
        <textarea
          ref={textInputRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          className="flex-grow px-4 py-2 bg-transparent focus:outline-none resize-none overflow-y-auto"
          disabled={isLoading || isUploading}
          rows={1}
          style={{ minHeight: '40px', maxHeight: '120px' }}
        />

        {/* Send button - updated to enable when there's an image selected */}
        <button
          type="submit"
          className={`p-2 rounded-full ${
            (!message.trim() && !imagePreview)
              ? "bg-gray-400"
              : "bg-indigo-600 hover:bg-indigo-700"
          } text-white`}
          disabled={(!message.trim() && !imagePreview) || isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
