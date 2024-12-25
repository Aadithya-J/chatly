'use client';

import { ServerSidebar } from '~/components/navigation/server-sidebar';
import { ChannelSidebar } from '~/components/navigation/channel-sidebar';
import type { Channel } from '@prisma/client';
import { useServers, useChannels } from "~/hooks/api-utils";
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname();

  const pathSegments = pathname.split('/').filter(Boolean);
  const selectedServerId = pathSegments[0] ?? '';
  const selectedChannelId = pathSegments[1] ?? '';
  const { serversData } = useServers();
  const { channels: channelData } = useChannels(selectedServerId) ?? {};
  const servers = serversData.map(({ server }) => server);
  const channels: {text: Channel[] | null ,voice: Channel[]| null} = channelData ?? {text: [], voice: []};
  const selectedServer = servers.find(s => s.id === selectedServerId);
  return (  
    <div className='flex h-128'>
      <ServerSidebar
        servers={serversData}
        selectedServerId={selectedServerId}
      />
      {selectedServerId !== '' && (
        <ChannelSidebar
          channels={channels}
          selectedChannelId={selectedChannelId}
          serverId={selectedServerId}
          serverName={selectedServer?.name ?? ''}
        />
      )}
    </div>
  );
}