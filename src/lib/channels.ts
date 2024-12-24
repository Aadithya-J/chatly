import { db } from "~/server/db";
import { ChannelType } from "@prisma/client";
import { type Channel } from "@prisma/client";
export const getChannels = async (serverId: string): 
Promise< {text: Channel[] | null,
voice : Channel[] | null} | null> => {
    try {
        if(!serverId){
          return null;
        }
        const serverData = await db.server.findUnique({
            where: { id: serverId },
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
          throw new Error("Server not found");
        }
        const textChannels = serverData.Channel?.filter(
          (channel) => channel.type === ChannelType.TEXT
        );
        const voiceChannels = serverData.Channel?.filter(
          (channel) => channel.type === ChannelType.VOICE
        );
        return {
          text: textChannels,
          voice: voiceChannels,
        }
    } catch (err){
        console.log(err);
        return null;
    }

}
