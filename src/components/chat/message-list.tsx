"use client";

import React from "react";
import MessageItem from "./message-item";
import type { Message, User } from "@prisma/client";

interface MessageListProps {
  messages: { message: Message; user: User }[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <MessageItem
          key={index}
          message={msg.message.content}
          username={msg.user.name}
        />
      ))}
    </div>
  );
};

export default MessageList;
