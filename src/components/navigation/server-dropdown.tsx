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
      <DropdownMenuTrigger className="w-full p-2 text-left hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50">
          <div className="border-b border-[#2c2e32]">
            <div className="flex flex-row">
              <h2 className="text-base p-2 font-semibold text-slate-600 truncate">{serverName}</h2>
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
  );
};

