import AirportsProvider from './_providers/AirportsProvider';
import FlightsBookmarkProvider from './_providers/FlightsBookmarkProvider';
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
        <FlightsBookmarkProvider>
          <AirportsProvider>{children}</AirportsProvider>
        </FlightsBookmarkProvider>
      </FlightsFiltersProvider>
    </FlightsSearchProvider>
  );
}

