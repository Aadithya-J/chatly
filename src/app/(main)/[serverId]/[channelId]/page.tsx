"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Import the UUID function
import { ChatInput } from "~/components/chat/chat-input";
import { LoadingScreen } from "~/components/loading-screen";
import { api } from "~/trpc/react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "~/components/ui/card";
import MessageList from "~/components/chat/message-list";
import { useWebSocket } from "~/components/providers/websocket-provider";

export default function ChannelPage() {
  const { receivedNewText, dataOfNewText, channelOfNewText, userOfNewText } =
    useWebSocket();
  const params = useParams() ?? {};
  const channelId = Array.isArray(params.channelId)
    ? (params.channelId[0] ?? "")
    : (params.channelId ?? "");
  const serverId = Array.isArray(params.serverId)
    ? (params.serverId[0] ?? "")
    : (params.serverId ?? "");

  const { data: channel, isLoading } = api.channel.getChannelById.useQuery({
    channelId,
  });
  const [messages, setMessages] = useState<
    { id: string; userName: string; messageContent: string }[]
  >([]);

  // Initialize messages when channel data is fetched
  useEffect(() => {
    if (channel && channel.messages) {
      const initialMessages = channel.messages.map((message) => ({
        id: message.id,
        userName: message.member.name,
        messageContent: message.content,
      }));
      setMessages(initialMessages);
    }
  }, [channel]);

  // Handle new messages via WebSocket
  useEffect(() => {
    if (receivedNewText && channelOfNewText === channelId) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: uuidv4(), // Generate unique ID for the new message
          userName: userOfNewText,
          messageContent: dataOfNewText,
        },
      ]);
    }
  }, [
    receivedNewText,
    dataOfNewText,
    channelOfNewText,
    userOfNewText,
    channelId,
  ]);

  if (isLoading || !channel) {
    return <LoadingScreen />;
  }

  return (
    <Card className="flex h-screen flex-col bg-zinc-400 dark:bg-zinc-900">
      <CardHeader className="border-b p-4">
        <CardTitle>Group Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </CardContent>
      <CardFooter className="border-t p-4">
        <ChatInput channelId={channelId} serverId={serverId} />
      </CardFooter>
    </Card>
  );
}
