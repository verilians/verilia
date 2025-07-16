"use client";

import { useEffect, useRef, useState } from "react";
import AnimatedText from "./AnimatedText";

const ChatBubble = ({ message }) => {
  const bubbleRef = useRef(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (bubbleRef.current) {
      bubbleRef.current.style.opacity = "0";
      bubbleRef.current.style.transform = "translateY(10px)";
      
      setTimeout(() => {
        if (bubbleRef.current) {
          bubbleRef.current.style.opacity = "1";
          bubbleRef.current.style.transform = "translateY(0)";
        }
      }, 100);
    }
  }, [message.id]);

  // Reset typing state when message changes
  useEffect(() => {
    setIsTypingComplete(false);
  }, [message.content]);

  const isBot = message.type === "bot";

  return (
    <div
      ref={bubbleRef}
      className={`flex ${isBot ? "justify-start" : "justify-end"} transition-all duration-300 ease-out`}
      style={{ opacity: 0, transform: "translateY(10px)" }}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
          isBot
            ? "bg-white border border-gray-200 text-gray-800"
            : "bg-purple-600 text-white"
        }`}
      >
        <div className="flex items-start space-x-2">
          {isBot && (
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          )}
          
          <div className="flex-1">
            {isBot ? (
              <AnimatedText
                text={message.content}
                speed={25}
                onComplete={() => setIsTypingComplete(true)}
                className="text-sm leading-relaxed"
              />
            ) : (
              <p className="text-sm leading-relaxed">{message.content}</p>
            )}
            <p className={`text-xs mt-2 ${isBot ? "text-gray-500" : "text-purple-200"}`}>
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          
          {!isBot && (
            <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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