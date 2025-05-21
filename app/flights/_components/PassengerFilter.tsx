import { NumSelector } from '@/_components';
import { getPassengerCount, PassengerAgeRange } from '@/_lib/flights-utils';
import { PassengerType } from '@/_types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  value: Record<PassengerType, number>;
  onChange: (passengerType: PassengerType, value: number) => void;
}

export default function PassengerFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(getPassengerCount(value));

  useEffect(() => {
    if (!open) {
      setCount(getPassengerCount(value));
    }
  }, [open, value]);

  return (
    <Popover onOpenChange={setOpen}>
      <PopoverTrigger className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2">
        <span className="text-sm font-medium">
          <span className="inline-block min-w-4">{count}</span> Passenger
          {count > 1 ? 's' : ''}
        </span>
        <ChevronDownIcon className="size-4" />
      </PopoverTrigger>

      <PopoverContent>
        <div className="flex flex-col gap-8 pb-2">
          {Object.values(PassengerType).map((passengerType) => (
            <div
              key={passengerType}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex flex-col gap-1">
                {passengerType}
                <sub className="opacity-50">
                  {PassengerAgeRange[passengerType]}
                </sub>
              </div>
              <NumSelector
                value={value[passengerType]}
                onChange={(value) => onChange(passengerType, value)}
                min={passengerType === PassengerType.ADULTS ? 1 : 0}
              />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

