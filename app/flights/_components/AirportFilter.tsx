import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/_components';
import { cn } from '@/_lib/css-utils';
import { CheckIcon, ChevronDownIcon, SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchAirport } from '../_hooks/use-search-airport';
import { Airport } from '@/_types';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function AirportFilter({ label, value, onChange }: Props) {
  const {
    keyword,
    setKeyword,
    data: airports,
    allAirports,
    isLoading,
  } = useSearchAirport();
  const [open, setOpen] = useState(false);
  const selectedAirport = useMemo(
    () => (value ? allAirports?.[value] : null),
    [allAirports, value]
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (airport: Airport) => {
    onChange(airport.code);
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (inputRef.current) {
          const length = inputRef.current.value.length;
          inputRef.current.focus();
          inputRef.current.setSelectionRange(length, length);
        }
      });
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="flex items-center justify-between" variant="outline">
          <div className="flex items-center gap-3">
            <Label>{label}</Label>
            <span className="opacity-50">
              {selectedAirport
                ? `${selectedAirport?.code} - ${selectedAirport?.name}`
                : 'City, Airport'}
            </span>
          </div>
          <ChevronDownIcon className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <div className="mb-1 flex items-center border-b px-2">
          <SearchIcon className="size-4" />
          <Input
            ref={inputRef}
            className="border-none! shadow-none! ring-0! outline-none!"
            type="text"
            placeholder="Search..."
            value={keyword}
            onInput={(e) => setKeyword(e.currentTarget.value)}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>

        {isLoading ? (
          <div className="p-2 text-center text-sm opacity-50">Loading...</div>
        ) : airports?.length ? (
          airports.map((airport) => (
            <div
              key={airport.code}
              className={cn(
                'flex items-center justify-between p-2 text-sm not-last-of-type:border-b',
                airport.code === value ? 'bg-primary/30' : 'hover:bg-gray-100'
              )}
              onClick={() => handleChange(airport)}
            >
              {`${airport.code} - ${airport.name}`}
              {airport.code === value && (
                <CheckIcon className="text-primary size-4" />
              )}
            </div>
          ))
        ) : (
          <div className="p-2 text-center text-sm opacity-50">
            {keyword ? 'No Airports found' : 'Enter a city or airport'}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

