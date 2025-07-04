const TaskManagement = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý công việc
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Danh sách công việc
              </h3>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Chức năng quản lý công việc sẽ được phát triển tại đây. mà để chi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
