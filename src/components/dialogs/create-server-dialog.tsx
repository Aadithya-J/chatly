"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import Image from "next/image";
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
import { useUploadThing } from "~/lib/uploadthing";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      // Clear file selection after successful upload
      setSelectedFile(null);
      setPreviewUrl(null);
    },
    onUploadError: (error: Error) => {
      console.error("Upload failed:", error.message);
      alert("Failed to upload image");
    },
  });

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
      onClose();
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create local preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return objectUrl;
      });
    }
  };

  const onSubmit = async (data: ServerFormData) => {
    try {
      let imageUrl = "";

      if (selectedFile) {
        const uploadResponse = await startUpload([selectedFile]);
        if (!uploadResponse) {
          throw new Error("Upload failed");
        }
        if (uploadResponse?.[0]) {
          imageUrl = uploadResponse[0].url;
        }
      }

      await createServer.mutateAsync({
        name: data.name,
        description: data.description ?? "",
        inviteCode: uuid(),
        image: imageUrl,
      });
    } catch (error) {
      console.error("Error creating server:", error);
      alert("Failed to create server");
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    form.reset();
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-zinc-300 dark:bg-zinc-800 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription>
            Give your server a name, description, and image. You can always
            change these later.
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

            <div className="space-y-4">
              {previewUrl && (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  className="object-cover"
                  fill
                  sizes="160px"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createServer.isPending || isUploading}
            >
              {createServer.isPending || isUploading
                ? "Creating..."
                : "Create Server"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
