import { Flight } from "@/_types";
import { FlightApiProvider } from "@/_types";

export class AmadeusApiProvider extends FlightApiProvider {
    async searchFlights(opts: {
        originLocationCode: string;
        destinationLocationCode: string;
        departureDate: string;
        returnDate?: string;
        adults: string;
        children?: string;
        infants?: string;
    }): Promise<Flight[]> {
        try {
            const params = new URLSearchParams({
                ...opts,
                nonStop: "false",
                max: "250",
            });
            const accessToken = await this.getFlightsApiAccessToken();

            const response = await fetch(`${process.env.FLIGHTS_API_URL}/v2/shopping/flight-offers?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();
            return (data?.data || []).map((flight: any) => {
                const itinerary = flight.itineraries[0];
                const firstSegment = itinerary.segments[0];
                const lastSegment = itinerary.segments[itinerary.segments.length - 1];
                const duration = this.getFlightDuration(itinerary.duration);
                const airline = data.dictionaries.carriers[firstSegment.carrierCode];
                const departure = firstSegment.departure;
                const arrival = lastSegment.arrival;
                const price = flight.price.grandTotal;
                const currency = flight.price.currency;

                return {
                    id: flight.id,
                    duration,
                    airline,
                    departure: {
                        at: departure.at,
                        iata: departure.iataCode,
                    },
                    arrival: {
                        at: arrival.at,
                        iata: arrival.iataCode,
                    },
                    price,
                    currency,
                };
            });
        } catch (error) {
            console.error("Error searching flights:", error);
            throw error;
        }
    }

    private async getFlightsApiAccessToken() {
        try {
            const formData = new URLSearchParams();
            formData.append("grant_type", "client_credentials");
            formData.append("client_id", process.env.FLIGHTS_API_CLIENT_ID!);
            formData.append("client_secret", process.env.FLIGHTS_API_CLIENT_SECRET!);

            const response = await fetch(process.env.FLIGHTS_API_TOKEN_URL!, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error("Error fetching access token:", error);
            throw error;
        }
    }

    private getFlightDuration(duration: string): string {
        const match = duration.match(/PT(\d+)H(\d+)M/);

        if (!match) {
            throw new Error("Invalid duration format");
        }

        const hours = match[1].padStart(2, '0');
        const minutes = match[2].padStart(2, '0');

        return `${hours}:${minutes}`;
    }
}

export const amadeusApiProvider = new AmadeusApiProvider();