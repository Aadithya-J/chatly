import { type Server } from "@prisma/client";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerError';
  }
}

export const getServers = async (): Promise<{
  servers: Server[] | null;
  error: string | null;
}> => {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new ServerError("User not authenticated");
    }
    const servers: Server[] = await db.server.findMany({
      where: {
        profileId: session.user.id,
      },
    }) ?? [];

    return {
      servers: servers.length > 0 ? servers : null,
      error: null
    };

  } catch (err) {
    const error = err instanceof Error ? err.message : "An unknown error occurred";
    console.error("[Server Error]:", error);
    
    return {
      servers: null,
      error
    };
  }
};