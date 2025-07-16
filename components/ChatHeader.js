import UserBanner from './UserBanner';

const ChatHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between relative">
      {/* Left side - Mobile menu space */}
      <div className="w-12 sm:w-16 flex-shrink-0"></div>
      
      {/* Center - Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2 sm:space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Verilia</h1>
            <p className="text-xs text-gray-500 hidden sm:block">AI Bible Counsellor</p>
          </div>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          v3.2
        </span>
      </div>
      
      {/* Right side - User banner */}
      <div className="flex items-center justify-end">
        <UserBanner />
      </div>
    </div>
  );
};

export default ChatHeader; 