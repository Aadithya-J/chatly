"use client";
import { useRouter, useParams } from "next/navigation";
import JoinServerDialog from "~/components/dialogs/join-server-dialog";
export default function ChannelPage() {
  const params = useParams() ?? {};
  const inviteCode = Array.isArray(params.inviteCode)
    ? (params.inviteCode[0] ?? "")
    : (params.inviteCode ?? "");
  const router = useRouter();
  const onClose = () => {
    router.push("/", { scroll: false });
  };
  return (
    <JoinServerDialog
      isOpen={true}
      onClose={onClose}
      serverName="serverName"
      imageUrl="imageUrl"
      inviteCode={inviteCode}
    />
  );
}
