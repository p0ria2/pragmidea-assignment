'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import useFlights from './use-flights';
import { Flight } from '@/_types';
import { useFlightsFilters } from '../_providers/FlightsFiltersProvider';
import { filterFlights } from '@/_lib/flights-utils';

export interface Props {
  limit: number;
}

export default function useInfiniteFlights({ limit }: Props) {
  const { data: allFlights, isLoading: isFlightsLoading } = useFlights();
  const { filters } = useFlightsFilters();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['infinite-flights', allFlights, filters, limit],
      queryFn: ({ pageParam }) => {
        const filteredFlights = filterFlights(
          allFlights || [],
          filters,
          pageParam,
          limit
        );
        return {
          data: filteredFlights,
          nextPage:
            filteredFlights.length < limit ? undefined : pageParam + limit,
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

