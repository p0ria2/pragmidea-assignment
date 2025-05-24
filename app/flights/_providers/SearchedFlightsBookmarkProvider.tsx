'use client';

import { sendRequest } from '@/_lib/http-utils';
import { parseUrlSearchParams, toSearchParams } from '@/_lib/url-utils';
import { Flight, FlightBookmark } from '@/_types';
import { useAuth } from '@/auth/_providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';
import { flightsSearchSchema } from './FlightsSearchProvider';

interface SearchedFlightsBookmarkProviderContextType {
  toggleBookmark: (
    bookmark:
      | {
          isBookmarked: false;
          flight: Flight;
        }
      | {
          isBookmarked: true;
          bookmarkId: FlightBookmark['id'];
          flightId: Flight['id'];
        }
  ) => void;
  searchedFlightsBookmarkMap: Record<FlightBookmark['exId'], FlightBookmark>;
  isSearchedFlightsBookmarkMapLoading: boolean;
  isSearchedFlightsBookmarkPending: Record<Flight['id'], boolean>;
}

const SearchedFlightsBookmarkProviderContext =
  createContext<SearchedFlightsBookmarkProviderContextType | null>(null);

function SearchedFlightsBookmarkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isBookmarkPending, setIsBookmarkPending] = useState<
    Record<Flight['id'], boolean>
  >({});
  const { ensureSignedIn, isSignedIn, isAuthPending } = useAuth();
  const searchParams = useSearchParams();
  const parsedSearchParams = useMemo(
    () => parseUrlSearchParams(searchParams, flightsSearchSchema),
    [searchParams]
  );
  const queryClient = useQueryClient();

  const searchedFlightsBookmarkQuery = useQuery({
    queryKey: ['bookmarks', 'searched-flights', parsedSearchParams],
    queryFn: () =>
      sendRequest<FlightBookmark[]>(
        `/api/me/bookmarks/${toSearchParams(parsedSearchParams!)}`
      ),
    enabled: !isAuthPending && isSignedIn && !!parsedSearchParams,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const searchedFlightsBookmarkMap = useMemo(() => {
    return (searchedFlightsBookmarkQuery.data || []).reduce(
      (acc, bookmark) => {
        acc[bookmark.exId] = bookmark;
        return acc;
      },
      {} as Record<FlightBookmark['exId'], FlightBookmark>
    );
  }, [searchedFlightsBookmarkQuery.data]);

  const createBookmarkFlightMutation = useMutation({
    mutationFn: (flight: Flight) =>
      sendRequest<FlightBookmark>(
        `/api/me/bookmarks/${toSearchParams(parsedSearchParams!)}`,
        {
          method: 'POST',
          body: JSON.stringify(flight),
        }
      ),
    onMutate: async (flight) => {
      setIsBookmarkPending((prev) => ({ ...prev, [flight.id]: true }));

      await queryClient.cancelQueries({
        queryKey: ['bookmarks', 'searched-flights', parsedSearchParams],
      });

      const previousBookmarks = queryClient.getQueryData<FlightBookmark[]>([
        'bookmarks',
        'searched-flights',
        parsedSearchParams,
      ]);

      queryClient.setQueryData(
        ['bookmarks', 'searched-flights', parsedSearchParams],
        (old: FlightBookmark[]) => [...(old || []), { exId: flight.id }]
      );

      return { previousBookmarks };
    },
    onSuccess: (data, flight, context) => {
      queryClient.setQueryData(
        ['bookmarks', 'searched-flights', parsedSearchParams],
        () => [...(context.previousBookmarks || []), data]
      );
    },
    onError: (error, flight, context) => {
      queryClient.setQueryData(
        ['bookmarks', 'searched-flights', parsedSearchParams],
        context?.previousBookmarks
      );
      toast.error((error as Error).message);
    },
    onSettled: (_, error, flight) => {
      setIsBookmarkPending((prev) => ({ ...prev, [flight.id]: false }));
    },
  });

  const deleteBookmarkFlightMutation = useMutation({
    mutationFn: ({
      bookmarkId,
      flightId,
    }: {
      bookmarkId: string;
      flightId: string;
    }) =>
      sendRequest(`/api/me/bookmarks/${bookmarkId}?mode=flight`, {
        method: 'DELETE',
      }),
    onMutate: async ({ bookmarkId, flightId }) => {
      setIsBookmarkPending((prev) => ({ ...prev, [flightId]: true }));

      await queryClient.cancelQueries({
        queryKey: ['bookmarks', 'searched-flights', parsedSearchParams],
      });

      const previousBookmarks = queryClient.getQueryData<FlightBookmark[]>([
        'bookmarks',
        'searched-flights',
        parsedSearchParams,
      ]);

      queryClient.setQueryData(
        ['bookmarks', 'searched-flights', parsedSearchParams],
        (old: FlightBookmark[]) =>
          old.filter((bookmark) => bookmark.id !== bookmarkId)
      );

      return { previousBookmarks };
    },
    onError: (error, bookmarkId, context) => {
      queryClient.setQueryData(
        ['bookmarks', 'searched-flights', parsedSearchParams],
        context?.previousBookmarks
      );
      toast.error((error as Error).message);
    },
    onSettled: (_, error, { flightId }) => {
      setIsBookmarkPending((prev) => ({ ...prev, [flightId]: false }));
    },
  });

  const toggleBookmark = useCallback<
    SearchedFlightsBookmarkProviderContextType['toggleBookmark']
  >(
    async (bookmark) => {
      ensureSignedIn(() => {
        bookmark.isBookmarked
          ? deleteBookmarkFlightMutation.mutate({
              bookmarkId: bookmark.bookmarkId,
              flightId: bookmark.flightId,
            })
          : createBookmarkFlightMutation.mutate(bookmark.flight);
      }, 'You must be signed in to bookmark flights');
    },
    [ensureSignedIn, parsedSearchParams]
  );

  useEffect(() => {
    if (searchedFlightsBookmarkQuery.isFetching) {
      setIsBookmarkPending({});
    }
  }, [searchedFlightsBookmarkQuery.isFetching]);

  return (
    <SearchedFlightsBookmarkProviderContext
      value={{
        toggleBookmark,
        searchedFlightsBookmarkMap,
        isSearchedFlightsBookmarkMapLoading:
          !searchedFlightsBookmarkMap || searchedFlightsBookmarkQuery.isLoading,
        isSearchedFlightsBookmarkPending: isBookmarkPending,
      }}
    >
      {children}
    </SearchedFlightsBookmarkProviderContext>
  );
}

export default SearchedFlightsBookmarkProvider;

export function useSearchedFlightsBookmark() {
  const context = use(SearchedFlightsBookmarkProviderContext);
  if (!context) {
    throw new Error(
      'useSearchedFlightBookmark must be used within a SearchedFlightsBookmarkProvider'
    );
  }

  return context;
}

