'use client';

import { type Server } from '@prisma/client';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';
import { ServerButton } from '~/components/navigation/server-button'
import Link from 'next/link';
import { Button } from '~/components/ui/button';

interface ServerSidebarProps {
  servers: {
    server: Server;
    firstTextChannelId: string;
  }[],
  selectedServerId: string;
}

export function ServerSidebar({
  servers,
  selectedServerId,
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
          {servers.map((serverData : {server : Server,firstTextChannelId: string}) => (
            <ServerButton
              key={serverData.server.id}
              {...serverData.server}
              firstTextChannelId={serverData.firstTextChannelId}
              isSelected={selectedServerId === serverData.server.id}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}