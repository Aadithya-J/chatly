'use client';

import { useFirstChannelId } from "~/hooks/api-utils"
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from "react";
export default function Page() {
  console.log("Page")
  const params = useParams()
  const serverId = Array.isArray(params.serverId) ? params.serverId[0] ?? '' : params.serverId ?? ''
  const { firstChannelId, isLoading, isError } = useFirstChannelId(serverId)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isError && firstChannelId) {
      router.push(`/${serverId}/${firstChannelId}`)
    }
  }, [firstChannelId, serverId, isLoading, isError, router])

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>Error loading channels</h2>;
  }

  return <h2>Hello World!</h2>
}
