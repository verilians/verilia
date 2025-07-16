const ChatHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-semibold text-gray-900">Bible Counsellor</h1>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          v3.2
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-500">Online</span>
      </div>
    </div>
  );
};

export default ChatHeader; 