'use client';

import { sendRequest } from '@/_lib/http-utils';
import { toSearchParams } from '@/_lib/url-utils';
import { Flight } from '@/_types';
import { useQuery } from '@tanstack/react-query';
import { format, isAfter, parseISO, startOfDay } from 'date-fns';
import { createContext, use, useEffect } from 'react';
import { toast } from 'sonner';
import { useFlightsSearch } from './FlightsSearchProvider';

interface FlightsProviderContextType {
  flights: Flight[];
  isLoading: boolean;
  isFetched: boolean;
}

export const FlightsProviderContext =
  createContext<FlightsProviderContextType | null>(null);

export default function FlightsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { search, isSearchValid, setIsSubmitting } = useFlightsSearch();

  const {
    isLoading,
    data: flights,
    isFetched,
  } = useQuery<Flight[]>({
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

  return (
    <FlightsProviderContext
      value={{ flights: flights ?? [], isLoading, isFetched }}
    >
      {children}
    </FlightsProviderContext>
  );
}

export const useFlights = () => {
  const context = use(FlightsProviderContext);
  if (!context) {
    throw new Error('useFlights must be used within a FlightsProvider');
  }

  return context;
};

