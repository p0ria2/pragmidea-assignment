export async function getFlightsApiAccessToken() {
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

export async function searchFlights(opts: {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    returnDate?: string;
    adults: string;
}) {
    try {
        const params = new URLSearchParams({
            ...opts,
            nonStop: "false",
            max: "250",
        });
        const accessToken = await getFlightsApiAccessToken();

        const response = await fetch(`${process.env.FLIGHTS_API_URL}/v2/shopping/flight-offers?${params.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error searching flights:", error);
        throw error;
    }
}