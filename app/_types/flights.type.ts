import { flightsFiltersSchema } from "@/flights/_components/FlightsFilters";
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

export type FlightsFilters = z.infer<typeof flightsFiltersSchema>;

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
    price: string;
    currency: string;
}
