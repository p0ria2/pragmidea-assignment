import db from "@/_lib/db";
import { flightBookmark, flightsSearchBookmark } from "@/_lib/schema";
import { Flight, FlightsSearchBookmark } from "@/_types";
import { and, eq, gte } from "drizzle-orm";

const getBookmarkFlightsSearch = async (userId: string, departureAtAfter?: Date) => {
    return await db.select().from(flightsSearchBookmark)
        .where(
            and(
                eq(flightsSearchBookmark.userId, userId),
                departureAtAfter ? gte(flightsSearchBookmark.departureAt, departureAtAfter) : undefined
            )
        );
};

const addBookmarkFlightsSearch = async (userId: string, searchParams: string, departureAt: Date): Promise<FlightsSearchBookmark> => {
    return (await db.insert(flightsSearchBookmark).values({
        userId,
        searchParams,
        departureAt,
    }).returning())[0];
};

const deleteBookmarkFlightsSearch = async (userId: string, id: string) => {
    return await db.delete(flightsSearchBookmark).where(and(eq(flightsSearchBookmark.userId, userId), eq(flightsSearchBookmark.id, id)));
};

const getBookmarkFlights = async (userId: string, searchParams: string) => {
    return await db.select({
        id: flightBookmark.id,
        exId: flightBookmark.exId,
    }).from(flightBookmark).where(and(eq(flightBookmark.userId, userId), eq(flightBookmark.searchParams, searchParams)));
};

const addBookmarkFlight = async (userId: string, searchParams: string, flight: Flight) => {
    const [bookmark] = (await db.insert(flightBookmark).values({
        exId: flight.id,
        userId,
        searchParams,
        duration: flight.duration,
        airline: flight.airline,
        departureAt: new Date(flight.departure.at),
        departureIATA: flight.departure.iata,
        arrivalAt: new Date(flight.arrival.at),
        arrivalIATA: flight.arrival.iata,
        stops: JSON.stringify(flight.stops),
        price: flight.price,
        currency: flight.currency,
    }).returning());

    return {
        id: bookmark.id,
        exId: bookmark.exId,
    };
};

const deleteBookmarkFlight = async (userId: string, id: string) => {
    return await db.delete(flightBookmark).where(and(eq(flightBookmark.userId, userId), eq(flightBookmark.id, id)));
};

export default {
    getBookmarkFlightsSearch,
    addBookmarkFlightsSearch,
    deleteBookmarkFlightsSearch,
    getBookmarkFlights,
    addBookmarkFlight,
    deleteBookmarkFlight,
};