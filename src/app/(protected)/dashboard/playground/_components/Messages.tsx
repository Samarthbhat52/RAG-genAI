"use client";

import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { ExtendedMessage } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { Loader } from "lucide-react";
import React from "react";

interface MessageProps {
  message: ExtendedMessage;
  isNextMessageBySamePerson: boolean;
}

export const Message = ({
  message,
  isNextMessageBySamePerson,
}: MessageProps) => {
  return <div>{message.message}</div>;
};

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

  const loadingMessage = {
    createdAt: new Date(),
    id: "loading-message",
    isUserMessage: false,
    message: (
      <span className="flex h-full items-center justify-center">
        <Loader size={15} className="animate-spin" />
      </span>
    ),
    playgroundId: playgroundId,
    updatedAt: new Date(),
    userId: "loading-user",
  };

  const combinedMessages = [
    ...(true ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  return (
    <div className="flex flex-1 flex-col-reverse">
      {combinedMessages && combinedMessages.length ? (
        combinedMessages.map((message, i) => {
          const isNextMessageBySamePerson =
            combinedMessages[i - 1]?.isUserMessage ===
            combinedMessages[i]?.isUserMessage;

          if (i == combinedMessages.length - 1) {
            return (
              <Message
                key={message.id}
                message={message}
                isNextMessageBySamePerson={isNextMessageBySamePerson}
              />
            );
          } else
            return (
              <Message
                key={message.id}
                message={message}
                isNextMessageBySamePerson={isNextMessageBySamePerson}
              />
            );
        })
      ) : isLoading ? (
        <div></div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Messages;
