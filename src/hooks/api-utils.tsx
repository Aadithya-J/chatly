import { api } from "~/trpc/react";
import { type Server,type Channel } from "@prisma/client";
export const useServers = (): {
  servers: Server[],
  isLoading: boolean
} => {
  const { data: servers, isLoading } = api.server.getServers.useQuery();
  return { servers: servers ?? [], isLoading };
};

export const useChannels = (serverId: string):{
  channels : {
    text: Channel[] | null,
    voice: Channel[] | null
  }
  isLoading: boolean
} => {
  try{
    const { data: channels, isLoading } = api.server.getChannels.useQuery(
      { serverId },
      { enabled: !!serverId }
    );
    if(channels === undefined || channels === null){
      return { channels: {
        text: null,
        voice: null
      }, isLoading: true };
    }
    return { channels: channels, isLoading: isLoading };
  } catch (err) {
    console.log(err)
    return { channels: {
      text: null,
      voice: null
    }, isLoading: true };
  }
};