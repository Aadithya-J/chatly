import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { Hero } from "~/components/landing/hero";
import { Features } from "~/components/landing/features";
import { type Session } from "@prisma/client";
export default async function Home() {
  const session = (await auth()) as Session | null;
  return (
    <HydrateClient>
      <main className="min-h-screen bg-[#1a1b1e] text-white">
        <Hero session={session} />
        <Features />
      </main>
    </HydrateClient>
  );
}
