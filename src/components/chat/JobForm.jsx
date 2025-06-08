import React from 'react';

const JobForm = ({ 
  tempJobDetails, 
  setTempJobDetails, 
  onSubmit, 
  onCancel, 
  sendingMessage 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-lg text-gray-800">Tạo thông tin công việc</h3>
        <button 
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close form"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={onSubmit}>
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
            onClick={onCancel}
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
  );
};

export default JobForm;
