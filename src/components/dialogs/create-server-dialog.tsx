"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
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
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

const serverSchema = z.object({
  name: z
    .string()
    .min(1, "Server name is required")
    .max(50, "Server name is too long"),
  description: z.string().max(200, "Description is too long").optional(),
});

type ServerFormData = z.infer<typeof serverSchema>;

interface CreateServerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateServerDialog({
  isOpen,
  onClose,
}: CreateServerDialogProps) {
  const utils = api.useUtils();

  const form = useForm<ServerFormData>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createServer = api.server.create.useMutation({
    onSuccess: async () => {
      await utils.server.getServers.invalidate();
      form.reset();
      onClose(); // Close the dialog after success
    },
  });
  const onSubmit = async (data: ServerFormData) => {
    createServer.mutate({
      name: data.name,
      description: data.description ?? "",
      inviteCode: uuid(),
      image: "https://picsum.photos/200/300",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-300 dark:bg-zinc-800 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription>
            Give your server a name and description. You can always change these
            later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter server name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your server"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={createServer.status === "pending"}
            >
              {createServer.status === "pending"
                ? "Creating..."
                : "Create Server"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
