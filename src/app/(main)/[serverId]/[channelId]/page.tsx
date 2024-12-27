'use client';
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react'
export default function Page() {
  const params = useParams() ?? {};
  const channelId =  Array.isArray(params.channelId) ? params.channelId[0] ?? '' : params.channelId ?? ''
  const { data: channel } = api.channel.getChannelById.useQuery({ channelId })
  return (
      <div className='flex flex-col gap-4 justify-center items-center bg-zinc-400 dark:bg-zinc-900'>
        {/* <p>Server ID: {params.serverId}</p>
        <p>Channel ID: {params.channelId}</p> */}
        <h1 className='text-3xl'>Welcome to #{channel?.name}</h1>
      </div>
    );
}