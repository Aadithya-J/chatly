"use client";

import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import Image from "next/image";
import { Hash } from "lucide-react";
import Link from "next/link";

interface ServerButtonProps {
  id: string;
  name: string;
  imageUrl?: string;
  isSelected: boolean;
  firstTextChannelId: string;
}

export function ServerButton({
  name,
  imageUrl,
  id,
  isSelected,
  firstTextChannelId,
}: ServerButtonProps) {
  return (
    <Link href={`/${id}/${firstTextChannelId}`} scroll={false}>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "group relative flex h-12 w-12 items-center justify-center rounded-[24px] bg-[#313338] transition-all duration-200 hover:rounded-[16px]",
                isSelected &&
                  "rounded-[16px] bg-slate-400 text-black dark:bg-slate-600",
              )}
            >
              {imageUrl && imageUrl.length > 0 ? (
                <Image
                  src={imageUrl}
                  alt={name}
                  width={48}
                  height={48}
                  className="h-full w-full rounded-[inherit] object-cover"
                />
              ) : (
                <Hash className="h-5 w-5 text-slate-700 group-hover:text-slate-600 dark:text-zinc-400 dark:group-hover:text-zinc-300" />
              )}
              <div className="absolute left-0 h-0 w-1 rounded-r-full bg-white opacity-0 transition-all duration-200 group-hover:h-5 group-hover:opacity-100" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="border-none bg-black text-white"
          >
            {name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Link>
  );
}
