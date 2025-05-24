'use client';

import { useQuery } from '@tanstack/react-query';
import { useFlightsSearch } from '../_providers/FlightsSearchProvider';
import { toSearchParams } from '@/_lib/url-utils';
import { Flight } from '@/_types';
import { useEffect } from 'react';
import { sendRequest } from '@/_lib/http-utils';
import { toast } from 'sonner';

export default function useFlights() {
  const { search, isSearchValid, setIsSubmitting } = useFlightsSearch();

  const { isLoading, ...rest } = useQuery<Flight[]>({
    queryKey: ['flights', search],
    queryFn: async () => {
      try {
        return sendRequest<Flight[]>(`/api/flights?${toSearchParams(search)}`);
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

