import { Airport, Flight, FlightsFilters, FlightsSortBy, PassengerType } from "@/_types";
import { Props as UseInfiniteFlightsProps } from "@/flights/_hooks/use-infinite-flights";

export const PassengerAgeRange: Record<PassengerType, string> = {
    [PassengerType.ADULTS]: '12+',
    [PassengerType.CHILDREN]: '2-11',
    [PassengerType.INFANTS]: 'Under 2',
};

export function getPassengerCount(value: Record<PassengerType, number>) {
    return Object.values(value).reduce((acc, curr) => acc + curr, 0);
}

export function searchAirports(
    keyword: string,
    airports: Airport[],
    from = 0,
    limit = 10
): Airport[] {
    const q = keyword.trim().toLowerCase();

    const scored = (airports || [])
        .map((airport) => {
            const code = airport.code?.toLowerCase() || "";
            const name = airport.name?.toLowerCase() || "";

            let score = 0;

            if (code === q) score += 100;
            else if (code.startsWith(q)) score += 80;
            else if (code.includes(q)) score += 50;

            if (name === q) score += 90;
            else if (name.startsWith(q)) score += 70;
            else if (name.includes(q)) score += 40;

            return { airport, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(from, from + limit);

    return scored.map((item) => item.airport);
}

export function filterFlights(flights: Flight[], filters: FlightsFilters, from = 0, limit = 10) {
    const sortedFlights = flights.sort((a, b) => {
        switch (filters.sort.by) {
            case FlightsSortBy.Duration:
                return filters.sort.order === 'asc' ? a.itineraries[0].duration.localeCompare(b.itineraries[0].duration) : b.itineraries[0].duration.localeCompare(a.itineraries[0].duration);

            case FlightsSortBy.Departure:
                return filters.sort.order === 'asc' ? a.itineraries[0].departure.at.localeCompare(b.itineraries[0].departure.at) : b.itineraries[0].departure.at.localeCompare(a.itineraries[0].departure.at);

            case FlightsSortBy.Stops:
                return filters.sort.order === 'asc' ? a.itineraries[0].stops.length - b.itineraries[0].stops.length : b.itineraries[0].stops.length - a.itineraries[0].stops.length;

            default:
                return filters.sort.order === 'asc' ? Number(a.price) - Number(b.price) : Number(b.price) - Number(a.price);
        }
    });

    return sortedFlights.slice(from, from + limit);
}