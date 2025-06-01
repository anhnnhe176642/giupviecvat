import React from 'react';

const DateSeparator = ({ date }) => {
  return (
    <div className="col-start-1 col-end-13 p-3 flex justify-center">
      <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
        {date}
      </span>
    </div>
  );
};

export default DateSeparator;
