import { Flight } from './flights.type';

export abstract class FlightApiProvider {
  abstract searchFlights(opts: {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    returnDate?: string;
    adults: string;
    children?: string;
    infants?: string;
  }): Promise<Flight[]>;
}

