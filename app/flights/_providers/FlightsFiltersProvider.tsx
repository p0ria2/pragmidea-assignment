'use client';

import type { FlightsFilters } from '@/_types';
import { useSearchParams } from 'next/navigation';
import {
  ComponentProps,
  createContext,
  Dispatch,
  SetStateAction,
  Suspense,
  use,
  useEffect,
  useMemo,
  useState,
} from 'react';
import z from 'zod';
import { flightsFiltersSchema } from '../_components/FlightsFilters';

interface FlightsFiltersContextType {
  filters: FlightsFilters;
  isFiltersValid: boolean;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
}

const FlightsFiltersContext = createContext<FlightsFiltersContextType | null>(
  null
);

const FlightsFiltersSchema = flightsFiltersSchema.extend({
  adults: z.coerce.number().min(1),
  children: z.coerce.number().min(0),
  infants: z.coerce.number().min(0),
});

function FlightsFiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FlightsFilters>({
    originLocationCode: '',
    destinationLocationCode: '',
    adults: 1,
    children: 0,
    infants: 0,
    departureDate: '',
    returnDate: undefined,
  });
  const isFiltersValid = useMemo(() => {
    return FlightsFiltersSchema.safeParse(filters).success;
  }, [filters]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const parsedFilters = FlightsFiltersSchema.safeParse(params);
    if (parsedFilters.success) {
      setFilters(parsedFilters.data);
    }
  }, [searchParams]);

  return (
    <FlightsFiltersContext
      value={{ filters, isFiltersValid, isSubmitting, setIsSubmitting }}
    >
      {children}
    </FlightsFiltersContext>
  );
}

export default (props: ComponentProps<typeof FlightsFiltersProvider>) => (
  <Suspense>
    <FlightsFiltersProvider {...props} />
  </Suspense>
);

export function useFlightsFilters() {
  const context = use(FlightsFiltersContext);
  if (!context) {
    throw new Error(
      'useFlightsFilters must be used within a FlightsFiltersProvider'
    );
  }
  return context;
}

