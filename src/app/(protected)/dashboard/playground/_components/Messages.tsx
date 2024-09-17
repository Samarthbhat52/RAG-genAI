"use client";

import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { api } from "@/trpc/react";
import React from "react";
import { Message } from "./Message";
import { Skeleton } from "@/components/ui/skeleton";

interface MessagesProps {
  playgroundId: string;
}

function Messages({ playgroundId }: MessagesProps) {
  const { data, isLoading, fetchNextPage } =
    api.playgroundRouter.getPlaygroundMessages.useInfiniteQuery(
      {
        playgroundId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      },
    );

  const messages = data?.pages.flatMap((page) => page.messages);

  return (
    <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex max-h-[calc(100vh-3.5rem-15rem)] flex-1 flex-col-reverse gap-4 overflow-y-auto border-zinc-200 p-3">
      {messages && messages.length ? (
        messages.map((msg, i) => {
          const isNextMessageBySamePerson =
            messages[i - 1]?.isUserMessage === messages[i]?.isUserMessage;

          if (i == messages.length - 1) {
            return (
              <Message
                key={msg.id}
                message={msg}
                isNextMessageBySamePerson={isNextMessageBySamePerson}
              />
            );
          } else
            return (
              <Message
                key={msg.id}
                message={msg}
                isNextMessageBySamePerson={isNextMessageBySamePerson}
              />
            );
        })
      ) : isLoading ? (
        <SkeletonLoader />
      ) : (
        <div></div>
      )}
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

// const loadingMessage = {
//   createdAt: new Date(),
//   id: "loading-message",
//   isUserMessage: false,
//   message: (
//     <span className="flex h-full items-center justify-center">
//       <Loader size={15} className="animate-spin" />
//     </span>
//   ),
//   playgroundId: playgroundId,
//   updatedAt: new Date(),
//   userId: "loading-user",
// };
