"use client";

import { type Channel } from "@prisma/client";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ChannelButton } from "~/components/navigation/channel-button";
import { ServerDropdown } from "./server-dropdown";
import RotatingLoader from "../loader";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateChannelDialog from "../dialogs/create-channel-dialog";
interface ChannelSidebarProps {
  channels: {
    text: Channel[] | null;
    voice: Channel[] | null;
  };
  selectedChannelId: string;
  serverId: string;
  serverName: string;
  isLoading: boolean;
}

export function ChannelSidebar({
  channels,
  selectedChannelId,
  serverName,
  serverId,
  isLoading,
}: ChannelSidebarProps) {
  const textChannels = channels.text ?? [];
  const voiceChannels = channels.voice ?? [];
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const handleCreateDialogOpen = () => {
    setIsCreateDialogOpen(true);
  };
  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
  };
  return (
    <div className="relative h-full w-60 bg-zinc-300 dark:bg-zinc-800">
      {/* <div className="p-4 border-b border-[#2c2e32]">
        <h2 className="text-base font-semibold text-slate-600 truncate">{serverName}</h2>
      </div> */}
      {isLoading && <RotatingLoader />}
      {!isLoading && (
        <>
          <div className="bg-zinc-400/30 dark:bg-[#202020]">
            <ServerDropdown serverName={serverName} serverId={serverId} />
          </div>

          <ScrollArea className="h-[calc(100%-4rem)]">
            <div className="space-y-4 p-2">
              {textChannels.length > 0 && (
                <div className="space-y-[2px]">
                  <div className="flex items-center p-2">
                    <h3 className="mb-1 px-2 text-xs font-semibold uppercase text-zinc-400">
                      Text Channels
                    </h3>
                    <button
                      onClick={handleCreateDialogOpen}
                      className="ml-auto bg-zinc-300 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                    >
                      <Plus
                        strokeWidth={2.2}
                        className="ml-auto h-5 w-5 text-zinc-400"
                      />
                    </button>
                    <CreateChannelDialog
                      isOpen={isCreateDialogOpen}
                      onClose={handleCreateDialogClose}
                      type={"text"}
                    />
                  </div>
                  {textChannels.map((channel) => (
                    <ChannelButton
                      key={channel.id}
                      channel={channel}
                      serverId={serverId}
                      isSelected={selectedChannelId === channel.id}
                    />
                  ))}
                </div>
              )}
              {voiceChannels.length > 0 && (
                <div className="space-y-[2px]">
                  <h3 className="mb-1 px-2 text-xs font-semibold uppercase text-zinc-400">
                    Voice Channels
                  </h3>
                  {voiceChannels.map((channel) => (
                    <ChannelButton
                      key={channel.id}
                      serverId={serverId}
                      channel={channel}
                      isSelected={selectedChannelId === channel.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
}
