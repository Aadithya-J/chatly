"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { XIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface ServerDropdownProps {
  serverName: string;
  serverId: string;
}

export const ServerDropdown: React.FC<ServerDropdownProps> = ({
  serverName,
  serverId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="w-full p-1 text-left hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50">
        <div className="">
          <div className="flex flex-row">
            <h2 className="truncate p-2 text-base font-semibold text-slate-600">
              {serverName}
            </h2>
            <div className="ml-auto p-2">
              {isOpen ? (
                <XIcon className="ml-auto" />
              ) : (
                <ChevronRight className="ml-auto" />
              )}
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuItem>
          <Link href={`/${serverId}/settings`} scroll={false}>
            Server Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/${serverId}/invite`} scroll={false}>
            Invite People
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/${serverId}/leave`} scroll={false}>
            Leave Server
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
