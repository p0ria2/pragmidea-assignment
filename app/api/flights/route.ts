import { NextRequest, NextResponse } from "next/server";
import { amadeusApiProvider } from "./flight-api-providers/amadeus-api-provider";
import { FlightApiProvider } from "@/_types";

const flightsApiProviders: FlightApiProvider[] = [amadeusApiProvider];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const originLocationCode = searchParams.get("originLocationCode") || "";
  const destinationLocationCode = searchParams.get("destinationLocationCode") || "";
  const departureDate = searchParams.get("departureDate") || "";
  const adults = searchParams.get("adults") || "1";

  if (!originLocationCode || !destinationLocationCode || !departureDate || !adults) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  const flights = await Promise.all(flightsApiProviders.map(provider => provider.searchFlights({
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate: searchParams.get("returnDate") || undefined,
    adults,
    children: searchParams.get("children") || "0",
    infants: searchParams.get("infants") || "0",
  })));

  return NextResponse.json(flights.flat());
}
