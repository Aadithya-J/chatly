'use client';

import { type Server } from '@prisma/client';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';
import { ServerButton } from '~/components/navigation/server-button'
import { Button } from '~/components/ui/button';
import { Plus } from 'lucide-react';
import CreateServerDialog from '~/components/create-server-dialog';
import { useState } from 'react';
import { type api } from '~/trpc/react';

interface ServerSidebarProps {
  servers: {
    server: Server;
    firstTextChannelId: string;
  }[],
  selectedServerId: string
  refetch: ReturnType<typeof api.server.getServers.useQuery>['refetch'];
}

export function ServerSidebar({
  servers,
  selectedServerId,
  refetch
}: ServerSidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="h-full w-[72px] flex flex-col items-center bg-[#e6e6e6] py-3">
      <div className='group'>
        <Button onClick={handleDialogOpen} size={'icon'} className='w-12 h-12 rounded-[24px] bg-neutral-700 hover:bg-emerald-500 hover:rounded-[16px] transition-all duration-200 group relative p-0 text-emerald-300 hover:text-slate-800'>
          <Plus strokeWidth={2.2} className='h-full w-full'/>
        </Button>
        <CreateServerDialog isOpen={isDialogOpen} onClose={handleDialogClose} refetch={refetch}/>
      </div>
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