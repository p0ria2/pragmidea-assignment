'use client';

import { Airport } from '@/_types';
import { createContext, use, useEffect, useState } from 'react';

interface AirportsContextType {
  airports: Airport[];
  isLoading: boolean;
}

export const AirportsContext = createContext<AirportsContextType | null>(null);

export default function AirportsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAirports = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/data/airports_iata.json');
      const data = await res.json();
      setAirports(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  return (
    <AirportsContext.Provider value={{ airports, isLoading }}>
      {children}
    </AirportsContext.Provider>
  );
}

export const useAirports = () => {
  const context = use(AirportsContext);
  if (!context) {
    throw new Error('useAirports must be used within a AirportsProvider');
  }
  return context;
};

