'use client';

import { type Channel } from '@prisma/client';
import { ScrollArea } from '~/components/ui/scroll-area';
import { ChannelButton } from '~/components/navigation/channel-button';
import { ServerDropdown } from './server-dropdown';
import RotatingLoader from '../loader';

interface ChannelSidebarProps {
  channels: {
    text: Channel[] | null;
    voice: Channel[] | null;
  }
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
  isLoading
}: ChannelSidebarProps) {
  const textChannels = channels.text ?? [];
  const voiceChannels = channels.voice ?? [];

  return (
    <div className="relative h-full w-60 bg-zinc-300 dark:bg-zinc-800">
      {/* <div className="p-4 border-b border-[#2c2e32]">
        <h2 className="text-base font-semibold text-slate-600 truncate">{serverName}</h2>
      </div> */}
      {isLoading && <RotatingLoader />}
      {!isLoading && (
        <>
          <ServerDropdown serverName={serverName} serverId={serverId}/>
          <ScrollArea className="h-[calc(100%-4rem)]">
            <div className="p-2 space-y-4">
              {textChannels.length > 0 && (
                <div className="space-y-[2px]">
                  <h3 className="px-2 text-xs font-semibold text-zinc-400 uppercase mb-1">
                    Text Channels
                  </h3>
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
                  <h3 className="px-2 text-xs font-semibold text-zinc-400 uppercase mb-1">
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