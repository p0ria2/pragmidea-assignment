'use client';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/_components';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAfter, isToday, parseISO } from 'date-fns';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import AirportFilter from './AirportFilter';
import FlightDateFilter from './FlightDateFilter';
import PassengerFilter from './PassengerFilter';

const formSchema = z
  .object({
    originLocationCode: z.string().length(3, { message: 'From is required' }),
    destinationLocationCode: z
      .string()
      .length(3, { message: 'To is required' }),
    adults: z.number().min(1),
    children: z.number().min(0),
    infants: z.number().min(0),
    departureDate: z.string().min(1, { message: 'Departure date is required' }),
    returnDate: z.string().nullable().optional(),
  })
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
  );

export default function FlightsFilters() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originLocationCode: '',
      destinationLocationCode: '',
      adults: 1,
      children: 0,
      infants: 0,
      departureDate: '',
      returnDate: null,
    },
  });

  const passengerCount = useMemo(() => {
    const { adults, children, infants } = form.getValues();
    return { adults, children, infants };
  }, [form.watch('adults'), form.watch('children'), form.watch('infants')]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="px-4 py-2">
      <div className="rounded border bg-white p-4 shadow">
        <Form {...form}>
          <form
            className="flex flex-wrap gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <PassengerFilter
              value={passengerCount}
              onChange={(passengerType, value) =>
                form.setValue(passengerType, value)
              }
            />

            <FormField
              control={form.control}
              name="originLocationCode"
              render={({ field }) => (
                <FormItem className="flex-[1_0_200px]">
                  <FormControl>
                    <AirportFilter
                      label="From"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!form.formState.errors.originLocationCode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destinationLocationCode"
              render={({ field }) => (
                <FormItem className="flex-[1_0_200px]">
                  <FormControl>
                    <AirportFilter
                      label="To"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!form.formState.errors.destinationLocationCode}
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
                <FormItem className="flex-1">
                  <FormControl>
                    <FlightDateFilter
                      label="Departure"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!form.formState.errors.departureDate}
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
                <FormItem className="flex-1">
                  <FormControl>
                    <FlightDateFilter
                      label="Return"
                      value={field.value}
                      onChange={field.onChange}
                      error={!!form.formState.errors.returnDate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full cursor-pointer" type="submit" size="lg">
              Search
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

