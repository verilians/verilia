import { useState, useCallback } from 'react';
import { useChatHistoryContext } from '../contexts/ChatHistoryContext';

export const useAIChat = () => {
  const { addMessage } = useChatHistoryContext();
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(async (content) => {
    setIsSending(true);
    
    try {
      // Add user message
      await addMessage(content, 'user');

      // Get AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ type: 'user', content }]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      // Add AI response
      await addMessage(data.message, 'bot');
      
      return data.message;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      await addMessage(
        `I apologize, but I'm having trouble connecting right now. Error: ${error.message}. Please try again in a moment.`,
        'bot'
      );
      
      throw error;
    } finally {
      setIsSending(false);
    }
  }, [addMessage]);

  return {
    sendMessage,
    isSending
  };
}; 