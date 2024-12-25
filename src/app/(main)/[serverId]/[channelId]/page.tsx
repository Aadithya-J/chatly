'use client';
import { useParams, useRouter } from 'next/navigation'
import { LoadingScreen } from '~/components/loading-screen';
import { useUser } from '~/hooks/user';
import { useEffect } from 'react';

export default function Page() {
  const params = useParams()
  const data = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (!data.isLoading && !data?.user) {
      router.push('/');
    }
  }, [data.isLoading, data.user, router]);

  if(data.isLoading){
    return <LoadingScreen />
  }

  return (
      <div>
        <p>Server ID: {params.serverId}</p>
        <p>Channel ID: {params.channelId}</p>
      </div>
    );
}