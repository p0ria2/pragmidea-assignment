'use client';

import type { FlightsSearch } from '@/_types';
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
import { flightsSearchSchema } from '../_components/FlightsSearch';

interface FlightsSearchContextType {
  search: FlightsSearch;
  isSearchValid: boolean;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
}

const FlightsSearchContext = createContext<FlightsSearchContextType | null>(
  null
);

const FlightsSearchSchema = flightsSearchSchema.extend({
  adults: z.coerce.number().min(1),
  children: z.coerce.number().min(0),
  infants: z.coerce.number().min(0),
});

function FlightsSearchProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState<FlightsSearch>({
    originLocationCode: '',
    destinationLocationCode: '',
    adults: 1,
    children: 0,
    infants: 0,
    departureDate: '',
    returnDate: undefined,
  });
  const isSearchValid = useMemo(() => {
    return FlightsSearchSchema.safeParse(search).success;
  }, [search]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const parsedSearch = FlightsSearchSchema.safeParse(params);
    if (parsedSearch.success) {
      setSearch(parsedSearch.data);
    }
  }, [searchParams]);

  return (
    <FlightsSearchContext
      value={{ search, isSearchValid, isSubmitting, setIsSubmitting }}
    >
      {children}
    </FlightsSearchContext>
  );
}

export default (props: ComponentProps<typeof FlightsSearchProvider>) => (
  <Suspense>
    <FlightsSearchProvider {...props} />
  </Suspense>
);

export function useFlightsSearch() {
  const context = use(FlightsSearchContext);
  if (!context) {
    throw new Error(
      'useFlightsSearch must be used within a FlightsSearchProvider'
    );
  }
  return context;
}

