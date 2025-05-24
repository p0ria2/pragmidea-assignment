'use client';

import { sendRequest } from '@/_lib/http-utils';
import { toSearchParams } from '@/_lib/url-utils';
import { FlightsSearch, FlightsSearchBookmark } from '@/_types';
import { useAuth } from '@/auth/_providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatISO } from 'date-fns';
import { createContext, use, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

interface FlightsSearchBookmarkContextType {
  toggleBookmark: (bookmark: FlightsSearch, isBookmarked: boolean) => void;
  flightsSearchBookmarkMap: Record<
    FlightsSearchBookmark['searchParams'],
    FlightsSearchBookmark
  >;
  isFlightsSearchBookmarkMapLoading: boolean;
  isFlightsSearchBookmarkPending: boolean;
}

const FlightsSearchBookmarkContext =
  createContext<FlightsSearchBookmarkContextType | null>(null);

function FlightsSearchBookmarkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ensureSignedIn, isSignedIn, isAuthPending } = useAuth();
  const departureAt = formatISO(new Date(), { representation: 'date' });
  const queryClient = useQueryClient();

  const flightsSearchBookmarkQuery = useQuery({
    queryKey: ['bookmarks', 'flights-search', departureAt],
    queryFn: () =>
      sendRequest<FlightsSearchBookmark[]>(
        `/api/me/bookmarks?departureAt=${departureAt}`
      ),
    enabled: !isAuthPending && isSignedIn,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const flightsSearchBookmarkMap = useMemo(() => {
    return (flightsSearchBookmarkQuery.data || []).reduce(
      (acc, bookmark) => {
        acc[bookmark.searchParams] = bookmark;
        return acc;
      },
      {} as Record<FlightsSearchBookmark['searchParams'], FlightsSearchBookmark>
    );
  }, [flightsSearchBookmarkQuery.data]);

  const createBookmarkFlightsSearchMutation = useMutation({
    mutationFn: (bookmark: FlightsSearch) =>
      sendRequest<FlightsSearchBookmark>('/api/me/bookmarks', {
        method: 'POST',
        body: JSON.stringify({
          searchParams: toSearchParams(bookmark),
          departureAt,
        }),
      }),
    onMutate: async (bookmark) => {
      await queryClient.cancelQueries({
        queryKey: ['bookmarks', 'flights-search', departureAt],
      });

      const previousBookmarks = queryClient.getQueryData<
        FlightsSearchBookmark[]
      >(['bookmarks', 'flights-search', departureAt]);

      queryClient.setQueryData(
        ['bookmarks', 'flights-search', departureAt],
        (old: FlightsSearchBookmark[]) => [
          ...(old || []),
          { searchParams: toSearchParams(bookmark), departureAt },
        ]
      );

      return { previousBookmarks };
    },
    onSuccess: (data, bookmark, context) => {
      queryClient.setQueryData(
        ['bookmarks', 'flights-search', departureAt],
        () => [...(context.previousBookmarks || []), data]
      );
    },
    onError: (error, bookmark, context) => {
      queryClient.setQueryData(
        ['bookmarks', 'flights-search', departureAt],
        context?.previousBookmarks
      );
      toast.error((error as Error).message);
    },
  });

  const deleteBookmarkFlightsSearchMutation = useMutation({
    mutationFn: (bookmarkId: string) =>
      sendRequest(`/api/me/bookmarks/${bookmarkId}?mode=flights-search`, {
        method: 'DELETE',
      }),
    onMutate: async (bookmarkId) => {
      await queryClient.cancelQueries({
        queryKey: ['bookmarks', 'flights-search', departureAt],
      });

      const previousBookmarks = queryClient.getQueryData<
        FlightsSearchBookmark[]
      >(['bookmarks', 'flights-search', departureAt]);

      queryClient.setQueryData(
        ['bookmarks', 'flights-search', departureAt],
        (old: FlightsSearchBookmark[]) =>
          (old || []).filter((bookmark) => bookmark.id !== bookmarkId)
      );

      return { previousBookmarks };
    },
    onError: (error, bookmarkId, context) => {
      queryClient.setQueryData(
        ['bookmarks', 'flights-search', departureAt],
        context?.previousBookmarks
      );
      toast.error((error as Error).message);
    },
  });

  const toggleBookmark = useCallback(
    async (bookmark: FlightsSearch, isBookmarked: boolean) => {
      ensureSignedIn(() => {
        isBookmarked
          ? deleteBookmarkFlightsSearchMutation.mutate(
              flightsSearchBookmarkMap[toSearchParams(bookmark)].id
            )
          : createBookmarkFlightsSearchMutation.mutate(bookmark);
      }, 'You must be signed in to bookmark flights');
    },
    [ensureSignedIn, flightsSearchBookmarkMap]
  );

  return (
    <FlightsSearchBookmarkContext
      value={{
        toggleBookmark,
        flightsSearchBookmarkMap,
        isFlightsSearchBookmarkMapLoading:
          !flightsSearchBookmarkMap || flightsSearchBookmarkQuery.isLoading,
        isFlightsSearchBookmarkPending:
          createBookmarkFlightsSearchMutation.isPending ||
          deleteBookmarkFlightsSearchMutation.isPending,
      }}
    >
      {children}
    </FlightsSearchBookmarkContext>
  );
}

export default FlightsSearchBookmarkProvider;

export function useFlightsSearchBookmark() {
  const context = use(FlightsSearchBookmarkContext);
  if (!context) {
    throw new Error(
      'useFlightsBookmark must be used within a FlightsSearchBookmarkProvider'
    );
  }

  return context;
}

