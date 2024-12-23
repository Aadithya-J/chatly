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
  SidebarRail,
} from "~/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { ChevronsDown } from "lucide-react";

export default async function ServerNavigationBar({
  params,
  children,
}: {
  params: Promise<{ serverId: string }>;
  versions?: string[];
  navMain?: Array<{ title: string; url: string; items: Array<{ title: string; url: string; isActive?: boolean }> }>;
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
    channel => channel.type === ChannelType.TEXT
  );
  const voiceChannels = serverData.Channel?.filter(
    channel => channel.type === ChannelType.VOICE
  );

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <div className="inset-y-0 left-0 w-60 hidden lg:block">
          <Sidebar>
            <SidebarHeader>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full p-2 text-left hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50">
                  <div className="flex flex-row ">
                    {serverData.name}
                    <ChevronsDown className="ml-auto"/>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60">
                  <DropdownMenuItem>
                    <Link href={`/server/${serverId}/settings`}>Server Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/server/${serverId}/invite`}>Invite People</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/server/${serverId}/leave`}>Leave Server</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarHeader>

            <SidebarContent>
              {/* Server Channels */}
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {textChannels?.length > 0 && (
                      <>
                        <SidebarMenuButton>Text Channels</SidebarMenuButton>
                        {textChannels.map(channel => (
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
                        {voiceChannels.map(channel => (
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
            <SidebarRail />
          </Sidebar>
        </div>

        <div className="lg:hidden">
          <SidebarTrigger />
        </div>

        <main className="flex-1 h-screen bg-white p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}