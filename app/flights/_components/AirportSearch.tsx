import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  VirtualList,
  VirtualListRef,
} from '@/_components';
import { cn } from '@/_lib/css-utils';
import { Airport } from '@/_types';
import {
  CheckIcon,
  PlaneLandingIcon,
  PlaneTakeoffIcon,
  SearchIcon,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchAirport } from '../_hooks/use-search-airport';

interface Props {
  label: string;
  value: string;
  type: 'takeoff' | 'landing';
  onChange: (value: string) => void;
  error?: boolean;
}

export default function AirportSearch({
  label,
  value,
  onChange,
  error,
  type,
}: Props) {
  const {
    keyword,
    setKeyword,
    data: airports,
    allAirports,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useSearchAirport();
  const [open, setOpen] = useState(false);
  const selectedAirport = useMemo(
    () => (value ? allAirports?.[value] : null),
    [allAirports, value]
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const virtualizedListRef = useRef<VirtualListRef>(null);
  const Icon = type === 'takeoff' ? PlaneTakeoffIcon : PlaneLandingIcon;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.currentTarget.value);
    virtualizedListRef.current?.resetScroll();
  };

  const handleChange = (airport: Airport) => {
    setOpen(false);
    onChange(airport.code);
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
        <Button
          className={cn(
            'flex items-center justify-between',
            error && 'border-red-500'
          )}
          variant="outline"
        >
          <div className="flex items-center gap-3">
            <Label>{label}</Label>
            <span
              className={cn(selectedAirport ? 'opacity-100' : 'opacity-50')}
            >
              {selectedAirport
                ? `${selectedAirport?.code} - ${selectedAirport?.name}`
                : 'Select Airport'}
            </span>
          </div>
          <Icon className="text-muted-foreground size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent data-testid="airport-search-popover">
        <div className="mb-1 flex items-center border-b px-2">
          <SearchIcon className="size-4" />
          <Input
            ref={inputRef}
            className="border-none! shadow-none! ring-0! outline-none!"
            type="text"
            placeholder="Search..."
            value={keyword}
            onChange={handleInputChange}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>

        {isLoading ? (
          <div className="p-2 text-center text-sm opacity-50">Loading...</div>
        ) : airports?.length ? (
          <VirtualList
            ref={virtualizedListRef}
            className="max-h-[300px] overflow-y-auto"
            loadMore={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            disabled={isLoading || !hasNextPage}
          >
            {airports.map((airport, idx) => (
              <div
                key={airport.code}
                className={cn(
                  'flex items-center justify-between p-2 text-sm',
                  airport.code === value
                    ? 'bg-primary/30'
                    : 'hover:bg-gray-100',
                  idx !== airports.length - 1 && 'border-b'
                )}
                onClick={() => handleChange(airport)}
              >
                {`${airport.code} - ${airport.name}`}
                {airport.code === value && (
                  <CheckIcon className="text-primary size-4" />
                )}
              </div>
            ))}
          </VirtualList>
        ) : (
          <div className="p-2 text-center text-sm opacity-50">
            {keyword ? 'No Airports found' : 'Enter airport name'}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

