import { getServerSession } from "@/_lib/session-utils";
import bookmarkRepository from "@/_repositories/bookmark.repository";
import { DbError, DbErrorCodes } from "@/_types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest, { params }: { params: Promise<{ all?: string[], userId: string }> }) {
    const { userId, all } = await params;
    const [bookmarkId] = all || [];

    if (!bookmarkId) {
        return NextResponse.json({ message: `Fetching bookmarks for user ${userId}` });
    }

    return NextResponse.json({
        message: `Fetching flights for bookmark ${bookmarkId} of user ${userId}`
    });
}

const bookmarkSchema = z.object({
    searchParams: z.string(),
    departureAt: z.coerce.date()
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ bookmarkId?: string }> }) {
    const { bookmarkId } = await params;


    return NextResponse.json({ message: `Bookmark flights search ${bookmarkId} found` });
}
