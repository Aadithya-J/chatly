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
    })
})