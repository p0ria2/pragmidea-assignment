import { flightsSearchBookmark } from "@/_lib/schema";
import { flightsSearchSchema } from "@/flights/_components/FlightsSearch";
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
    duration: string;
    airline: string;
    departure: {
        at: string;
        iata: string;
    };
    arrival: {
        at: string;
        iata: string;
    };
    stops: string[]
    price: string;
    currency: string;
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

export type BookmarkFlightsSearch = InferSelectModel<typeof flightsSearchBookmark>;