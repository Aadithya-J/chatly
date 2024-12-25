"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "next/navigation";
import { ChannelType } from "@prisma/client";
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
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

const channelSchema = z.object({
  name: z.string().min(1, "Channel name is required"),
});

type ChannelFormData = z.infer<typeof channelSchema>;

interface CreateChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: "text" | "voice"; // Passed as a string
}

export default function CreateChannelDialog({
  isOpen,
  onClose,
  type,
}: CreateChannelDialogProps) {
  const params = useParams();
  const serverId = Array.isArray(params.serverId) ? params.serverId[0] ?? "" : params.serverId ?? "";

  const utils = api.useUtils();

  const form = useForm<ChannelFormData>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: "",
    },
  });

  const createNewChannel = api.server.createNewChannel.useMutation({
    onSuccess: async () => {
      await utils.server.getChannels.invalidate();
      form.reset();
      onClose();
    },
  });

  const onSubmit = async (data: ChannelFormData) => {
    createNewChannel.mutate({
      serverId,
      name: data.name,
      type: type === "text" ? ChannelType.TEXT : ChannelType.VOICE,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-300 dark:bg-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create a {type === "text" ? "Text" : "Voice"} Channel
          </DialogTitle>
          <DialogDescription>
            Enter the name for your {type === "text" ? "text" : "voice"} channel.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter channel name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={createNewChannel.status === "pending"}
            >
              {createNewChannel.status === "pending"
                ? "Creating..."
                : "Create Channel"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
