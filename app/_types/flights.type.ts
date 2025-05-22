import { flightsSearchSchema } from "@/flights/_components/FlightsSearch";
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

export type FlightsSearch = z.infer<typeof flightsSearchSchema>;

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
