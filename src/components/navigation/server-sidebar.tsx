"use client";
import { type Server } from "@prisma/client";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { ServerButton } from "~/components/navigation/server-button";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import CreateServerDialog from "~/components/dialogs/create-server-dialog";
import { useState } from "react";
import { LoadingScreen } from "../loading-screen";
import { ModeToggle } from "../mode-toggle";

interface ServerSidebarProps {
  servers: {
    server: Server;
    firstTextChannelId: string;
  }[];
  selectedServerId: string;
  isLoading: boolean;
}

export function ServerSidebar({
  servers,
  selectedServerId,
  isLoading,
}: ServerSidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-full w-[72px] flex-col bg-zinc-400 dark:bg-zinc-900">
      <div className="flex flex-col items-center space-y-2 p-3">
        <div className="group">
          <Button
            onClick={handleDialogOpen}
            size={"icon"}
            className="group relative h-12 w-12 rounded-[24px] bg-zinc-500 p-0 text-emerald-400 transition-all duration-200 hover:rounded-[16px] hover:bg-emerald-400 hover:text-slate-800 dark:bg-neutral-700 dark:text-emerald-300 dark:hover:bg-emerald-500"
          >
            <Plus strokeWidth={2.2} className="h-full w-full" />
          </Button>
          <CreateServerDialog
            isOpen={isDialogOpen}
            onClose={handleDialogClose}
          />
        </div>
        <Separator className="h-[2px] w-12 rounded-lg bg-[#313338]" />
      </div>

      <ScrollArea className="mb-auto flex-1">
        <div className="flex flex-col items-center space-y-2 px-3">
          {servers.map(
            (serverData: { server: Server; firstTextChannelId: string }) => (
              <ServerButton
                key={serverData.server.id}
                {...serverData.server}
                firstTextChannelId={serverData.firstTextChannelId}
                isSelected={selectedServerId === serverData.server.id}
              />
            ),
          )}
        </div>
      </ScrollArea>

      <div className="mt-auto flex items-center justify-center p-3">
        <ModeToggle />
      </div>
    </div>
  );
}
