'use client';

import { Button } from '@/_components';
import { cn } from '@/_lib/css-utils';
import { Flight, FlightBookmark } from '@/_types';
import { format, parseISO } from 'date-fns';
import { BookmarkIcon } from 'lucide-react';
import { useSearchedFlightsBookmark } from '../_providers/SearchedFlightsBookmarkProvider';

interface Props {
  flight: Flight;
}

export default function FlightCard({ flight }: Props) {
  const departureDate = parseISO(flight.departure.at);
  const arrivalDate = parseISO(flight.arrival.at);
  const {
    toggleBookmark,
    searchedFlightsBookmarkMap,
    isSearchedFlightsBookmarkMapLoading,
    isSearchedFlightsBookmarkPending,
  } = useSearchedFlightsBookmark();
  const bookmark = searchedFlightsBookmarkMap?.[flight.id] as
    | FlightBookmark
    | undefined;
  const isBookmarked = !!bookmark;

  const handleToggleBookmark = () => {
    toggleBookmark(
      isBookmarked
        ? {
            isBookmarked,
            bookmarkId: bookmark!.id,
            flightId: flight.id,
          }
        : {
            isBookmarked,
            flight,
          }
    );
  };

  return (
    <div className="bg-primary/80 text-primary-foreground relative flex gap-4 rounded-lg border p-4 shadow">
      <div className="flex flex-1 justify-between gap-6 border-r border-dashed pr-10 pl-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs opacity-70">
            {format(departureDate, 'EEE, dd MMM')}
          </span>
          <span className="font-medium">{format(departureDate, 'HH:mm')}</span>
          <span>{flight.departure.iata}</span>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t" />
          <div className="relative px-6 text-nowrap">
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-70">
              {flight.airline}
            </span>

            <span className="rounded-2xl bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-800">
              {flight.duration}
            </span>

            {flight.stops.length ? (
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-70">
                {flight.stops.length} stop{flight.stops.length > 1 ? 's' : ''}{' '}
                at {flight.stops.join(', ')}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs opacity-70">
            {format(arrivalDate, 'EEE, dd MMM')}
          </span>
          <span className="font-medium">{format(arrivalDate, 'HH:mm')}</span>
          <span>{flight.arrival.iata}</span>
        </div>
      </div>

      <div className="flex flex-col px-4 md:flex-[0_0_160px]">
        <span className="flex-1 text-lg font-semibold">
          {flight.currency} {flight.price}
        </span>
        <Button variant="secondary">Select</Button>
      </div>

      <Button
        className="absolute top-1 right-1 cursor-pointer rounded-full"
        variant="link"
        size="icon"
        type="button"
        disabled={
          isSearchedFlightsBookmarkMapLoading ||
          isSearchedFlightsBookmarkPending[flight.id]
        }
        onClick={handleToggleBookmark}
      >
        <BookmarkIcon
          className={cn({
            'fill-yellow-400 text-yellow-500': isBookmarked,
            'fill-white text-white': !isBookmarked,
          })}
        />
      </Button>
    </div>
  );
}

