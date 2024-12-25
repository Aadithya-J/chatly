import { api } from "~/trpc/react";

export const useUser = () => {
  const { data, isLoading, isError } = api.server.getUser.useQuery();
  return {
    user: data,
    isLoading,
    isError,
  };
};
