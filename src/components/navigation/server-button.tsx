'use client';

import { cn } from '~/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import Image from 'next/image';
import { Hash } from 'lucide-react';

interface ServerButtonProps {
  id: string;
  name: string;
  imageUrl?: string;
  isSelected: boolean;
  onClick: () => void;
}

export function ServerButton({name, imageUrl, isSelected, onClick }: ServerButtonProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              'w-12 h-12 rounded-[24px] flex items-center justify-center bg-[#313338] hover:rounded-[16px] transition-all duration-200 group relative',
              isSelected && 'bg-primary rounded-[16px]'
            )}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                width={48}
                height={48}
                className="rounded-[inherit] w-full h-full object-cover"
              />
            ) : (
              <Hash className="w-5 h-5 text-zinc-400 group-hover:text-zinc-300" />
            )}
            <div className="absolute left-0 w-1 bg-white rounded-r-full transition-all duration-200 opacity-0 h-0 group-hover:h-5 group-hover:opacity-100" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-black text-white border-none">
          {name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}