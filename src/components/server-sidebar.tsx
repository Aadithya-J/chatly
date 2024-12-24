'use client';

import { type Server } from '@prisma/client';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';
import { ServerButton } from './server-button';
import Link from 'next/link';
import { Button } from './ui/button';

interface ServerSidebarProps {
  servers: Server[];
  selectedServerId: string;
  onServerSelect: (serverId: string) => void;
}

export function ServerSidebar({
  servers,
  selectedServerId,
  onServerSelect,
}: ServerSidebarProps) {
  return (
    <div className="h-full w-[72px] flex flex-col items-center bg-[#e6e6e6] py-3">
        <Link href='/createserver'>
            <Button className='w-12 h-12 rounded-[24px] bg-[#313338] hover:rounded-[16px] transition-all duration-200 group relative'>
                
            </Button>
        </Link>
      <Separator className="my-2 w-12 h-[2px] bg-[#313338] rounded-lg" />
      <ScrollArea className="flex-1 w-full">
        <div className="flex flex-col items-center space-y-2">
          {servers.map((server) => (
            <ServerButton
              key={server.id}
              {...server}
              isSelected={selectedServerId === server.id}
              onClick={() => onServerSelect(server.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}