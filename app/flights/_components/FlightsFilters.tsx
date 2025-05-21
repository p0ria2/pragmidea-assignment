'use client';

import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/_components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import PassengerFilter from './PassengerFilter';
import AirportFilter from './AirportFilter';
import { useMemo } from 'react';

const formSchema = z
  .object({
    originLocationCode: z
      .string()
      .length(3, { message: 'Invalid airport code' }),
    destinationLocationCode: z
      .string()
      .length(3, { message: 'Invalid airport code' }),
    adults: z.number().min(1),
    children: z.number().min(0),
    infants: z.number().min(0),
  })
  .refine((data) => data.originLocationCode !== data.destinationLocationCode, {
    path: ['destinationLocationCode'],
    message: 'Origin and destination cannot be the same',
  });

export default function FlightsFilters() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originLocationCode: '',
      destinationLocationCode: '',
      adults: 1,
      children: 0,
      infants: 0,
    },
  });

  const passengerCount = useMemo(() => {
    const { adults, children, infants } = form.getValues();
    return { adults, children, infants };
  }, [form.watch()]);

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
                <FormItem className="flex-1">
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
                <FormItem className="flex-1">
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

            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

