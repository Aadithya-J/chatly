import { type Session } from "@prisma/client";
import Link from "next/link";
interface HeroProps {
  session: Session | null;
}

export const Hero = ({ session }: HeroProps) => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30" />
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="mb-8 text-6xl font-bold tracking-tight sm:text-8xl">
            Where Conversations
            <span className="block bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Come Alive
            </span>
          </h1>
          <p className="mb-12 max-w-2xl text-xl text-gray-300">
            Experience real-time messaging like never before. Join millions of
            users who trust Chatly for seamless communication in a secure and
            modern environment.
          </p>
          <div className="flex gap-6">
            {session ? (
              <div></div>
            ) : (
              <Link
                href="/api/auth/signin"
                className="rounded-full bg-purple-600 px-8 py-4 font-semibold transition hover:bg-purple-700"
              >
                Get Started
              </Link>
            )}
            {session && (
              <Link
                href="/api/auth/signout"
                className="rounded-full border border-gray-600 px-8 py-4 font-semibold transition hover:bg-white/10"
              >
                Sign out
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
