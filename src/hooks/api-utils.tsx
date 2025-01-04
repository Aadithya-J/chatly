import { api } from "~/trpc/react";
import { type Server, type Channel } from "@prisma/client";
export const useServers = (): {
  serversData: {
    server: Server;
    firstTextChannelId: string;
  }[];
  isLoading: boolean;
} => {
  const { data: servers, isLoading } = api.server.getServers.useQuery();
  if (servers === undefined || servers === null) {
    return { serversData: [], isLoading };
  }
  return {
    serversData:
      servers?.map((server) => ({
        server,
        firstTextChannelId: server.channels?.[0]?.id ?? "",
      })) ?? [],
    isLoading,
  };
};

export const useChannels = (
  serverId: string,
): {
  channels: {
    text: Channel[] | null;
    voice: Channel[] | null;
  };
  isLoading: boolean;
} => {
  try {
    const { data: channels, isLoading } = api.server.getChannels.useQuery(
      { serverId },
      { enabled: !!serverId },
    );
    if (channels === undefined || channels === null) {
      return {
        channels: {
          text: null,
          voice: null,
        },
        isLoading: true,
      };
    }
    return { channels: channels, isLoading: isLoading };
  } catch (err) {
    console.log(err);
    return {
      channels: {
        text: null,
        voice: null,
      },
      isLoading: true,
    };
  }
};
export const useFirstChannelId = (
  serverId: string,
): {
  firstChannelId: string;
  isLoading: boolean;
  isError: boolean;
} => {
  try {
    if (!serverId) {
      return {
        firstChannelId: "",
        isLoading: false,
        isError: false,
      };
    }
    const {
      data: firstChannelId,
      isLoading,
      isError,
    } = api.server.getFirstChannelId.useQuery({ serverId });
    return {
      firstChannelId: firstChannelId ?? "",
      isLoading,
      isError,
    };
  } catch (err) {
    console.log(err);
    return {
      firstChannelId: "",
      isLoading: true,
      isError: true,
    };
  }
};
