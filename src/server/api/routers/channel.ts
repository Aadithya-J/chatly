import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { PrismaClient } from "@prisma/client";
// import { auth } from "~/server/auth";
export const channelRouter = createTRPCRouter({
    getChannelById: protectedProcedure
    .input(z.object({
        channelId: z.string().uuid()
    }))
    .query(async ({ input, ctx }) => {
        const prisma: PrismaClient = ctx.db;
        // const session = await auth();
        // const profileId = session?.user?.id;
        const channelId = input.channelId;
        const channel = await prisma.channel.findUnique({
            where: {
                id: channelId,
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });
        if (!channel) {
            throw new Error("Channel not found");
        }
        return channel;
    }),
    renameChannel: protectedProcedure
    .input(z.object({
        channelId: z.string().uuid(),
        name: z.string().min(1).max(50)
    }))
    .mutation(async ({ input, ctx }) => {
        const prisma: PrismaClient = ctx.db;
        const { channelId, name } = input;
        const channel = await prisma.channel.update({
            where: {
                id: channelId
            },
            data: {
                name: name
            }
        });
        return channel;
    }),
    deleteChannel: protectedProcedure
    .input(z.object({
        channelId: z.string().uuid()
    }))
    .mutation(async ({ input, ctx }) => {
        const prisma: PrismaClient = ctx.db;
        const { channelId } = input;
        
        // Get the channel to find its serverId
        const channel = await prisma.channel.findUnique({
            where: { id: channelId },
            include: { server: true }
        });

        if (!channel) {
            throw new Error("Channel not found");
        }

        // Count channels in the server
        const channelCount = await prisma.channel.count({
            where: {
                serverId: channel.serverId
            }
        });

        if (channelCount <= 1) {
            throw new Error("Cannot delete the last channel in a server");
        }

        await prisma.channel.delete({
            where: {
                id: channelId
            }
        });
        return null;
    }),
})