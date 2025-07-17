"use client";

import { useState } from "react";
import { useChatContext } from "../contexts/ChatContext";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [isExpanded, setIsExpanded] = useState(false);
  const { clearChat } = useChatContext();

  const menuItems = [
    {
      id: "chat",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      label: "New Chat",
      action: clearChat,
    },
    {
      id: "history",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "History",
      action: () => {},
    },
    {
      id: "settings",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: "Settings",
      action: () => {},
    },
  ];

  const handleClick = (item) => {
    setActiveTab(item.id);
    if (item.action) {
      item.action();
    }
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${isExpanded ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out`}>
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
          <button
            key={item.id}
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
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 