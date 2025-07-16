import { useState, useCallback, useRef, useEffect } from 'react';
import { useChatHistoryContext } from '../contexts/ChatHistoryContext';

export const useAIChat = () => {
  const { addMessage, messages } = useChatHistoryContext();
  const [isSending, setIsSending] = useState(false);
  const conversationBuffer = useRef([]);

  useEffect(() => {
    if (messages.length > 0) {
      conversationBuffer.current = messages.map(msg => ({
        type: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message,
        id: msg.id
      }));
    }
  }, [messages]);

  const sendMessage = useCallback(async (content) => {
    setIsSending(true);
    
    try {
      await addMessage(content, 'user');
      conversationBuffer.current.push({ type: 'user', content, id: Date.now() });
      const conversationMessages = [...conversationBuffer.current];

      // Get AI response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationMessages
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      await addMessage(data.message, 'bot');
      conversationBuffer.current.push({ type: 'assistant', content: data.message, id: Date.now() + 1 });
      
      return data.message;
    } catch (error) {
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