"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useUser } from "./UserContext";
import { useChatSession } from "./ChatSessionContext";
import { supabase } from "../lib/supabase";

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useUser();
  const { currentChatId, setCurrentChatId, createChatFromMessage, loadChatMessages } = useChatSession();
  
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

    // Add user message immediately to UI
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get the current messages including the user message we just added
      const currentMessages = [...messages, userMessage];
      
      // Create chat session if this is the first message and user is signed in
      let chatId = currentChatId;
      if (!chatId && user && messages.length === 1) {
        const chat = await createChatFromMessage(content);
        chatId = chat?.id;
        // Update the current chat ID so the chat appears in the sidebar
        if (chat) {
          setCurrentChatId(chat.id);
        }
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: currentMessages
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

      // Add bot response to UI without affecting the user message
      setMessages(prev => [...prev, botResponse]);

      // Save messages to database
      if (user && chatId) {
        try {
          // Save user message
          await supabase.from('messages').insert([
            {
              user_id: user.id,
              chat_id: chatId,
              message: content,
              sender: 'user',
              created_at: new Date().toISOString()
            }
          ]);

          // Save bot response
          await supabase.from('messages').insert([
            {
              user_id: user.id,
              chat_id: chatId,
              message: data.message,
              sender: 'bot',
              created_at: new Date().toISOString()
            }
          ]);
        } catch (saveError) {
          console.error('Failed to save messages:', saveError);
        }
      } else if (sessionId && currentMessages.length % 3 === 0) {
        // Save anonymous session to database (only every 3 messages to reduce API calls)
        try {
          await fetch('/api/save-anonymous-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId,
              messages: [...currentMessages, botResponse],
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
  }, [messages, sessionId, user, currentChatId, createChatFromMessage]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: Date.now(),
        type: "bot",
        content: "Hello! I'm your Bible counsellor AI. I'm here to provide guidance and support based on biblical wisdom. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    
    // Clear current chat for signed-in users
    if (user) {
      setCurrentChatId(null);
    }
    
    // Generate new session ID for anonymous users
    if (!localStorage.getItem('user')) {
      const newSessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('anonymousSessionId', newSessionId);
      setSessionId(newSessionId);
    }
  }, [user, setCurrentChatId]);

  // Load chat messages when currentChatId changes
  useEffect(() => {
    const loadMessages = async () => {
      if (currentChatId && user && !isLoading) {
        try {
          const chatMessages = await loadChatMessages(currentChatId);
          if (chatMessages.length > 0) {
            const formattedMessages = chatMessages.map(msg => ({
              id: msg.id,
              type: msg.sender === 'user' ? 'user' : 'bot',
              content: msg.message,
              timestamp: new Date(msg.created_at)
            }));
            setMessages(formattedMessages);
          } else {
            // If no messages in chat, show welcome message
            setMessages([
              {
                id: Date.now(),
                type: "bot",
                content: "Hello! I'm your Bible counsellor AI. I'm here to provide guidance and support based on biblical wisdom. How can I help you today?",
                timestamp: new Date(),
              },
            ]);
          }
        } catch (error) {
          console.error('Failed to load chat messages:', error);
        }
      }
    };

    loadMessages();
  }, [currentChatId, user, loadChatMessages, isLoading]);

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