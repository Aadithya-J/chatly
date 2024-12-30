"use client";

import { useFirstChannelId } from "~/hooks/api-utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ServerRedirect() {
  const router = useRouter();
  const params = useParams() ?? {};
  const serverId = Array.isArray(params.serverId)
    ? (params.serverId[0] ?? "")
    : (params.serverId ?? "");
  const { firstChannelId, isLoading, isError } = useFirstChannelId(serverId);
  useEffect(() => {
    if (!isLoading && !isError && firstChannelId) {
      router.push(`/${serverId}/${firstChannelId}`, { scroll: false });
    }
  }, [firstChannelId, serverId, isLoading, isError, router]);

  if (isError) {
    return <h2>Error loading channels</h2>;
  }
  return <h2>Hello World!</h2>;
}
