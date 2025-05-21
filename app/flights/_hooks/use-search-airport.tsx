import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAirports } from '../_providers/AirportsProvider';
import { useMemo, useState } from 'react';
import { searchAirports } from '@/_lib/flights-utils';
import { Airport } from '@/_types';

interface Props {
  limit?: number;
}

export const useSearchAirport = ({ limit = 10 }: Props = {}) => {
  const { airports, isLoading: isAirportsLoading } = useAirports();
  const [keyword, setKeyword] = useState('');

  const airportsMap = useMemo(() => {
    return airports?.reduce(
      (acc, airport) => {
        acc[airport.code] = airport;
        return acc;
      },
      {} as Record<string, Airport>
    );
  }, [airports]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['iataSearch', keyword],
      queryFn: ({ pageParam }) => {
        const data = searchAirports(keyword, airports, pageParam, limit);
        return {
          data,
          nextPage: data.length < limit ? undefined : pageParam + limit,
        };
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => lastPage.nextPage,
      enabled: !isAirportsLoading && !!keyword?.trim(),
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  return {
    keyword,
    setKeyword,
    data,
    allAirports: airportsMap,
    isLoading: isAirportsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

