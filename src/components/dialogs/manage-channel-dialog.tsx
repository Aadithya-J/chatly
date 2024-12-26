"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {    
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

const channelSchema = z.object({
  name: z
    .string()
    .min(1, "Channel name is required")
    .max(50, "Channek name is too long"),
});

type ChannelFormData = z.infer<typeof channelSchema>;

interface ManageServerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string
}

export default function ManageServerDialog({
  isOpen,
  onClose,
  channelId
}: ManageServerDialogProps) {
  const utils = api.useUtils();

  const form = useForm<ChannelFormData>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: "",
    },
  });

  const renameChannel = api.channel.renameChannel.useMutation({
    onSuccess: async () => {
      await utils.server.getChannels.invalidate();
      await utils.channel.getChannelById.invalidate({ channelId });
      form.reset();
      onClose();
    },
  });

  const deleteChannel = api.channel.deleteChannel.useMutation({
    onSuccess: async () => {
      await utils.server.getChannels.invalidate();
      form.reset();
      onClose();
    },
  });
  const onRenameSubmit = async (data: ChannelFormData) => {
    renameChannel.mutate({
      name: data.name,
      channelId
    });
  };

  const onDeleteSubmit = async () => {
    deleteChannel.mutate({ channelId
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-300 dark:bg-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Manage your channel
          </DialogTitle>
          <DialogDescription>
            Rename or delete your channel. These actions cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onRenameSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter new channel name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={renameChannel.status === "pending"}
            >
              {renameChannel.status === "pending"
                ? "Renaming..."
                : "Rename Channel"}
            </Button>
          </form>
        </Form>
        <Button
           type="button"
           className="w-full bg-red-600 hover:bg-red-700"
           onClick={onDeleteSubmit}
           disabled={deleteChannel.status === "pending"}
         >
           {deleteChannel.status === "pending" ? "Deleting..." : "Delete Channel"}
         </Button>
      </DialogContent>
    </Dialog>
  );
}
