import AirportsProvider from './_providers/AirportsProvider';
import FlightsFiltersProvider from './_providers/FlightsFiltersProvider';

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

