import { useState, useCallback } from "react";

export const useChat = () => {
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
        console.error('API Error:', errorData);
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
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: Date.now(),
        type: "bot",
        content: "Hello! I'm your Bible counsellor AI. I'm here to provide guidance and support based on biblical wisdom. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const saveToHistory = useCallback((chatId, messages) => {
    setChatHistory(prev => [...prev, { id: chatId, messages, timestamp: new Date() }]);
  }, []);

  return {
    messages,
    isLoading,
    chatHistory,
    sendMessage,
    clearChat,
    saveToHistory,
  };
}; 