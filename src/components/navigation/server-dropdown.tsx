"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, XIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import LeaveServerDialog from "../dialogs/leave-server-dialog";

interface ServerDropdownProps {
  serverName: string;
  serverId: string;
}

export const ServerDropdown: React.FC<ServerDropdownProps> = ({
  serverName,
  serverId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const handleIsOpen = (open: boolean) => {
    setIsOpen(open);
  };

  const handleLeaveDialogClose = () => {
    setIsLeaveDialogOpen(false);
  };

  const handleLeaveDialogOpen = () => {
    setIsLeaveDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={handleIsOpen}>
        <DropdownMenuTrigger className="w-full p-1 text-left hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50">
          <div className="flex flex-row items-center justify-between">
            <h2 className="truncate p-2 text-base font-semibold text-slate-600">
              {serverName}
            </h2>
            <div className="p-2">
              {isOpen ? (
                <XIcon className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60">
          <DropdownMenuItem>
            <Link
              href={`/${serverId}/settings`}
              className="w-full"
              scroll={false}
            >
              Server Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`/${serverId}/invite`}
              className="w-full"
              scroll={false}
            >
              Invite People
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleLeaveDialogOpen}>
            Leave Server
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LeaveServerDialog
        isOpen={isLeaveDialogOpen}
        onClose={handleLeaveDialogClose}
        serverName={serverName}
        serverId={serverId}
      />
    </>
  );
};
