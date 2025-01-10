"use client";
import { ServerSidebar } from "~/components/navigation/server-sidebar";
import { ChannelSidebar } from "~/components/navigation/channel-sidebar";
import type { Channel } from "@prisma/client";
import { useServers, useChannels } from "~/hooks/api-utils";
import { useParams } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Menu } from "lucide-react";

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

  const NavigationContent = () => (
    <div className="flex h-full">
      <ServerSidebar
        servers={serversData}
        selectedServerId={selectedServerId}
        isLoading={isLoadingServers}
      />
      {selectedServerId !== "" && (
        <ChannelSidebar
          channels={channels}
          selectedChannelId={selectedChannelId}
          serverId={selectedServerId}
          serverName={selectedServer?.name ?? ""}
          isLoading={isLoadingChannels}
        />
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <NavigationContent />
      </div>

      {/* Mobile Navigation with Sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="fixed left-4 top-4 z-50 rounded-md border bg-background p-2">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <NavigationContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
