"use client";

import { ChannelType, type Channel } from "@prisma/client";
import { cn } from "~/lib/utils";
import { Hash, Volume2, Settings } from "lucide-react";
import Link from "next/link";
import ManageChannelDialog from "../dialogs/manage-channel-dialog";
import { useState } from "react";

interface ChannelButtonProps {
  channel: Channel;
  isSelected: boolean;
  serverId: string;
}

export function ChannelButton({
  channel,
  serverId,
  isSelected,
}: ChannelButtonProps) {
  const Icon = channel.type === ChannelType.TEXT ? Hash : Volume2;
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const handleManageDialogOpen = () => {
    setIsManageDialogOpen(true);
  };
  const handleManageDialogClose = () => {
    setIsManageDialogOpen(false);
  };
  return (
    <>
      <Link href={`/${serverId}/${channel.id}`}>
        <div
          className={cn(
            "group flex h-auto w-full items-center justify-start space-x-2 rounded-sm bg-zinc-200/50 px-2 py-1 hover:bg-zinc-200 dark:bg-[#2c2e32] dark:hover:bg-zinc-700",
            isSelected && "bg-zinc-200",
            isSelected && "dark:bg-zinc-700",
          )}
        >
          <div className="flex w-full items-center">
            <Icon className="h-4 w-4 shrink-0 text-zinc-400" />
            <span className="truncate pl-1 text-sm text-zinc-400">
              {channel.name}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleManageDialogOpen();
              }}
              className="ml-auto h-4 w-4 text-zinc-400 opacity-0 transition-opacity duration-150 ease-in-out hover:text-zinc-500 group-hover:opacity-100"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
      <ManageChannelDialog
        isOpen={isManageDialogOpen}
        onClose={handleManageDialogClose}
        channelId={channel.id}
      />
    </>
  );
}
