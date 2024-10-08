"use client";

import React from "react";
import Messages from "./Messages";
import ChatInput from "./ChatInput";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { ChatContextProvider } from "./ChatContext";

function ChatArea() {
  const { id } = useParams<{ id: string }>();
  const { data: pdfList, isLoading } = api.filesRouter.getFiles.useQuery({
    playgroundId: id,
  });

  return (
    <ChatContextProvider playgroundId={id}>
      <div className="flex w-full flex-col justify-between gap-4 rounded-md border border-border bg-card p-4 md:w-3/4">
        <Messages playgroundId={id} />
        <ChatInput disabled={isLoading || !pdfList?.length} />
      </div>
    </ChatContextProvider>
  );
}

export default ChatArea;
