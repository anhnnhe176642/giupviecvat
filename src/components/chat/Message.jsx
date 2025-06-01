import React from 'react';

const Message = ({ content, timestamp, sender, isOutgoing }) => {
  return (
    <div className={`col-start-${isOutgoing ? '6' : '1'} col-end-${isOutgoing ? '13' : '8'} p-3 rounded-lg`}>
      <div className={`flex items-center ${isOutgoing ? 'justify-start flex-row-reverse' : 'flex-row'}`}>
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          {sender}
        </div>
        <div className={`relative ${isOutgoing ? 'mr-3' : 'ml-3'} text-sm ${isOutgoing ? 'bg-indigo-100' : 'bg-white'} py-2 px-4 shadow rounded-xl`}>
          <div>{content}</div>
          <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">{timestamp}</div>
        </div>
      </div>
    </div>
  );
};

export default Message;
