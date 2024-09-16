import React from "react";
import Messages from "./Messages";
import ChatInput from "./ChatInput";

function ChatArea() {
  return (
    <div className="flex w-full flex-col justify-between rounded-md border border-border bg-card p-4 md:w-3/4">
      <Messages />
      <ChatInput />
    </div>
  );
}

export default ChatArea;
