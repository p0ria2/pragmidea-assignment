'use client';

import { Button } from '@/_components/button';

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

export default function NumSelector({ value, min, max, onChange }: Props) {
  const clampedValue = Math.max(min ?? value, Math.min(max ?? value, value));

  const handleChange = (value: number) => {
    onChange?.(Math.max(min ?? value, Math.min(max ?? value, value)));
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleChange(clampedValue - 1)}
      >
        -
      </Button>
      <span className="min-w-4 text-center">{clampedValue}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleChange(clampedValue + 1)}
      >
        +
      </Button>
    </div>
  );
}

