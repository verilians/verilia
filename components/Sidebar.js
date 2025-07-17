"use client";

import { useState } from "react";
import { useChatContext } from "../contexts/ChatContext";
import { useUser } from "../contexts/UserContext";
import { useChatSession } from "../contexts/ChatSessionContext";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isChatsExpanded, setIsChatsExpanded] = useState(false);
  const { clearChat } = useChatContext();
  const { user } = useUser();
  const { 
    chats, 
    currentChatId, 
    setCurrentChatId, 
    createChat, 
    deleteChat,
    isLoading,
    chatUpdateTrigger
  } = useChatSession();

  const menuItems = [
    {
      id: "chat",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      label: "New Chat",
      action: async () => {
        clearChat();
        if (user) {
          await handleNewChat();
        }
      },
    },
    {
      id: "settings",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 00-1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: "Settings",
      action: () => {},
    },
    // Only show Chats tab for signed-in users
    ...(user ? [{
      id: "chats",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      label: "Chats",
      action: () => {},
    }] : []),
  ];

  const handleClick = (item) => {
    setActiveTab(item.id);
    if (item.id === "chats") {
      setIsChatsExpanded(!isChatsExpanded);
    } else {
      setIsChatsExpanded(false);
    }
    if (item.action) {
      item.action();
    }
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNewChat = async () => {
    if (!user) return;
    
    try {
      await createChat('New Chat');
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const handleChatSelect = (chatId) => {
    setCurrentChatId(chatId);
    setIsChatsExpanded(false);
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      await deleteChat(chatId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200 md:hidden"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsExpanded(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Mobile Menu Items */}
            <div className="p-4 space-y-2">
              {menuItems.map((item) => (
                <div key={item.id} className="w-full">
                  <button
                    onClick={() => handleClick(item)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-gray-600">{item.icon}</div>
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </button>
                  
                  {/* Mobile Chat List for Chats tab */}
                  {item.id === "chats" && isChatsExpanded && user && (
                    <div className="mt-2 ml-4 border-l border-gray-200 pl-4">
                      {/* Chat List */}
                      <div className="space-y-1">
                        {isLoading ? (
                          <div className="flex items-center space-x-2 py-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                        ) : chats.length === 0 ? (
                          <div className="text-center py-4">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </div>
                            <p className="text-xs text-gray-500">No chats yet</p>
                          </div>
                        ) : (
                          chats.map((chat) => (
                            <div
                              key={chat.id}
                              onClick={() => handleChatSelect(chat.id)}
                              className={`px-3 py-2 cursor-pointer transition-colors hover:bg-gray-50 rounded-lg ${
                                currentChatId === chat.id ? 'bg-purple-50 border-l-2 border-purple-500' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-xs font-medium text-gray-900 truncate">
                                    {chat.title}
                                  </h3>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(chat.created_at)}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => handleDeleteChat(chat.id, e)}
                                  className="ml-2 p-1 rounded-md hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                                  title="Delete chat"
                                >
                                  <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`${isExpanded ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out hidden md:flex`}>
        {/* Toggle Button */}
        <div className="flex justify-end p-2">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
            title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isExpanded ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>
        </div>

      {/* Menu Items */}
      <div className="flex flex-col items-center lg:items-start py-4 space-y-4 flex-1">
        {menuItems.map((item) => (
          <div key={item.id} className="w-full">
            <button
              onClick={() => handleClick(item)}
              className={`p-3 rounded-lg transition-all duration-200 group relative w-12 ${isExpanded ? 'w-full flex items-center px-4 py-3' : ''} ${
                activeTab === item.id
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-500 hover:text-purple-600 hover:bg-purple-50"
              }`}
              title={item.label}
            >
              {item.icon}
              {isExpanded && (
                <span className="ml-3 text-sm font-medium">
                  {item.label}
                </span>
              )}
              {!isExpanded && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {item.label}
                </span>
              )}
            </button>
            
            {/* Chat List for Chats tab */}
            {item.id === "chats" && isExpanded && isChatsExpanded && user && (
              <div className="mt-2 ml-4 border-l border-gray-200 pl-4">
                {/* Chat List */}
                <div className="space-y-1">
                  {isLoading ? (
                    <div className="flex items-center space-x-2 py-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  ) : chats.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500">No chats yet</p>
                    </div>
                  ) : (
                    chats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleChatSelect(chat.id)}
                        className={`px-3 py-2 cursor-pointer transition-colors hover:bg-gray-50 rounded-lg ${
                          currentChatId === chat.id ? 'bg-purple-50 border-l-2 border-purple-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-medium text-gray-900 truncate">
                              {chat.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(chat.created_at)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteChat(chat.id, e)}
                            className="ml-2 p-1 rounded-md hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete chat"
                          >
                            <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Sidebar; 