import { redirect } from "next/navigation";
import { db } from "~/server/db";
export default async function authRedirectLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ serverId: string,channelId: string }>;
}): Promise<React.ReactNode> {
    const channelId = (await params).channelId;
    const channel = await db.channel.findUnique({
        where: {
            id: channelId,
        }
    });

    if(!channel){
        return redirect('/');
    }

    return children;
}