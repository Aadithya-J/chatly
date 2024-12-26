'use client';

import { ChannelType, type Channel } from '@prisma/client';
import { cn } from '~/lib/utils';
import { Hash, Volume2, Settings } from 'lucide-react';
import { Button } from '~/components/ui/button';
import Link from 'next/link';

interface ChannelButtonProps {
  channel: Channel;
  isSelected: boolean;
  serverId: string;
}

export function ChannelButton({ channel, serverId, isSelected }: ChannelButtonProps) {
  const Icon = channel.type === ChannelType.TEXT ? Hash : Volume2;

  return (
    <Link href={`/${serverId}/${channel.id}`}>
      <Button
        variant="ghost"
        className={cn(
          'group w-full px-2 py-1 h-auto flex items-center justify-start space-x-2 bg-zinc-200/50 hover:bg-zinc-200 dark:bg-[#2c2e32] dark:hover:bg-zinc-700 rounded-sm',
          isSelected && 'bg-zinc-200',
          isSelected && 'dark:bg-zinc-700',
        )}
      >
        <div className="flex w-full items-center">
          <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
          <span className="pl-1 text-sm text-zinc-400 truncate">{channel.name}</span>
          <button className="ml-auto h-4 w-4 text-zinc-400 hover:text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out">
            <Settings />
          </button>
        </div>
      </Button>
    </Link>
  );
}
