import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/server/db/schema";
import { Bot, User } from "lucide-react";
import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  message: ExtendedMessage;
}

export const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message }, ref) => {
    console.log("MESSAGE: ", message.message);
    return (
      <div
        ref={ref}
        className={cn("my-4 flex items-end gap-3", {
          "justify-end": message?.isUserMessage,
        })}
      >
        <Bot
          className={cn("rounded-md bg-accent p-1 text-accent-foreground", {
            hidden: message?.isUserMessage,
          })}
          size={30}
        />
        {typeof message.message === "string" ? (
          <ReactMarkdown
            className={cn(
              "w-auto max-w-prose rounded-md bg-gray-200 px-4 py-2",
              {
                "bg-primary/50 text-right": message?.isUserMessage,
              },
            )}
          >
            {message.message}
          </ReactMarkdown>
        ) : (
          message.message
        )}
        <User
          className={cn("rounded-md bg-accent p-1 text-accent-foreground", {
            hidden: !message?.isUserMessage,
          })}
          size={30}
        />
      </div>
    );
  },
);
