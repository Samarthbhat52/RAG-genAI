import { cn } from "@/lib/utils";
import { messageSelect } from "@/server/db/schema";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  message: messageSelect;
  isNextMessageBySamePerson: boolean;
}

export const Message = ({
  message,
  isNextMessageBySamePerson,
}: MessageProps) => {
  return (
    <div
      className={cn("my-4 flex items-end gap-3", {
        "justify-end": message.isUserMessage,
      })}
    >
      <Bot
        className={cn("rounded-md bg-accent p-1 text-accent-foreground", {
          hidden: message.isUserMessage,
        })}
        size={30}
      />
      <ReactMarkdown
        className={cn("max-w-prose rounded-md bg-gray-200 px-4 py-2", {
          "bg-primary/50": message.isUserMessage,
        })}
      >
        {message.message}
      </ReactMarkdown>
      <User
        className={cn("rounded-md bg-accent p-1 text-accent-foreground", {
          hidden: !message.isUserMessage,
        })}
        size={30}
      />
    </div>
  );
};
