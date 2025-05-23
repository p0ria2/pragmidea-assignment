'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/_components';
import { FlightsSortBy, type FlightsFilters } from '@/_types';
import { useFlightsFilters } from '../_providers/FlightsFiltersProvider';

const SORT_OPTIONS: {
  label: string;
  by: FlightsSortBy;
  order: FlightsFilters['sort']['order'];
}[] = [
  { label: 'Lowest Price', by: FlightsSortBy.Price, order: 'asc' },
  { label: 'Highest Price', by: FlightsSortBy.Price, order: 'desc' },
  { label: 'Shortest Duration', by: FlightsSortBy.Duration, order: 'asc' },
  { label: 'Earliest Departure', by: FlightsSortBy.Departure, order: 'asc' },
  { label: 'Latest Departure', by: FlightsSortBy.Departure, order: 'desc' },
  { label: 'Least Stops', by: FlightsSortBy.Stops, order: 'asc' },
];

export default function FlightsFilters() {
  const { filters, handleFiltersChange } = useFlightsFilters();

  const handleSortChange = (value: string) => {
    const [by, order] = value.split('-');
    handleFiltersChange({
      by: by as FlightsSortBy,
      order: order as FlightsFilters['sort']['order'],
    });
  };

  return (
    <div className="px-4">
      <Select
        value={`${filters.sort.by}-${filters.sort.order}`}
        onValueChange={handleSortChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem
              key={`${option.by}-${option.order}`}
              value={`${option.by}-${option.order}`}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

