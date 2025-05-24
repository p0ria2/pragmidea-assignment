import { getServerSession } from "@/_lib/session-utils";
import bookmarkRepository from "@/_repositories/bookmark.repository";
import { DbError, DbErrorCodes } from "@/_types";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest, { params }: { params: Promise<{ bookmarkId?: string }> }) {
    const { bookmarkId } = await params;
    const { user } = (await getServerSession())!;

    try {
        const bookmarkFlights = await bookmarkRepository.getBookmarkFlights(user.id, bookmarkId!);
        return NextResponse.json(bookmarkFlights);
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

const POSTSchema = z.object({
    id: z.string(),
    duration: z.string(),
    airline: z.string(),
    departure: z.object({
        at: z.string(),
        iata: z.string(),
    }),
    arrival: z.object({
        at: z.string(),
        iata: z.string(),
    }),
    stops: z.array(z.string()),
    price: z.string(),
    currency: z.string(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ bookmarkId?: string }> }) {
    const { bookmarkId } = await params;
    const parsedBody = POSTSchema.safeParse(await req.json());
    const { user } = (await getServerSession())!;

    if (!parsedBody.success) {
        return NextResponse.json({ error: parsedBody.error }, { status: 400 });
    }

    try {
        const bookmarkFlight = await bookmarkRepository.addBookmarkFlight(user.id, bookmarkId!, parsedBody.data);
        return NextResponse.json(bookmarkFlight);
    } catch (error) {
        if ((error as DbError).code === DbErrorCodes.Duplicate) {
            return NextResponse.json({ message: "Bookmark already exists" }, { status: 409 });
        }

        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

const DELETESchema = z.object({
    mode: z.enum(['flights-search', 'flight']),
});

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ bookmarkId?: string }> }) {
    const { bookmarkId } = await params;
    const { user } = (await getServerSession())!;
    const parsedBody = DELETESchema.safeParse({ mode: req.nextUrl.searchParams.get('mode') });

    if (!parsedBody.success) {
        return NextResponse.json({ error: parsedBody.error }, { status: 400 });
    }

    try {
        if (parsedBody.data.mode === 'flights-search') {
            await bookmarkRepository.deleteBookmarkFlightsSearch(user.id, bookmarkId!);
        } else {
            await bookmarkRepository.deleteBookmarkFlight(user.id, bookmarkId!);
        }
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json(null, { status: 200 });
}