import { Button } from '@/_components';
import { distinct } from '@/_lib/array-utils';
import { cn } from '@/_lib/css-utils';
import { Flight, FlightBookmark } from '@/_types';
import { format } from 'date-fns';
import { BookmarkIcon } from 'lucide-react';
import { memo } from 'react';

interface Props {
  flight: Flight;
  bookmark?: FlightBookmark;
  bookmarkDisabled?: boolean;
  onToggleBookmark: () => void;
}

const FlightCard = memo(
  ({ flight, bookmark, bookmarkDisabled, onToggleBookmark }: Props) => {
    const isBookmarked = !!bookmark;

    return (
      <div className="bg-primary/80 text-primary-foreground relative flex gap-4 rounded-lg border p-4 shadow">
        <div className="flex flex-1 flex-col gap-6 border-r border-dashed pr-10 pl-4">
          {flight.itineraries?.map((itinerary, index) => (
            <div
              key={`${flight.id}-${index}`}
              className={cn('flex justify-between gap-6', {
                'border-b border-dashed pb-6':
                  index < flight.itineraries.length - 1,
              })}
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs opacity-70">
                  {format(itinerary.departure.at, 'EEE, dd MMM')}
                </span>
                <span
                  className="font-medium"
                  data-testid="flight-card-departure-time"
                >
                  {format(itinerary.departure.at, 'HH:mm')}
                </span>
                <span>{itinerary.departure.iata}</span>
              </div>

              <div className="relative flex flex-1 items-center justify-center">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t" />
                <div className="relative px-6 text-nowrap">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-70">
                    {distinct(itinerary.airlines).join(', ')}
                  </span>

                  <span
                    className="rounded-2xl bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-800"
                    data-testid="flight-card-duration"
                  >
                    {itinerary.duration}
                  </span>

                  {itinerary.stops.length ? (
                    <span
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs opacity-70"
                      data-testid="flight-card-stops"
                    >
                      {itinerary.stops.length} stop
                      {itinerary.stops.length > 1 ? 's' : ''} at{' '}
                      {itinerary.stops.join(', ')}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-xs opacity-70">
                  {format(itinerary.arrival.at, 'EEE, dd MMM')}
                </span>
                <span className="font-medium">
                  {format(itinerary.arrival.at, 'HH:mm')}
                </span>
                <span>{itinerary.arrival.iata}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-center gap-2 px-2 py-0 md:flex-[0_0_160px]">
          <span
            className="text-xl font-semibold"
            data-testid="flight-card-price"
          >
            {flight.currency} {flight.price}
          </span>
          <Button variant="secondary">Select</Button>
        </div>

        <Button
          className="absolute top-1 right-1 cursor-pointer rounded-full"
          variant="link"
          size="icon"
          type="button"
          disabled={bookmarkDisabled}
          onClick={onToggleBookmark}
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
);

export default FlightCard;

