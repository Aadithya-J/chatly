"use client";

import React, { useRef, useEffect } from "react";
import MessageItem from "./message-item";

interface MessageListProps {
  messages: { messageContent: string; userName: string }[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserNearBottom = useRef(true); // Track if the user is near the bottom

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50; // Threshold of 50px
      isUserNearBottom.current = isNearBottom;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);

      // Automatically scroll to bottom if user is near bottom
      if (isUserNearBottom.current) {
        container.scrollTop = container.scrollHeight;
      }

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [messages]); // Run when messages update

  return (
    <div ref={containerRef} className="h-full space-y-4 overflow-y-auto">
      {messages.map((msg, index) => (
        <MessageItem
          key={index}
          message={msg.messageContent}
          username={msg.userName}
        />
      ))}
    </div>
  );
};

export default MessageList;
