'use client';

import VirtualList, { VirtualListRef } from '@/_components/VirtualList';
import { PlaneTakeoff } from 'lucide-react';
import { useEffect, useRef } from 'react';
import useInfiniteFlights from '../_hooks/use-infinite-flights';
import { useSearchedFlightsBookmark } from '../_providers/SearchedFlightsBookmarkProvider';
import FlightCard from './FlightCard';

export default function FlightsList() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteFlights({
      limit: 10,
    });
  const virtualizedListRef = useRef<VirtualListRef>(null);

  const {
    toggleBookmark,
    searchedFlightsBookmarkMap,
    isSearchedFlightsBookmarkMapLoading,
    isSearchedFlightsBookmarkPending,
  } = useSearchedFlightsBookmark();

  useEffect(() => {
    if (!isLoading) {
      virtualizedListRef.current?.resetScroll();
    }
  }, [isLoading]);

  return (
    <VirtualList
      ref={virtualizedListRef}
      className="px-4"
      rootMode="viewport"
      loadMore={() => fetchNextPage()}
      isLoading={isLoading || isFetchingNextPage}
      disabled={isLoading || !hasNextPage}
    >
      {!isLoading && data.length === 0 ? (
        <div className="flex items-center justify-center gap-2 p-2 text-center text-sm opacity-50">
          No flights found <PlaneTakeoff className="size-5 opacity-50" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data.map((flight) => {
            const bookmark = searchedFlightsBookmarkMap?.[flight.id];
            const isBookmarked = !!bookmark;

            return (
              <FlightCard
                key={flight.id}
                flight={flight}
                bookmark={bookmark}
                bookmarkDisabled={
                  isSearchedFlightsBookmarkMapLoading ||
                  isSearchedFlightsBookmarkPending[flight.id]
                }
                onToggleBookmark={() =>
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
                  )
                }
              />
            );
          })}
        </div>
      )}
    </VirtualList>
  );
}

