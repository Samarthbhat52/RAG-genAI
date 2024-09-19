"use client";

import { api } from "@/trpc/react";
import React, { useContext } from "react";
import { Message } from "./Message";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatContext } from "./ChatContext";
import { Bot, Loader } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MessagesProps {
  playgroundId: string;
}

function Messages({ playgroundId }: MessagesProps) {
  const { isLoading: isAiThinking, messages: aiResponse } =
    useContext(ChatContext);

  const { data, isLoading, fetchNextPage } =
    api.playgroundRouter.getPlaygroundMessages.useInfiniteQuery(
      {
        playgroundId,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      },
    );

  const messages = data?.pages.flatMap((page) => page.messages);

  return (
    <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex max-h-[calc(100vh-3.5rem-15rem)] flex-1 flex-col-reverse gap-4 overflow-y-auto border-zinc-200 p-3">
      {aiResponse.map((m) => {
        if (m.role === "assistant") {
          return (
            <div className="my-4 flex items-end gap-3">
              <Bot
                className="rounded-md bg-accent p-1 text-accent-foreground"
                size={30}
              />

              <ReactMarkdown className="w-auto max-w-prose flex-1 rounded-md bg-gray-200 p-2">
                {m.content}
              </ReactMarkdown>
            </div>
          );
        }
        return null;
      })}

      {messages && messages.length ? (
        messages.map((msg, i) => {
          return <Message key={msg.id} message={msg} />;
        })
      ) : isLoading ? (
        <SkeletonLoader />
      ) : null}
    </div>
  );
}

const SkeletonLoader = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
};

export default Messages;
