import { useQuery } from '@tanstack/react-query';
import { useAirports } from '../_providers/AirportsProvider';
import { useMemo, useState } from 'react';
import { searchAirports } from '@/_lib/flights-utils';
import { Airport } from '@/_types';

export const useSearchAirport = () => {
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

  const { data } = useQuery({
    queryKey: ['iataSearch', keyword],
    queryFn: () => searchAirports(keyword, airports),
    enabled: !isAirportsLoading && !!keyword?.trim(),
    placeholderData: (prev) => (keyword ? prev : []),
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
  };
};

