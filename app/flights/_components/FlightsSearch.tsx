'use client';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  LoadingButton,
} from '@/_components';
import { cn } from '@/_lib/css-utils';
import { toSearchParams } from '@/_lib/url-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAfter, isSameDay, isToday, parseISO } from 'date-fns';
import { ArrowLeftRightIcon, BookmarkIcon } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useFlightsSearchBookmark } from '../_providers/FlightsSearchBookmarkProvider';
import { useFlightsSearch } from '../_providers/FlightsSearchProvider';
import AirportSearch from './AirportSearch';
import FlightDateSearch from './FlightDateSearch';
import PassengerSearch from './PassengerSearch';

export const flightsSearchSchemaBase = z.object({
  originLocationCode: z.string().length(3, { message: 'From is required' }),
  destinationLocationCode: z.string().length(3, { message: 'To is required' }),
  adults: z.number().min(1),
  children: z.number().min(0),
  infants: z.number().min(0),
  departureDate: z.string().min(1, { message: 'Departure date is required' }),
  returnDate: z.string().optional(),
});

const formSchema = flightsSearchSchemaBase
  .refine((data) => data.originLocationCode !== data.destinationLocationCode, {
    path: ['destinationLocationCode'],
    message: 'Origin and destination cannot be the same',
  })
  .refine(
    (data) =>
      isToday(parseISO(data.departureDate)) ||
      isAfter(parseISO(data.departureDate), new Date()),
    {
      path: ['departureDate'],
      message: 'Departure date cannot be in the past',
    }
  )
  .refine(
    (data) =>
      !data.returnDate ||
      isToday(parseISO(data.returnDate)) ||
      isAfter(parseISO(data.returnDate), new Date()),
    {
      path: ['returnDate'],
      message: 'Return date cannot be in the past',
    }
  )
  .refine(
    (data) =>
      !data.returnDate ||
      (data.departureDate
        ? isSameDay(parseISO(data.returnDate), parseISO(data.departureDate)) ||
          isAfter(parseISO(data.returnDate), parseISO(data.departureDate))
        : isToday(parseISO(data.returnDate))),
    {
      path: ['returnDate'],
      message: 'Return date must be after departure date',
    }
  );

export default function FlightsSearch() {
  const { search, isSubmitting } = useFlightsSearch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originLocationCode: search.originLocationCode,
      destinationLocationCode: search.destinationLocationCode,
      adults: search.adults,
      children: search.children,
      infants: search.infants,
      departureDate: search.departureDate,
      returnDate: search.returnDate,
    },
  });

  const departureDate = form.watch('departureDate');

  const passengerCount = useMemo(() => {
    const { adults, children, infants } = form.getValues();
    return { adults, children, infants };
  }, [form.watch('adults'), form.watch('children'), form.watch('infants')]);

  const { onSearchChange } = useFlightsSearch();
  const {
    toggleBookmark,
    flightsSearchBookmarkMap: bookmarkFlightsSearchMap,
    isFlightsSearchBookmarkMapLoading,
    isFlightsSearchBookmarkPending,
  } = useFlightsSearchBookmark();
  const bookmark = useMemo(() => {
    return bookmarkFlightsSearchMap?.[toSearchParams(form.getValues())];
  }, [bookmarkFlightsSearchMap, form.formState.isValid, form.watch()]);
  const isBookmarked = !!bookmark;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSearchChange(values);
  };

  const handleToggleBookmark = () => {
    toggleBookmark(form.getValues(), isBookmarked);
  };

  const handleSwapAirports = () => {
    const { originLocationCode, destinationLocationCode } = form.getValues();
    form.setValue('originLocationCode', destinationLocationCode);
    form.setValue('destinationLocationCode', originLocationCode);
  };

  useEffect(() => {
    form.reset(search);
  }, [search]);

  return (
    <div className="px-4 pt-2">
      <div className="rounded border p-4 shadow">
        <Form {...form}>
          <form
            className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex items-center justify-between gap-2 md:col-span-2">
              <PassengerSearch
                value={passengerCount}
                onChange={(passengerType, value) =>
                  form.setValue(passengerType, value)
                }
              />

              <Button
                className="cursor-pointer rounded-full"
                variant="ghost"
                size="icon"
                type="button"
                disabled={
                  !form.formState.isValid ||
                  isFlightsSearchBookmarkMapLoading ||
                  isFlightsSearchBookmarkPending
                }
                onClick={handleToggleBookmark}
                data-testid="flights-search-bookmark-button"
              >
                <BookmarkIcon
                  className={cn({
                    'fill-yellow-400 text-yellow-500': isBookmarked,
                  })}
                />
              </Button>
            </div>

            <FormField
              control={form.control}
              name="originLocationCode"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <AirportSearch
                      label="From"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!form.formState.errors.originLocationCode}
                      type="takeoff"
                    />
                  </FormControl>
                  <FormMessage />

                  <Button
                    className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.6] rotate-90 cursor-pointer rounded-full md:top-1/2 md:-right-[34px] md:left-auto md:translate-x-0 md:-translate-y-1/2 md:rotate-0"
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={handleSwapAirports}
                  >
                    <ArrowLeftRightIcon className="text-primary" />
                  </Button>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destinationLocationCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AirportSearch
                      label="To"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!form.formState.errors.destinationLocationCode}
                      type="landing"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="departureDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FlightDateSearch
                      label="Departure"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!form.formState.errors.departureDate}
                      minDate={new Date()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="returnDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FlightDateSearch
                      label="Return"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!form.formState.errors.returnDate}
                      minDate={
                        departureDate ? parseISO(departureDate) : new Date()
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              className="w-full cursor-pointer md:col-span-2"
              type="submit"
              size="lg"
              disabled={isSubmitting}
            >
              Search
            </LoadingButton>
          </form>
        </Form>
      </div>
    </div>
  );
}

