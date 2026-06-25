'use client';

import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center rounded-md border border-input w-fit">
      <Button
        variant="ghost"
        size="icon-sm"
        className="h-8 w-8 rounded-none border-r border-input"
        onClick={onDecrease}
        disabled={disabled || quantity <= min}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-8 text-center text-sm font-medium">
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        className="h-8 w-8 rounded-none border-l border-input"
        onClick={onIncrease}
        disabled={disabled || quantity >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
