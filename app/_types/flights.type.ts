import { flightBookmark, flightsSearchBookmark } from "@/_lib/schema";
import { flightsSearchSchema } from "@/flights/_providers/FlightsSearchProvider";
import { InferSelectModel } from "drizzle-orm";
import z from "zod";

export enum PassengerType {
    ADULTS = 'adults',
    CHILDREN = 'children',
    INFANTS = 'infants',
}

export interface Airport {
    name: string;
    code: string;
}

export interface Flight {
    id: string;
    itineraries: FlightItinerary[];
    price: string;
    currency: string;
}

export interface FlightItinerary {
    duration: string;
    airlines: string[];
    departure: {
        at: string;
        iata: string;
    };
    arrival: {
        at: string;
        iata: string;
    };
    stops: string[]
}

export type FlightsSearch = z.infer<typeof flightsSearchSchema>;

export enum FlightsSortBy {
    Price = 'price',
    Duration = 'duration',
    Departure = 'departure',
    Stops = 'stops',
}

export interface FlightsFilters {
    sort: { by: FlightsSortBy; order: 'asc' | 'desc' };
}

export type FlightsSearchBookmark = InferSelectModel<typeof flightsSearchBookmark>;
export type FlightBookmark = InferSelectModel<typeof flightBookmark>;