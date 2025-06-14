import React from 'react';

const Message = ({ content, timestamp, sender, isOutgoing, image, profilePicture }) => {
  return (
    <div className={`col-start-${isOutgoing ? '6' : '1'} col-end-${isOutgoing ? '13' : '8'} p-3 rounded-lg`}>
      <div className={`flex items-center ${isOutgoing ? 'justify-start flex-row-reverse' : 'flex-row'}`}>
        <div className="flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0 overflow-hidden">
          {profilePicture ? (
            <img 
              src={profilePicture} 
              alt={sender}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-indigo-500 text-white">
              {sender?.charAt(0) || '?'}
            </div>
          )}
        </div>
        <div className={`relative ${isOutgoing ? 'mr-3' : 'ml-3'} text-sm ${isOutgoing ? 'bg-indigo-100' : 'bg-white'} py-2 px-4 pb-6 shadow rounded-xl min-w-[80px]`}>
          {/* Only show text content if there is any */}
          {content && <div className="mb-2">{content}</div>}
          
          {/* Show image if provided */}
          {image && (
            <div className="mt-1">
              <img 
                src={image} 
                alt="Message attachment" 
                className="rounded-lg max-w-full max-h-60 object-contain cursor-pointer" 
                onClick={() => window.open(image, '_blank')}
              />
            </div>
          )}
          
          <div className="absolute text-xs bottom-1 right-2 text-gray-500">
            {typeof timestamp === 'string' ? timestamp : new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
