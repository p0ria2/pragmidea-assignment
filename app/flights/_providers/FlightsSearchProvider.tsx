'use client';

import { toSearchParams } from '@/_lib/navigation-utils';
import type { FlightsSearch } from '@/_types';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ComponentProps,
  createContext,
  Dispatch,
  SetStateAction,
  Suspense,
  use,
  useCallback,
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
  handleSearchChange: (
    search: Partial<z.infer<typeof FlightsSearchSchema>>
  ) => void;
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchChange = useCallback<
    FlightsSearchContextType['handleSearchChange']
  >(
    (search) => {
      const preSearchParams = Object.fromEntries(searchParams.entries());
      router.replace(
        `/flights?${toSearchParams({ ...preSearchParams, ...search })}`
      );
    },
    [searchParams, router]
  );

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const parsedSearch = FlightsSearchSchema.safeParse(params);
    if (parsedSearch.success) {
      setSearch(parsedSearch.data);
    }
  }, [searchParams]);

  return (
    <FlightsSearchContext
      value={{
        search,
        isSearchValid,
        isSubmitting,
        setIsSubmitting,
        handleSearchChange,
      }}
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

