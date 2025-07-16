"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from './UserContext';
import { supabase } from '../lib/supabase';

const ChatHistoryContext = createContext();

export const useChatHistoryContext = () => {
  const context = useContext(ChatHistoryContext);
  if (!context) {
    throw new Error('useChatHistoryContext must be used within a ChatHistoryProvider');
  }
  return context;
};

export const ChatHistoryProvider = ({ children }) => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Fetch messages from Supabase
  const fetchMessages = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setMessages(data || []);
      setLastUpdate(Date.now());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Add a new message to both local state and Supabase
  const addMessage = useCallback(async (message, sender) => {
    if (!user?.id) {
      return;
    }

    const newMessage = {
      user_id: user.id,
      message,
      sender,
      created_at: new Date().toISOString()
    };

    try {
      // Optimistically add to local state
      const optimisticId = Date.now();
      const optimisticMessage = { ...newMessage, id: optimisticId };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setLastUpdate(Date.now());

      // Insert into Supabase
      const { data, error: insertError } = await supabase
        .from('messages')
        .insert([newMessage])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Update local state with the actual data from Supabase
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== optimisticId);
        return [...filtered, data];
      });
      
      setLastUpdate(Date.now());

      return data;
    } catch (err) {
      setError(err.message);
      
      // Remove the optimistic update on error
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== Date.now());
        return filtered;
      });
      throw err;
    }
  }, [user?.id]);

  // Fetch messages on mount and when user changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const value = {
    messages,
    addMessage,
    isLoading,
    error,
    lastUpdate,
    refetch: fetchMessages
  };

  return (
    <ChatHistoryContext.Provider value={value}>
      {children}
    </ChatHistoryContext.Provider>
  );
}; 