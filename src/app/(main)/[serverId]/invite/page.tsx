"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Copy as CopyIcon } from "lucide-react";
import { useToast } from "~/hooks/use-toast";

export default function InvitePage() {
  const params = useParams() ?? {};
  const serverId = Array.isArray(params.serverId)
    ? (params.serverId[0] ?? "")
    : (params.serverId ?? "");
  const { data: inviteCode } = api.server.getInviteCode.useQuery({ serverId });

  const { toast } = useToast();
  const copyInviteCode = () => {
    if (inviteCode) {
      void navigator.clipboard.writeText(inviteCode);
      toast({ title: "Copied invite code to clipboard" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="mb-6 text-3xl font-bold">Invite People to Your Server</h1>
      <div className="w-full max-w-md">
        <Input
          value={inviteCode ?? "Loading..."}
          readOnly
          className="mb-4"
          placeholder="Invite Code"
        />
        <Button onClick={copyInviteCode} className="w-full">
          <CopyIcon className="mr-2" />
          Copy Invite Code
        </Button>
      </div>
    </div>
  );
}
