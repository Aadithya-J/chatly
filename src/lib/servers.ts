import { type Server } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export const getServers = async (): Promise<Server[] | null> => {
  try {
    const session = await auth();
    if (!session?.user) {
      redirect("/login");
    }
    const servers: Server[] =
      (await db.server.findMany({
        where: {
          profileId: session.user.id,
        },
      })) ?? [];

    return servers.length > 0 ? servers : null;
  } catch (err) {
    const error =
      err instanceof Error ? err.message : "An unknown error occurred";
    console.error("[Server Error]:", error);

    return null;
  }
};
