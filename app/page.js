"use client";

import ChatHeader from "../components/ChatHeader";
import ChatHistoryPanel from "../components/ChatHistoryPanel";
import ChatInput from "../components/ChatInput";
import { useChatContext } from "../contexts/ChatContext";

export default function Home() {
  const { sendMessage, isLoading } = useChatContext();

  const handleSendMessage = async (content) => {
    await sendMessage(content);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      
      <ChatHistoryPanel />
      
      <ChatInput onSendMessage={handleSendMessage} isSending={isLoading} />
    </div>
  );
}
