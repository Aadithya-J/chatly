// server/[serverid]/page.tsx
import { db } from "~/server/db";
import { type Server } from "@prisma/client";

export default async function ServerPage({
  params,
}: {
  params: Promise<{ serverId: string }>;
}) {
  const serverId = (await params).serverId;
  const serverData: Server | null = await db.server.findUnique({
    where: { id: serverId },
  });
  if (!serverData) {
    return <div>Server not found</div>;
  }
  return (
    <div>
      <pre>{JSON.stringify(serverData, null, 2)}</pre>
    </div>
  );
}
