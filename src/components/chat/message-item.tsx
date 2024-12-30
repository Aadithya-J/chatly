"use client";
import React from "react";
import { cn } from "~/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
interface MessageItemProps {
  message: string;
  username: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, username }) => {
  const isCurrentUser = username === "You"; // Assuming 'You' is the current user

  return (
    <div
      className={cn(
        "flex gap-3",
        isCurrentUser ? "justify-end" : "justify-start",
      )}
    >
      {!isCurrentUser && (
        <Avatar>
          <AvatarImage src={`https://ui-avatars.com/api/?name=${username}`} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
      )}
      <Card
        className={cn(
          "max-w-xs rounded-lg p-3",
          isCurrentUser
            ? "bg-primary text-white"
            : "bg-secondary text-foreground",
        )}
      >
        <CardHeader className="p-0">
          <CardTitle className="text-sm font-semibold">{username}</CardTitle>
        </CardHeader>
        <CardContent className="mt-1 p-0">{message}</CardContent>
      </Card>
      {isCurrentUser && (
        <Avatar>
          <AvatarImage src={`https://ui-avatars.com/api/?name=${username}`} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageItem;
