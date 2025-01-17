"use client";
import { useRouter, useParams } from "next/navigation";
import JoinServerDialog from "~/components/dialogs/join-server-dialog";
import { api } from "~/trpc/react";
export default function ChannelPage() {
  const params = useParams() ?? {};
  const inviteCode = Array.isArray(params.inviteCode)
    ? (params.inviteCode[0] ?? "")
    : (params.inviteCode ?? "");
  const router = useRouter();
  const onClose = () => {
    router.push("/", { scroll: false });
  };
  const { data: server } = api.server.getServerByInviteCode.useQuery({
    inviteCode,
  });
  if (!server) {
    return <div>server does not exist.</div>;
  }
  return (
    <JoinServerDialog
      isOpen
      onClose={onClose}
      serverName={server.name}
      //TODO add imageURL to servers schema and creation
      imageUrl="imageUrl"
      inviteCode={inviteCode}
    />
  );
}
