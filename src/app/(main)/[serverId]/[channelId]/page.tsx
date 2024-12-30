"use client";
import { useParams } from "next/navigation";
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
export default function ChannelPage() {
  const params = useParams() ?? {};
  const channelId = Array.isArray(params.channelId)
    ? (params.channelId[0] ?? "")
    : (params.channelId ?? "");
  const serverId = Array.isArray(params.serverId)
    ? (params.serverId[0] ?? "")
    : (params.serverId ?? "");
  const { data: channel } = api.channel.getChannelById.useQuery({ channelId });
  if (!channel) {
    return <LoadingScreen />;
  }
  console.log(channel.messages);
  const messages = channel.messages.map((message) => ({
    user: { ...message.member },
    message: { ...message },
  }));

  return (
    <Card className="flex h-screen flex-col bg-zinc-400 dark:bg-zinc-900">
      <CardHeader className="border-b p-4">
        <CardTitle>Group Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
      </CardContent>
      <CardFooter className="border-t p-4">
        <ChatInput channelId={channelId} serverId={serverId} />
      </CardFooter>
    </Card>
  );
}
