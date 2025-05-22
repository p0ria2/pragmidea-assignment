import FlightsSearch from '@/flights/_components/FlightsSearch';
import FlightsList from './_components/FlightsList';

export default function FlightsPage() {
  return (
    <div className="mx-auto my-2 flex max-w-screen-lg flex-col gap-4">
      <FlightsSearch />
      <FlightsList />
    </div>
  );
}

