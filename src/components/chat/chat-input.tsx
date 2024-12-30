"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useWebSocket } from "~/components/providers/websocket-provider";
import { Input } from "~/components/ui/input";
import { FormControl, Form, FormField, FormItem } from "~/components/ui/form";
import { MessageTypes } from "~/types";
interface ChatInputProps {
  channelId: string;
  serverId: string;
}

const formSchema = z.object({
  data: z.string().min(1).max(500),
});

export function ChatInput({ channelId, serverId }: ChatInputProps) {
  const { sendMessage } = useWebSocket();
  const [isSending, setIsSending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { data: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSending(true);
    const message = {
      data: values.data,
      channelId,
      serverId,
      type: MessageTypes.MESSAGE_SENT,
    };

    sendMessage(JSON.stringify(message));

    form.reset();
    setIsSending(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="data"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => console.log("File Picker Here")}
                    className="absolute left-8 top-7 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    placeholder={`Message`}
                    disabled={isSending}
                    className="border-0 border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
