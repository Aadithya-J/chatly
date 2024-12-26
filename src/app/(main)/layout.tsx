'use client';

import { useUser } from "~/hooks/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingScreen } from "~/components/loading-screen";

export default function RedirectLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const userData = useUser();
  const router = useRouter();
  const [isUserVerified, setIsUserVerifiedRendered] = useState(false);

  useEffect(() => {
    setIsUserVerifiedRendered(true);
  }, []);

  useEffect(() => {
    if (!userData.isLoading && !userData?.user) {
      router.push('/');
    }
  }, [userData.isLoading, userData.user, router]);

  if (userData.isLoading || !userData?.user) {
    return <LoadingScreen />;
  }

  return isUserVerified ? <div className="h-full bg-zinc-200 dark:bg-zinc-800">{children}</div> : null;
}
