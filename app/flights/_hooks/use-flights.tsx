'use client';

import { useQuery } from '@tanstack/react-query';
import { useFlightsFilters } from '../_providers/FlightsFiltersProvider';
import { toSearchParams } from '@/_lib/navigation-utils';
import { Flight } from '@/_types';
import { useEffect } from 'react';

export default function useFlights() {
  const { filters, isFiltersValid, setIsSubmitting } = useFlightsFilters();

  const { isLoading, ...rest } = useQuery<Flight[]>({
    queryKey: ['flights', filters],
    queryFn: async () => {
      const response = await fetch(`/flights/api?${toSearchParams(filters)}`);
      return response.json();
    },
    enabled: isFiltersValid,
  });

  useEffect(() => {
    setIsSubmitting(isLoading);
  }, [isLoading]);

  return { isLoading, ...rest };
}

