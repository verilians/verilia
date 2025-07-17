"use client";

import { useEffect, useRef } from 'react';
import { useChatContext } from '../contexts/ChatContext';
import ChatBubble from './ChatBubble';

const ChatHistoryPanel = () => {
  const { messages, isLoading } = useChatContext();
  const messagesEndRef = useRef(null);

  const getLatestAIMessageId = () => {
    const aiMessages = messages.filter(msg => msg.type === 'bot');
    return aiMessages.length > 0 ? aiMessages[aiMessages.length - 1].id : null;
  };

  const latestAIMessageId = getLatestAIMessageId();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Create a loading message component
  const LoadingMessage = () => (
    <div className="flex justify-start transition-all duration-300 ease-out">
      <div className="max-w-[85vw] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 transition-all duration-200 border-b-2 border-gray-200 text-gray-800">
        <div className="flex items-start space-x-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <p className="text-xs mt-1 sm:mt-2 text-gray-500">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-center items-center h-32">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages Yet</h3>
            <p className="text-sm text-gray-500">Start a conversation to see your chat history here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto flex justify-center">
      <div className="w-full max-w-4xl px-4 lg:px-8 py-2 space-y-2">
        {messages.map((message, index) => {
          const isLatestAIMessage = message.id === latestAIMessageId && message.type === 'bot';
          
          return (
            <ChatBubble 
              key={`${message.id}-${index}`} 
              message={message}
              isLatestAIMessage={isLatestAIMessage}
            />
          );
        })}
        
        {/* Show loading dots inline when waiting for response */}
        {isLoading && <LoadingMessage />}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatHistoryPanel; 