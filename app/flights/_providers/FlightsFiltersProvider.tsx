'use client';

import { toSearchParams } from '@/_lib/navigation-utils';
import { FlightsFilters, FlightsSortBy } from '@/_types';
import router, { useRouter, useSearchParams } from 'next/navigation';
import {
  ComponentProps,
  createContext,
  Suspense,
  use,
  useCallback,
  useEffect,
  useState,
} from 'react';
import z from 'zod';

interface FlightsFiltersContextType {
  filters: FlightsFilters;
  handleFiltersChange: (
    filters: Partial<z.infer<typeof FlightsFiltersSchema>>
  ) => void;
}

const FlightsFiltersContext = createContext<FlightsFiltersContextType | null>(
  null
);

const FlightsFiltersSchema = z.object({
  by: z.nativeEnum(FlightsSortBy),
  order: z.enum(['asc', 'desc']),
});

function FlightsFiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FlightsFilters>({
    sort: {
      by: FlightsSortBy.Price,
      order: 'asc',
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFiltersChange = useCallback<
    FlightsFiltersContextType['handleFiltersChange']
  >(
    (filters) => {
      const preSearchParams = Object.fromEntries(searchParams.entries());
      router.replace(
        `/flights?${toSearchParams({ ...preSearchParams, ...filters })}`
      );
    },
    [searchParams, router]
  );

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const parsedFilters = FlightsFiltersSchema.safeParse(params);
    if (parsedFilters.success) {
      setFilters({
        sort: {
          by: parsedFilters.data.by,
          order: parsedFilters.data.order,
        },
      });
    }
  }, [searchParams]);

  return (
    <FlightsFiltersContext value={{ filters, handleFiltersChange }}>
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

