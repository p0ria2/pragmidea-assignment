import bookmarkRepository from "@/_repositories/bookmark.repository";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ bookmarkId?: string }> }) {
    const { bookmarkId } = await params;

    await bookmarkRepository.deleteBookmarkFlightsSearch(bookmarkId!);

    return NextResponse.json(null, { status: 200 });
}