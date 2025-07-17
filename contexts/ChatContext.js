"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your Bible counsellor AI. I'm here to provide guidance and support based on biblical wisdom. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [sessionId, setSessionId] = useState(null);

  // Generate or retrieve session ID for anonymous users
  useEffect(() => {
    let currentSessionId = localStorage.getItem('anonymousSessionId');
    if (!currentSessionId) {
      currentSessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('anonymousSessionId', currentSessionId);
    }
    setSessionId(currentSessionId);
  }, []);

  const sendMessage = useCallback(async (content) => {
    const userMessage = {
      id: Date.now(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        content: data.message,
        timestamp: new Date(data.timestamp),
      };

      setMessages(prev => [...prev, botResponse]);

      // Save anonymous session to database
      if (sessionId) {
        try {
          await fetch('/api/save-anonymous-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId,
              messages: [...messages, userMessage, botResponse],
              timestamp: new Date().toISOString()
            }),
          });
        } catch (saveError) {
          console.error('Failed to save anonymous session:', saveError);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: `I apologize, but I'm having trouble connecting right now. Error: ${error.message}. Please try again in a moment.`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, sessionId]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: Date.now(),
        type: "bot",
        content: "Hello! I'm your Bible counsellor AI. I'm here to provide guidance and support based on biblical wisdom. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    
    // Generate new session ID for anonymous users
    if (!localStorage.getItem('user')) {
      const newSessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('anonymousSessionId', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  const saveToHistory = useCallback((chatId, messages) => {
    setChatHistory(prev => [...prev, { id: chatId, messages, timestamp: new Date() }]);
  }, []);

  const value = {
    messages,
    isLoading,
    chatHistory,
    sessionId,
    sendMessage,
    clearChat,
    saveToHistory,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 