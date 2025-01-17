"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

interface LeaveServerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  serverName: string;
  serverId: string;
}

export default function LeaveServerDialog({
  isOpen,
  onClose,
  serverName,
  serverId,
}: LeaveServerDialogProps) {
  const utils = api.useUtils();

  const leaveServer = api.server.leaveServer.useMutation({
    onSuccess: async () => {
      await utils.server.getServers.invalidate();
      onClose();
    },
  });

  const onLeave = async () => {
    leaveServer.mutate({
      serverId,
    });
    await utils.server.getServers.invalidate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-300 dark:bg-zinc-800 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Leave Server</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave the server?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          <p className="text-center text-lg">{serverName}</p>

          <Button
            onClick={onLeave}
            className="w-full"
            variant="destructive"
            disabled={leaveServer.status === "pending"}
          >
            {leaveServer.status === "pending" ? "Leaving..." : "Leave Server"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
