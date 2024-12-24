import { api } from "~/trpc/react";

export const useServers = () => {
  const { data: servers, isLoading } = api.server.getServers.useQuery();
  return { servers: servers ?? [], isLoading };
};

export const useChannels = (serverId: string) => {
  try{
    const { data: channels, isLoading } = api.server.getChannels.useQuery(
      { serverId },
      { enabled: !!serverId }
    );
    return { channels, isLoading };
  } catch (err) {
    console.log(err)
  }
};