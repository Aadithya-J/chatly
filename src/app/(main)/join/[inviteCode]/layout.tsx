import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
export default async function authRedirectLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}): Promise<React.ReactNode> {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }
  return <div className="h-full bg-zinc-400 dark:bg-zinc-900">{children}</div>;
}
