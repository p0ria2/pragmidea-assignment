import { getServerSession } from "@/_lib/session-utils";
import bookmarkRepository from "@/_repositories/bookmark.repository";
import { DbError, DbErrorCodes } from "@/_types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const GETSchema = z.object({
    departureAt: z.coerce.date().optional()
});

export async function GET(req: NextRequest) {
    const { user } = (await getServerSession())!;
    const { departureAt } = GETSchema.parse({ departureAt: req.nextUrl.searchParams.get("departureAt") });

    try {
        const bookmarkFlightsSearch = await bookmarkRepository.getBookmarkFlightsSearch(user.id, departureAt);
        return NextResponse.json(bookmarkFlightsSearch);
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

const POSTSchema = z.object({
    searchParams: z.string(),
    departureAt: z.coerce.date()
});

export async function POST(req: NextRequest) {
    const parsedBody = POSTSchema.safeParse(await req.json());
    const { user } = (await getServerSession())!;

    if (!parsedBody.success) {
        return NextResponse.json({ error: parsedBody.error }, { status: 400 });
    }

    try {
        const bookmarkFlightsSearch = await bookmarkRepository.addBookmarkFlightsSearch(user.id, parsedBody.data.searchParams, parsedBody.data.departureAt);
        return NextResponse.json(bookmarkFlightsSearch);
    } catch (error) {
        if ((error as DbError).code === DbErrorCodes.Duplicate) {
            return NextResponse.json({ message: "Bookmark already exists" }, { status: 409 });
        }

        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
