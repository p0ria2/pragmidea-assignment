import db from "@/_lib/db";
import { bookmarkFlightsSearch } from "@/_lib/schema";
import { and, eq, gte } from "drizzle-orm";

const addBookmarkFlightsSearch = async (userId: string, searchParams: string, departureAt: Date) => {
    return await db.insert(bookmarkFlightsSearch).values({
        userId,
        searchParams,
        departureAt,
    }).returning();
};


const getBookmarkFlightsSearch = async (userId: string, departureAtAfter?: Date) => {
    return await db.select().from(bookmarkFlightsSearch)
        .where(
            and(
                eq(bookmarkFlightsSearch.userId, userId),
                departureAtAfter ? gte(bookmarkFlightsSearch.departureAt, departureAtAfter) : undefined
            )
        );
};

export default {
    addBookmarkFlightsSearch,
    getBookmarkFlightsSearch,
};