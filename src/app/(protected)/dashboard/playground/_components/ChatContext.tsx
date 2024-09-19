"use client";

import { messageSelect } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { Message, useChat } from "ai/react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

type StreamResponse = {
  callAI: () => void;
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  messages: Message[];
};

export const ChatContext = React.createContext<StreamResponse>({
  callAI: () => {},
  input: "",
  handleInputChange: () => {},
  isLoading: false,
  messages: [],
});

interface ChatContextProviderProps {
  playgroundId: string;
  children: React.ReactNode;
}

export const ChatContextProvider = ({
  playgroundId,
  children,
}: ChatContextProviderProps) => {
  const utils = api.useUtils();
  const backupMessage = useRef("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = api.playgroundRouter.AddPlaygroundMessage.useMutation({
    onMutate: async (data) => {
      await utils.playgroundRouter.getPlaygroundMessages.cancel({
        playgroundId,
      });

      // Optimistically update to the new value
      utils.playgroundRouter.getPlaygroundMessages.setInfiniteData(
        { playgroundId },
        (old) => {
          if (!old) {
            return { pages: [], pageParams: [] };
          }
          const newMessage = old.pages.map(
            (oldPage: {
              messages: messageSelect[];
              nextCursor: string | undefined;
            }) => ({
              ...oldPage,
              messages: [
                {
                  createdAt: new Date(),
                  message: data.message,
                  id: Math.random().toString(),
                  isUserMessage: data.role === "assistant" ? false : true,
                  playgroundId: playgroundId,
                  updatedAt: new Date(),
                  userId: "loading-user",
                },
                ...oldPage.messages,
              ],
            }),
          );
          return {
            ...old,
            pages: newMessage,
          };
        },
      );
    },
    onError: async () => {
      setMessages([]);
      setInput(backupMessage.current);
    },
  });

  const {
    input,
    setInput,
    messages,
    setMessages,
    handleInputChange,
    handleSubmit,
  } = useChat({
    api: "/api/message",
    onError: async () => {
      setInput(backupMessage.current);
      setMessages([]);
      await utils.playgroundRouter.getPlaygroundMessages.invalidate({
        playgroundId,
      });

      toast.error("Something went wrong. Please try again later");
    },
    onFinish: async ({ content }) => {
      setMessages([]);
      mutate(
        {
          playgroundId,
          message: content,
          role: "assistant",
        },
        {
          onSuccess: async () => {
            await utils.playgroundRouter.getPlaygroundMessages.invalidate({
              playgroundId,
            });
          },
        },
      );
    },
  });

  const callAI = async () => {
    setIsLoading(true);
    backupMessage.current = input;

    mutate({
      playgroundId,
      message: input,
      role: "user",
    });

    handleSubmit();
  };

  return (
    <ChatContext.Provider
      value={{
        callAI,
        input,
        handleInputChange,
        isLoading,
        messages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
