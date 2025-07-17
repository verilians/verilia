"use client";

import { useEffect, useRef } from "react";
import AnimatedText from "./AnimatedText";

const ChatBubble = ({ message, isLatestAIMessage = false }) => {
  const isBot = message.type === "bot";

  return (
    <div
      className={`flex ${isBot ? "justify-start" : "justify-end"} transition-all duration-300 ease-out`}
    >
      <div
        className={`max-w-[85vw] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 transition-all duration-200 border-b-2 border-gray-200 dark:border-gray-700 ${
          isBot
            ? "text-gray-800 dark:text-gray-200"
            : "text-purple-600 dark:text-purple-400"
        }`}
      >
        <div className="flex items-start space-x-2">
          {isBot && (
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            {isBot ? (
              <AnimatedText
                text={message.content}
                speed={30}
                shouldAnimate={isLatestAIMessage}
                className="text-sm leading-relaxed break-words"
              />
            ) : (
              <p className="text-sm leading-relaxed break-words">{message.content}</p>
            )}
            <p className={`text-xs mt-1 sm:mt-2 ${isBot ? "text-gray-500 dark:text-gray-400" : "text-purple-400 dark:text-purple-300"}`}>
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          
          {!isBot && (
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble; 