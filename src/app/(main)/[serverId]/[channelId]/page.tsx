'use client';
import { useParams } from 'next/navigation'

export default function Page() {
  const params = useParams()

  return (
    <div>
      <p>Server ID: {params.serverId}</p>
      <p>Channel ID: {params.channelId}</p>
    </div>
  )
}