import { NextRequest, NextResponse } from "next/server";
import { searchFlights } from "./utils";

export async function GET(request: NextRequest) {
  const flights = await searchFlights({
    originLocationCode: "KUL",
    destinationLocationCode: "IKA",
    departureDate: "2025-05-21",
    adults: "1",
  });
  return NextResponse.json(flights);
}
