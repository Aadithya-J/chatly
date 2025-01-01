"use client";

import * as React from "react";
// import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

interface JoinServerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  serverName: string;
  imageUrl: string;
  inviteCode: string;
}

export default function JoinServerDialog({
  isOpen,
  onClose,
  serverName,
  //   imageUrl,
  inviteCode,
}: JoinServerDialogProps) {
  const utils = api.useUtils();

  const joinServer = api.server.joinServer.useMutation({
    onSuccess: async () => {
      await utils.server.getServers.invalidate();
      onClose();
    },
  });

  const onJoin = async () => {
    joinServer.mutate({
      inviteCode,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-300 dark:bg-zinc-800 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Join {serverName}
          </DialogTitle>
          <DialogDescription>
            You are about to join the server: {serverName}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          {/* <Image src={imageUrl} alt={serverName} className="w-32 h-32 object-cover rounded-full" /> */}
          <p className="text-center text-lg">{serverName}</p>

          <Button
            onClick={onJoin}
            className="w-full"
            disabled={joinServer.status === "pending"}
          >
            {joinServer.status === "pending" ? "Joining..." : "Join Server"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
