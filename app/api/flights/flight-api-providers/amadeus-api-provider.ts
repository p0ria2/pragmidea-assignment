import { toSearchParams } from "@/_lib/url-utils";
import { Flight } from "@/_types";
import { FlightApiProvider } from "@/_types";

export class AmadeusApiProvider extends FlightApiProvider {
    private credentials: {
        accessToken: string;
        expiresIn: number;
    } | null = null;

    async searchFlights(opts: {
        originLocationCode: string;
        destinationLocationCode: string;
        departureDate: string;
        returnDate?: string;
        adults: string;
        children?: string;
        infants?: string;
    }, retry = true): Promise<Flight[]> {
        try {
            const params = {
                ...opts,
                nonStop: "false",
                max: "250",
            };
            const accessToken = await this.getFlightsApiAccessToken();

            const response = await fetch(`${process.env.FLIGHTS_API_URL}/v2/shopping/flight-offers?${toSearchParams(params)}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            if (response.status === 401) {
                this.setCredentials(null);
                if (retry) {
                    return this.searchFlights(opts, false);
                }

                throw new Error("Unauthorized");
            }

            const data = await response.json();
            return (data?.data || []).map((flight: any) =>
                this.convertToFlight(flight, data.dictionaries)
            );
        } catch (error) {
            console.error("Error searching flights:", error);
            throw error;
        }
    }

    private async getFlightsApiAccessToken() {
        if (this.isTokenValid()) {
            return this.credentials!.accessToken;
        }

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

            const data = await response.json() as { access_token: string, expires_in: number };

            this.setCredentials(data);
            return this.credentials!.accessToken;
        } catch (error) {
            console.error("Error fetching access token:", error);
            throw error;
        }
    }

    private setCredentials(token: { access_token: string, expires_in: number } | null) {
        this.credentials = token ? {
            accessToken: token.access_token,
            expiresIn: new Date().getTime() + (token.expires_in - 10) * 1000,
        } : null;
    }

    private isTokenValid() {
        return this.credentials && this.credentials.expiresIn > Date.now();
    }

    private convertToFlight(data: any, dictionaries: any): Flight {
        const price = data.price.grandTotal;
        const currency = data.price.currency;

        return {
            id: data.id,
            itineraries: data.itineraries.map((itinerary: any) => {
                const firstSegment = itinerary.segments[0];
                const lastSegment = itinerary.segments[itinerary.segments.length - 1];

                return {
                    duration: this.getFlightDuration(itinerary.duration),
                    airlines: itinerary.segments.map((segment: any) => dictionaries.carriers[segment.carrierCode]),
                    departure: {
                        at: firstSegment.departure.at,
                        iata: firstSegment.departure.iataCode,
                    },
                    arrival: {
                        at: lastSegment.arrival.at,
                        iata: lastSegment.arrival.iataCode,
                    },
                    stops: itinerary.segments.slice(1).map((segment: any) => segment.departure.iataCode),
                }
            }),
            price,
            currency,
        };
    }

    private getFlightDuration(duration: string): string {
        const match = duration.match(/PT(?:\s*(\d+)H)?(?:\s*(\d+)M)?/);

        if (!match) {
            console.error("Invalid flight duration:", duration);
            return "N/A";
        }

        const hours = match[1] ? match[1].padStart(2, '0') : '00';
        const minutes = match[2] ? match[2].padStart(2, '0') : '00';

        return `${hours}:${minutes}`;
    }
}

export const amadeusApiProvider = new AmadeusApiProvider();