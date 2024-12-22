import type { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export const getProfile = async (): Promise<NextResponse | User | null> => {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await db.user.findUnique({
            where: {
                email: session.user.email,
            },
        });

        if (user) {
            return user;
        } else {
            return new NextResponse("Not Found", { status: 404 });
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};