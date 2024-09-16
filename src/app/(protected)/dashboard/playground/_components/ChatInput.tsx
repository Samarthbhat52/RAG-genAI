"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, CornerDownLeft } from "lucide-react";
import React, { useContext, useRef } from "react";
import { ChatContext } from "./ChatContext";

interface ChatInputProps {
  disabled?: boolean;
}

function ChatInput({ disabled = false }: ChatInputProps) {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div
      className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
      x-chunk="dashboard-03-chunk-1"
    >
      <Textarea
        ref={textAreaRef}
        disabled={disabled}
        placeholder="Enter your question..."
        className="h-1/3 min-h-14 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        autoFocus
        onChange={handleInputChange}
        value={message}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            addMessage();
            textAreaRef.current?.focus();
          }
        }}
      />
      <div className="flex items-center p-3 pt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Copy size={20} />
                <span className="sr-only">Copy</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Copy</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          disabled={disabled || isLoading}
          type="submit"
          size="sm"
          className="ml-auto gap-1.5"
          onClick={(e) => {
            e.preventDefault;
            addMessage();
            textAreaRef.current?.focus();
          }}
        >
          Send Message
          <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export default ChatInput;
