import AirportsProvider from './_providers/AirportsProvider';
import FlightsFiltersProvider from './_providers/FlightsFiltersProvider';
import FlightsSearchProvider from './_providers/FlightsSearchProvider';

export default function FlightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FlightsSearchProvider>
      <FlightsFiltersProvider>
        <AirportsProvider>{children}</AirportsProvider>
      </FlightsFiltersProvider>
    </FlightsSearchProvider>
  );
}

