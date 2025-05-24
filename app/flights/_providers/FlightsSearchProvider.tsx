'use client';

import { sendRequest } from '@/_lib/http-utils';
import { toSearchParams } from '@/_lib/navigation-utils';
import { parseUrlSearchParams } from '@/_lib/url-utils';
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
import { toast } from 'sonner';
import z from 'zod';
import { flightsSearchSchema } from '../_components/FlightsSearch';

interface FlightsSearchContextType {
  search: FlightsSearch;
  isSearchValid: boolean;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  onSearchChange: (search: Partial<FlightsSearch>) => void;
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

  const onSearchChange = useCallback<
    FlightsSearchContextType['onSearchChange']
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
    const params = parseUrlSearchParams(searchParams, FlightsSearchSchema);
    if (params) {
      setSearch(params);
    }
  }, [searchParams]);

  return (
    <FlightsSearchContext
      value={{
        search,
        isSearchValid,
        isSubmitting,
        setIsSubmitting,
        onSearchChange,
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

