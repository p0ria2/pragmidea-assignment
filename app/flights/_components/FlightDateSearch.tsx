import {
  Button,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/_components';
import { cn } from '@/_lib/css-utils';
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
  minDate?: Date;
}

export default function FlightDateSearch({
  label,
  value,
  onChange,
  error,
  minDate,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleChange = (value: Date) => {
    setOpen(false);
    onChange(value ? formatISO(value, { representation: 'date' }) : '');
  };

  return (
    <div className="relative min-w-[250px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="w-full" asChild>
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
                {value ? format(parseISO(value), 'EEE, dd MMM') : 'Select Date'}
              </span>
            </div>

            <CalendarIcon className="text-muted-foreground size-4" />
          </Button>
        </PopoverTrigger>

        {value && (
          <XIcon
            className="absolute top-1/2 right-9 size-4 -translate-y-1/2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
          />
        )}

        <PopoverContent
          className="overflow-hidden p-0"
          data-testid="flight-date-search-popover"
        >
          <Calendar
            className="border-none!"
            locale="en-US"
            value={value ? parseISO(value) : null}
            onChange={handleChange as any}
            minDate={minDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

