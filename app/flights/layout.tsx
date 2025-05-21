import { AirportsProvider } from './_providers/AirportsProvider';

export default function FlightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AirportsProvider>{children}</AirportsProvider>;
}

