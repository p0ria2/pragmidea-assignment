'use client';

import { sendRequest } from '@/_lib/http-utils';
import { toSearchParams } from '@/_lib/navigation-utils';
import { BookmarkFlightsSearch, FlightsSearch } from '@/_types';
import { useQuery } from '@tanstack/react-query';
import { formatISO } from 'date-fns';
import { createContext, use, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

interface FlightsBookmarkContextType {
  toggleBookmark: (bookmark: FlightsSearch, isBookmarked: boolean) => void;
  bookmarkFlightsSearchMap: Record<
    BookmarkFlightsSearch['searchParams'],
    BookmarkFlightsSearch
  >;
  isBookmarkFlightsSearchMapLoading: boolean;
}

const FlightsBookmarkContext = createContext<FlightsBookmarkContextType | null>(
  null
);

function FlightsBookmarkProvider({ children }: { children: React.ReactNode }) {
  const departureAt = formatISO(new Date(), { representation: 'date' });

  const bookmarkFlightsSearchQuery = useQuery({
    queryKey: ['bookmarks', 'flights-search', departureAt],
    queryFn: () =>
      sendRequest<BookmarkFlightsSearch[]>(
        `/api/me/bookmarks?departureAt=${departureAt}`
      ),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const bookmarkFlightsSearchMap = useMemo(() => {
    return (bookmarkFlightsSearchQuery.data || []).reduce(
      (acc, bookmark) => {
        acc[bookmark.searchParams] = bookmark;
        return acc;
      },
      {} as Record<BookmarkFlightsSearch['searchParams'], BookmarkFlightsSearch>
    );
  }, [bookmarkFlightsSearchQuery.data]);

  const toggleBookmark = useCallback(
    async (bookmark: FlightsSearch, isBookmarked: boolean) => {
      try {
        await sendRequest('/api/me/bookmarks', {
          method: 'POST',
          body: JSON.stringify({
            searchParams: toSearchParams(bookmark),
            departureAt: bookmark.departureDate,
          }),
        });
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
    []
  );

  return (
    <FlightsBookmarkContext
      value={{
        toggleBookmark,
        bookmarkFlightsSearchMap,
        isBookmarkFlightsSearchMapLoading:
          !bookmarkFlightsSearchMap || bookmarkFlightsSearchQuery.isLoading,
      }}
    >
      {children}
    </FlightsBookmarkContext>
  );
}

export default FlightsBookmarkProvider;

export function useFlightsBookmark() {
  const context = use(FlightsBookmarkContext);
  if (!context) {
    throw new Error(
      'useFlightsBookmark must be used within a FlightsBookmarkProvider'
    );
  }

  return context;
}

