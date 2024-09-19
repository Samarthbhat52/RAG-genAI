"use client";

import { api } from "@/trpc/react";
import React, { useContext, useEffect, useRef } from "react";
import { Message } from "./Message";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatContext } from "./ChatContext";
import { Bot, Loader } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useIntersection } from "@mantine/hooks";

interface MessagesProps {
  playgroundId: string;
}

function Messages({ playgroundId }: MessagesProps) {
  const { isLoading: isAiThinking } = useContext(ChatContext);

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

  const loadingMessage = {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: "loading-message",
    isUserMessage: false,
    userId: crypto.randomUUID(),
    message: (
      <span className="flex h-full items-center justify-center">
        <Loader className="animate-spin" size={15} />
      </span>
    ),
    playgroundId,
  };

  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex max-h-[calc(100vh-3.5rem-15rem)] flex-1 flex-col-reverse gap-4 overflow-y-auto border-zinc-200 p-3">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          if (i === combinedMessages.length - 1) {
            return <Message ref={ref} message={message} key={message.id} />;
          } else return <Message message={message} key={message.id} />;
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
