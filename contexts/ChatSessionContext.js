"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from './UserContext';
import { supabase } from '../lib/supabase';

const ChatSessionContext = createContext();

export const useChatSession = () => {
  const context = useContext(ChatSessionContext);
  if (!context) {
    throw new Error('useChatSession must be used within a ChatSessionProvider');
  }
  return context;
};

export const ChatSessionProvider = ({ children }) => {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatUpdateTrigger, setChatUpdateTrigger] = useState(0);

  // Fetch user's chats
  const fetchChats = useCallback(async () => {
    if (!user?.id) {
      setChats([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setChats(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Create a new chat
  const createChat = useCallback(async (title) => {
    if (!user?.id) {
      throw new Error('User must be signed in to create chats');
    }

    try {
      const { data, error } = await supabase
        .from('chats')
        .insert([
          {
            user_id: user.id,
            title: title,
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setChats(prev => [data, ...prev]);
      setCurrentChatId(data.id);
      
      // Trigger a re-render of components that depend on chats
      setChatUpdateTrigger(prev => prev + 1);
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user?.id]);

  // Create chat from first message
  const createChatFromMessage = useCallback(async (message) => {
    if (!user?.id) {
      return null; // Anonymous users don't create chats
    }

    // Generate title from first 5-7 words
    const words = message.split(' ').slice(0, 7);
    const title = words.join(' ') + (words.length >= 7 ? '...' : '');

    try {
      const chat = await createChat(title);
      return chat;
    } catch (err) {
      console.error('Failed to create chat from message:', err);
      return null;
    }
  }, [user?.id, createChat]);

  // Load chat messages
  const loadChatMessages = useCallback(async (chatId) => {
    if (!user?.id || !chatId) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err) {
      console.error('Failed to load chat messages:', err);
      return [];
    }
  }, [user?.id]);

  // Delete a chat
  const deleteChat = useCallback(async (chatId) => {
    if (!user?.id) {
      return;
    }

    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      // If we deleted the current chat, clear it
      if (currentChatId === chatId) {
        setCurrentChatId(null);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [user?.id, currentChatId]);

  // Fetch chats on mount and when user changes
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const value = {
    chats,
    currentChatId,
    setCurrentChatId,
    isLoading,
    error,
    createChat,
    createChatFromMessage,
    loadChatMessages,
    deleteChat,
    fetchChats,
    chatUpdateTrigger,
  };

  return (
    <ChatSessionContext.Provider value={value}>
      {children}
    </ChatSessionContext.Provider>
  );
}; 