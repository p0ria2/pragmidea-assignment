'use client';

import { useQuery } from '@tanstack/react-query';
import { useFlightsSearch } from '../_providers/FlightsSearchProvider';
import { toSearchParams } from '@/_lib/url-utils';
import { Flight } from '@/_types';
import { useEffect } from 'react';
import { sendRequest } from '@/_lib/http-utils';
import { toast } from 'sonner';
import { isAfter, startOfDay } from 'date-fns';

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
            startOfDay(flight.departure.at) ===
              startOfDay(search.departureDate) &&
            isAfter(flight.departure.at, new Date())
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

