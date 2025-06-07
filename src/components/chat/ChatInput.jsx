import React, { useState, useRef } from "react";
import { Paperclip, Image, X, Send } from "lucide-react";

const ChatInput = ({ message, setMessage, onSendMessage, isLoading }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() && !imageFile) return;

    // Convert image file to base64 if present
    let imageData = null;
    if (imageFile) {
      imageData = await convertFileToBase64(imageFile);
    }

    // Call the parent handler with message text and image data
    onSendMessage(e, imageData);

    // Clear the image preview after sending
    if (imagePreview) {
      clearImagePreview();
    }
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
          className="p-2 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          <Image size={20} />
        </button>

        {/* Text input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-grow px-4 py-2 bg-transparent focus:outline-none"
          disabled={isLoading}
        />

        {/* Send button */}
        <button
          type="submit"
          className={`p-2 rounded-full ${
            (message.trim() || imageFile) && !isLoading
              ? "text-indigo-600 hover:bg-indigo-50"
              : "text-gray-400"
          }`}
          disabled={(!message.trim() && !imageFile) || isLoading}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
