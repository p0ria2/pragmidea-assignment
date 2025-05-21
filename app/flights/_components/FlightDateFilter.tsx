import {
  Button,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/_components';
import { cn } from '@/_lib/css-utils';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { format, formatISO, parseISO } from 'date-fns';
import { CalendarIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Props {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
  error?: boolean;
}

export default function FlightDateFilter({
  label,
  value,
  onChange,
  error,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleChange = (value: Date) => {
    setOpen(false);
    onChange(value ? formatISO(value, { representation: 'date' }) : '');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="min-w-[250px]" asChild>
        <Button
          className={cn(
            'flex items-center justify-between',
            error && 'border-red-500'
          )}
          variant="outline"
        >
          <div className="flex items-center gap-3">
            <Label>{label}</Label>
            <span className={cn(value ? 'opacity-100' : 'opacity-50')}>
              {value ? format(parseISO(value), 'dd MMM yyyy') : 'Select Date'}
            </span>
          </div>

          <CalendarIcon className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverAnchor className="relative">
        {value && (
          <XIcon
            className="absolute -top-[33px] right-[34px] size-4 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
          />
        )}
      </PopoverAnchor>

      <PopoverContent className="overflow-hidden p-0">
        <Calendar
          className="border-none!"
          value={value ? parseISO(value) : null}
          onChange={handleChange as any}
          minDate={new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}

