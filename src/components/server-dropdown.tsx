"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { XIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";

interface ServerDropdownProps {
  serverName: string;
  serverId: string;
}

const ServerDropdown: React.FC<ServerDropdownProps> = ({ serverName, serverId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="w-full p-2 text-left hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50">
        <div className="flex flex-row">
          {serverName}
          {isOpen ? (
            <XIcon className="ml-auto" />
          ) : (
            <ChevronRight className="ml-auto" />
          )}
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

export default ServerDropdown;