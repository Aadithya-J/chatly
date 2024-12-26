import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
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
    const member = await db.member.findFirst({
        where: {
            profileId: session.user.id,
            serverId: serverId
        }
    })
    if(!member){
      redirect('/')
    }
    return (
    <div className="h-full dark:bg-zinc-900 bg-zinc-400">
      {children}
    </div>
    );
}