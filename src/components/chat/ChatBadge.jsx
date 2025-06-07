import React from 'react';

/**
 * A reusable badge component for displaying unread message counts
 */
const ChatBadge = ({ count }) => {
  if (!count || count <= 0) return null;
  
  return (
    <div className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium text-white bg-indigo-500 rounded-full leading-none">
      {count > 99 ? '99+' : count}
    </div>
  );
};

export default ChatBadge;
