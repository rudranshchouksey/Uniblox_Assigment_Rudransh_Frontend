'use client';

import { Badge } from '@/components/ui/badge';

interface CartBadgeProps {
  itemCount: number;
}

export function CartBadge({ itemCount }: CartBadgeProps) {
  if (itemCount <= 0) return null;
  
  return (
    <Badge 
      variant="destructive" 
      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
    >
      {itemCount}
    </Badge>
  );
}
