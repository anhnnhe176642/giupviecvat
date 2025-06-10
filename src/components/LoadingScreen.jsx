const LoadingScreen = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full bg-gray-50">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-5"></div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">Giupviecvat</h3>
      <p className="text-gray-600">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
