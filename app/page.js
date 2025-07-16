"use client";

import ChatHeader from "../components/ChatHeader";
import ChatHistoryPanel from "../components/ChatHistoryPanel";
import ChatInput from "../components/ChatInput";
import { useAIChat } from "../hooks/useAIChat";
import { useUser } from "../contexts/UserContext";

export default function Home() {
  const { user } = useUser();
  const { sendMessage, isSending } = useAIChat();

  const handleSendMessage = async (content) => {
    if (!user) {
      return;
    }
    await sendMessage(content);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      
      <ChatHistoryPanel />
      
      <ChatInput onSendMessage={handleSendMessage} isSending={isSending} />
    </div>
  );
}
