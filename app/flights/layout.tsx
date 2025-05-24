import AirportsProvider from './_providers/AirportsProvider';
import FlightsSearchBookmarkProvider from './_providers/FlightsSearchBookmarkProvider';
import FlightsFiltersProvider from './_providers/FlightsFiltersProvider';
import FlightsSearchProvider from './_providers/FlightsSearchProvider';
import SearchedFlightsBookmarkProvider from './_providers/SearchedFlightsBookmarkProvider';

export default function FlightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AirportsProvider>
      <FlightsSearchProvider>
        <FlightsFiltersProvider>
          <FlightsSearchBookmarkProvider>
            <SearchedFlightsBookmarkProvider>
              {children}
            </SearchedFlightsBookmarkProvider>
          </FlightsSearchBookmarkProvider>
        </FlightsFiltersProvider>
      </FlightsSearchProvider>
    </AirportsProvider>
  );
}

