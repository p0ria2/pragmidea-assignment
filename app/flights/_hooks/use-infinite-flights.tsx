'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import useFlights from './use-flights';
import { Flight } from '@/_types';

export interface Props {
  sort: { by: 'price' | 'duration'; order: 'asc' | 'desc' };
  limit: number;
}

export default function useInfiniteFlights({ limit, sort }: Props) {
  const { data: allFlights, isLoading: isFlightsLoading } = useFlights();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['infinite-flights', allFlights, sort, limit],
      queryFn: ({ pageParam }) => {
        const data = allFlights?.slice(pageParam, pageParam + limit);
        return {
          data,
          nextPage: data!.length < limit ? undefined : pageParam + limit,
        };
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => lastPage.nextPage,
      enabled: !!allFlights?.length,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  return {
    data: (data?.pages.flatMap((page) => page.data) || []) as Flight[],
    isLoading: isFlightsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}

