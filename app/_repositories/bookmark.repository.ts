import db from "@/_lib/db";
import { flightsSearchBookmark } from "@/_lib/schema";
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

const addBookmarkFlightsSearch = async (userId: string, searchParams: string, departureAt: Date) => {
    return await db.insert(flightsSearchBookmark).values({
        userId,
        searchParams,
        departureAt,
    }).returning();
};

const deleteBookmarkFlightsSearch = async (id: string) => {
    return await db.delete(flightsSearchBookmark).where(eq(flightsSearchBookmark.id, id));
};

export default {
    getBookmarkFlightsSearch,
    addBookmarkFlightsSearch,
    deleteBookmarkFlightsSearch,
};