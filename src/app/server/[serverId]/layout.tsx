import React from "react";
import Link from "next/link";
import { db } from "~/server/db";
import { ChannelType } from "@prisma/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import ServerDropdown from "~/components/server-dropdown";

export default async function ServerNavigationBar({
  params,
  children,
}: {
  params: Promise<{ serverId: string }>;
  versions?: string[];
  navMain?: Array<{
    title: string;
    url: string;
    items: Array<{ title: string; url: string; isActive?: boolean }>;
  }>;
  children: React.ReactNode;
}) {
  const serverId = (await params).serverId;
  const serverData = await db.server.findUnique({
    where: { id: serverId },
    include: {
      Channel: {
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
    },
  });

  if (!serverData) {
    return <div>Server not found</div>;
  }

  const textChannels = serverData.Channel?.filter(
    (channel) => channel.type === ChannelType.TEXT,
  );
  const voiceChannels = serverData.Channel?.filter(
    (channel) => channel.type === ChannelType.VOICE,
  );
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <div className="inset-y-0 left-0 hidden w-60 lg:block">
          <Sidebar>
            <SidebarHeader>
              <ServerDropdown
                serverName={serverData.name}
                serverId={serverId}
              />
            </SidebarHeader>

            <SidebarContent>
              {/* Server Channels */}
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {textChannels?.length > 0 && (
                      <>
                        <SidebarMenuButton>Text Channels</SidebarMenuButton>
                        {textChannels.map((channel) => (
                          <Link
                            key={channel.id}
                            href={`/server/${serverId}/channel/${channel.id}`}
                          >
                            <SidebarMenuItem className="cursor-pointer transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50">
                              # {channel.name}
                            </SidebarMenuItem>
                          </Link>
                        ))}
                      </>
                    )}

                    {voiceChannels?.length > 0 && (
                      <>
                        <SidebarMenuButton>Voice Channels</SidebarMenuButton>
                        {voiceChannels.map((channel) => (
                          <Link
                            key={channel.id}
                            href={`/server/${serverId}/channel/${channel.id}`}
                          >
                            <SidebarMenuItem className="cursor-pointer transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50">
                              🔊 {channel.name}
                            </SidebarMenuItem>
                          </Link>
                        ))}
                      </>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </div>

        <div className="lg:hidden">
          <SidebarTrigger />
        </div>

        <main className="h-screen flex-1 bg-white p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
