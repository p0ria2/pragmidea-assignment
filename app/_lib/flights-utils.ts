import { Airport, PassengerType } from "@/_types";

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
    maxResults = 10
): Airport[] {
    const q = keyword.trim().toLowerCase();

    const scored = (airports || [])
        .map((airport) => {
            const code = airport.code?.toLowerCase() || "";
            const name = airport.name?.toLowerCase() || "";
            const city = airport.city?.toLowerCase() || "";

            let score = 0;

            if (code === q) score += 100;
            else if (code.startsWith(q)) score += 80;
            else if (code.includes(q)) score += 50;

            if (name === q) score += 90;
            else if (name.startsWith(q)) score += 70;
            else if (name.includes(q)) score += 40;

            if (city === q) score += 85;
            else if (city.startsWith(q)) score += 60;
            else if (city.includes(q)) score += 35;

            return { airport, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults);

    return scored.map((item) => item.airport);
}