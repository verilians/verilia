"use client";

import { useEffect, useRef } from 'react';
import { useChatHistoryContext } from '../contexts/ChatHistoryContext';
import ChatBubble from './ChatBubble';

const ChatHistoryPanel = () => {
  const { messages, isLoading, error } = useChatHistoryContext();
  const messagesEndRef = useRef(null);

  const getLatestAIMessageId = () => {
    const aiMessages = messages.filter(msg => msg.sender === 'bot');
    return aiMessages.length > 0 ? aiMessages[aiMessages.length - 1].id : null;
  };

  const latestAIMessageId = getLatestAIMessageId();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-center items-center h-32">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-center items-center h-32">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Messages</h3>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
        {messages.map((message) => {
          const isLatestAIMessage = message.id === latestAIMessageId && message.sender === 'bot';
          
          return (
            <ChatBubble 
              key={message.id} 
              message={{
                id: message.id,
                type: message.sender === 'user' ? 'user' : 'bot',
                content: message.message,
                timestamp: new Date(message.created_at)
              }}
              isLatestAIMessage={isLatestAIMessage}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatHistoryPanel; 