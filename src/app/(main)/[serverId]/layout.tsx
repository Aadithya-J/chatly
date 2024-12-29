import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { SwitchServerLayout } from "~/components/switch-server-layout";
export default async function authRedirectLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ serverId: string }>;
}): Promise<React.ReactNode> {
    const session = await auth();
    if(!session?.user){
        redirect('/')
    }
    const serverId = (await params).serverId;
    const server = await db.server.findUnique({
        where: {
          id: serverId,
        },
        include: {
          members: {
            where: {
              id: session.user.id,
            },
          },
        },
      });
    if(!server){
      redirect('/')
    }
    return (
    <div className="h-full dark:bg-zinc-900 bg-zinc-400">
      <SwitchServerLayout>
        {children}
      </SwitchServerLayout>
    </div>
    );
}