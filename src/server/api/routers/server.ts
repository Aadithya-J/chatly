import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import type { PrismaClient } from '@prisma/client';
import { auth } from '~/server/auth';

export const serverRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().max(200, 'Description is too long').optional(),
        image: z.string().url('Invalid image URL'),
        inviteCode: z.string().min(6, 'Invite code must be at least 6 characters long'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, image, inviteCode } = input;

      const prisma: PrismaClient = ctx.db;
      const session = await auth()
      const profileId = session?.user?.id;;
      const userExists = await prisma.user.findUnique({
        where: { id: profileId },
      });

      if (!userExists || !profileId) {
        throw new Error('User not found');
      }
      // Create the server with the default channel
      const server = await prisma.server.create({
        data: {
          name,
          image,
          inviteCode,
          profileId,
          Channel: {
            create: [{
              name: 'general',
              profileId,
            }],
          },
        },
        include: {
          Channel: true,
        },
      });

      return server;
    }),
});
