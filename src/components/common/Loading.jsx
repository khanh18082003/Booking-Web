const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-bounce rounded-full bg-blue-500"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-blue-500 delay-150"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-blue-500 delay-300"></div>
      </div>
      <p className="ml-4 text-lg font-medium text-gray-700">Loading...</p>
    </div>
  );
};

export default Loading;
