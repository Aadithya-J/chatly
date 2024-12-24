import React from "react";
import Link from "next/link";
import { db } from "~/server/db";
import { ChannelType } from "@prisma/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from "~/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SearchForm } from "~/components/search-form";
import { VersionSwitcher } from "~/components/version-switcher";

export default async function ServerNavigationBar({
  params,
  versions,
  navMain,
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
              {versions && (
                <VersionSwitcher
                  versions={versions}
                  defaultVersion={versions[0] ?? ""}
                />
              )}
              <SearchForm />
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full p-2 text-left hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50">
                  {serverData.name}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60">
                  <DropdownMenuItem>
                    <Link href={`/server/${serverId}/settings`}>
                      Server Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/server/${serverId}/invite`}>
                      Invite People
                    </Link>
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

              {/* Navigation Items */}
              {navMain?.map((item) => (
                <SidebarGroup key={item.title}>
                  <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.items.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={subItem.isActive}
                          >
                            <a href={subItem.url}>{subItem.title}</a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
            <SidebarRail />
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
