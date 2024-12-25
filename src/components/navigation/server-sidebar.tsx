'use client';

import { type Server } from '@prisma/client';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';
import { ServerButton } from '~/components/navigation/server-button'
import { Button } from '~/components/ui/button';
import { Plus } from 'lucide-react';
import CreateServerDialog from '~/components/create-server-dialog';
import { useState } from 'react';
import { LoadingScreen } from '../loading-screen';
import { ModeToggle } from '../mode-toggle';

interface ServerSidebarProps {
  servers: {
    server: Server;
    firstTextChannelId: string;
  }[],
  selectedServerId: string
  isLoading: boolean;
}

export function ServerSidebar({
  servers,
  selectedServerId,
  isLoading
}: ServerSidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  if(isLoading){
    return <LoadingScreen />;
  }
  return (
    <div className="h-full w-[72px] flex flex-col items-center bg-zinc-400 dark:bg-zinc-900 py-3">
      <div className='group'>
        <Button onClick={handleDialogOpen} size={'icon'} className='w-12 h-12 rounded-[24px] bg-neutral-700 hover:bg-emerald-500 hover:rounded-[16px] transition-all duration-200 group relative p-0 text-emerald-300 hover:text-slate-800'>
          <Plus strokeWidth={2.2} className='h-full w-full'/>
        </Button>
        <CreateServerDialog isOpen={isDialogOpen} onClose={handleDialogClose}/>
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
      <ModeToggle />
    </div>
  );
}