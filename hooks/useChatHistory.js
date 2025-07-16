import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';

export const useChatHistory = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setMessages(prev => [...prev, { ...newMessage, id: optimisticId }]);

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

      return data;
    } catch (err) {
      setError(err.message);
      
      // Remove the optimistic update on error
      setMessages(prev => prev.filter(msg => msg.id !== Date.now()));
      throw err;
    }
  }, [user?.id]);

  // Fetch messages on mount and when user changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Real-time subscription for new messages (disabled for now to avoid conflicts)
  // useEffect(() => {
  //   if (!user?.id) return;

  //   const channel = supabase
  //     .channel('messages')
  //     .on(
  //     'postgres_changes',
  //     {
  //       event: 'INSERT',
  //       schema: 'public',
  //       table: 'messages',
  //       filter: `user_id=eq.${user.id}`
  //     },
  //     (payload) => {
  //       setMessages(prev => [...prev, payload.new]);
  //     }
  //   )
  //   .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [user?.id]);

  return {
    messages,
    addMessage,
    isLoading,
    error,
    refetch: fetchMessages
  };
}; 