'use client';

import { Button, Form } from '@/_components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import PassengerFilter from './PassengerFilter';

const formSchema = z.object({
  adults: z.number().min(1),
  children: z.number().min(0),
  infants: z.number().min(0),
});

export default function FlightsFilters() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adults: 1,
      children: 0,
      infants: 0,
    },
  });

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
              value={form.watch()}
              onChange={(passengerType, value) =>
                form.setValue(passengerType, value)
              }
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

