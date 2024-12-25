'use client';

import { useState } from 'react';
import { ServerSidebar } from '~/components/navigation/server-sidebar';
import { ChannelSidebar } from '~/components/navigation/channel-sidebar';
import type { Channel } from '@prisma/client';
import { useServers, useChannels } from "~/hooks/api-utils";

export function Navigation() {
  const [selectedServerId, setSelectedServerId] = useState('home');
  const [selectedChannelId, setSelectedChannelId] = useState('');

  const { servers = [] } = useServers();
  const { channels: channelData } = useChannels(selectedServerId) ?? {};

  const channels: {text: Channel[] | null ,voice: Channel[]| null} = channelData ?? {text: [], voice: []};

  const selectedServer = servers.find(s => s.id === selectedServerId);

  return (
    <div className='flex h-128'>
      <ServerSidebar
        servers={servers}
        selectedServerId={selectedServerId}
        onServerSelect={setSelectedServerId}
      />
      {selectedServerId !== 'home' && (
        <ChannelSidebar
          channels={channels}
          selectedChannelId={selectedChannelId}
          serverId={selectedServerId}
          onChannelSelect={setSelectedChannelId}
          serverName={selectedServer?.name ?? ''}
        />
      )}
    </div>
  );
}