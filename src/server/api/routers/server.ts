import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { PrismaClient } from "@prisma/client";
import { auth } from "~/server/auth";
import { ChannelType, MemberRole } from "@prisma/client";
export const serverRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().max(200, "Description is too long").optional(),
        image: z.string().url("Invalid image URL"),
        inviteCode: z
          .string()
          .min(6, "Invite code must be at least 6 characters long"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { name, image, inviteCode } = input;

      const prisma: PrismaClient = ctx.db;
      const session = await auth();
      const profileId = session?.user?.id;
      const userExists = await prisma.user.findUnique({
        where: { id: profileId },
      });

      if (!userExists || !profileId) {
        throw new Error("User not found");
      }
      // Create the server with the default channel
      const server = await prisma.server.create({
        data: {
          name,
          image,
          inviteCode,
          profileId,
          Channel: {
            create: [
              {
                name: "general",
                profileId,
              },
            ],
          },
          Member: {
            create: {
              profileId,
              role: MemberRole.ADMIN,
            },
          },
        },
        include: {
          Channel: true,
        },
      });

      return server;
    }),

    getServers: protectedProcedure.query(async ({ ctx }) => {
      const session = await auth();
      if (!session?.user) {
        throw new Error("Unauthorized");
      }
    
      const servers = await ctx.db.server.findMany({
        where: {
          profileId: session.user.id,
        },
        include: {
          Channel: {
            where: {
              type: 'TEXT', // Ensure only text channels are fetched
            },
            take: 1, // Fetch only the first channel
            orderBy: { name: "asc" },
          },
        },
      });
    
      return servers.map(server => ({
        ...server,
        firstTextChannel: server.Channel?.[0] ?? null, 
      }));
    }),
    

  getChannels: protectedProcedure
    .input(z.object({ serverId: z.string() }))
    .query(async ({ ctx, input }) => {
      const serverData = await ctx.db.server.findUnique({
        where: { id: input.serverId },
        include: {
          Channel: {
            orderBy: {
              name: "asc",
            },
            select: {
              id: true,
              name: true,
              type: true,
              profileId: true,
              serverId: true,
            },
          },
        },
      });

      if (!serverData) {
        console.log("server not found");
        return null;
      }

      return {
        text: serverData.Channel?.filter(
          (channel) => channel.type === ChannelType.TEXT
        ),
        voice: serverData.Channel?.filter(
          (channel) => channel.type === ChannelType.VOICE
        ),
      };
    }),
});
