import AirportsProvider from './_providers/AirportsProvider';
import FlightsFiltersProvider from './_providers/FlightsSearchProvider';

export default function FlightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FlightsFiltersProvider>
      <AirportsProvider>{children}</AirportsProvider>
    </FlightsFiltersProvider>
  );
}

