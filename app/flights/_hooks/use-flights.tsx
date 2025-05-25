'use client';

import { sendRequest } from '@/_lib/http-utils';
import { toSearchParams } from '@/_lib/url-utils';
import { Flight } from '@/_types';
import { useQuery } from '@tanstack/react-query';
import { format, isAfter, parseISO, startOfDay } from 'date-fns';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useFlightsSearch } from '../_providers/FlightsSearchProvider';

export default function useFlights() {
  const { search, isSearchValid, setIsSubmitting } = useFlightsSearch();

  const { isLoading, ...rest } = useQuery<Flight[]>({
    queryKey: ['flights', search],
    queryFn: async () => {
      try {
        const response = await sendRequest<Flight[]>(
          `/api/flights?${toSearchParams(search)}`
        );

        return response.filter(
          (flight) =>
            format(startOfDay(parseISO(flight.departure.at)), 'yyyy-MM-dd') ==
              search.departureDate &&
            isAfter(parseISO(flight.departure.at), new Date())
        );
      } catch (error) {
        toast.error('Failed to fetch flights');
        throw error;
      }
    },
    enabled: isSearchValid,
  });

  useEffect(() => {
    setIsSubmitting(isLoading);
  }, [isLoading]);

  return { isLoading, ...rest };
}

