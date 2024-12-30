"use client";

import { ServerSidebar } from "~/components/navigation/server-sidebar";
import { ChannelSidebar } from "~/components/navigation/channel-sidebar";
import type { Channel } from "@prisma/client";
import { useServers, useChannels } from "~/hooks/api-utils";
import { useParams } from "next/navigation";

export function Navigation() {
  const params = useParams();
  const selectedServerId = Array.isArray(params.serverId)
    ? (params.serverId[0] ?? "")
    : (params.serverId ?? "");
  const selectedChannelId = Array.isArray(params.channelId)
    ? (params.channelId[0] ?? "")
    : (params.channelId ?? "");

  const { serversData, isLoading: isLoadingServers } = useServers();
  const { channels: channelData, isLoading: isLoadingChannels } =
    useChannels(selectedServerId) ?? {};

  const servers = serversData.map(({ server }) => server);
  const channels: { text: Channel[] | null; voice: Channel[] | null } =
    channelData ?? { text: [], voice: [] };
  const selectedServer = servers.find((s) => s.id === selectedServerId);

  return (
    <div className="h-128 flex">
      <ServerSidebar
        servers={serversData}
        selectedServerId={selectedServerId}
        isLoading={isLoadingServers} // Passing the loading state to ServerSidebar
      />
      {selectedServerId !== "" && (
        <ChannelSidebar
          channels={channels}
          selectedChannelId={selectedChannelId}
          serverId={selectedServerId}
          serverName={selectedServer?.name ?? ""}
          isLoading={isLoadingChannels} // Passing the loading state to ChannelSidebar
        />
      )}
    </div>
  );
}
