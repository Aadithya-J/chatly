'use client';

import { ChannelType, type Channel } from '@prisma/client';
import { cn } from '~/lib/utils';
import { Hash, Volume2 } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface ChannelButtonProps {
  channel: Channel;
  isSelected: boolean;
  onClick: () => void;
}

export function ChannelButton({ channel, isSelected, onClick }: ChannelButtonProps) {
  const Icon = channel.type === ChannelType.TEXT ? Hash : Volume2;
  
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        'w-full px-2 py-1 h-auto flex items-center justify-start space-x-2 hover:bg-[#bebebe] rounded-sm',
        isSelected && 'bg-[#ffffff]'
      )}
    >
      <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
      <span className="text-sm text-zinc-400 truncate">
        {channel.name}
      </span>
    </Button>
  );
}