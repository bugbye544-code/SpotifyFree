import { NextRequest, NextResponse } from "next/server";
import { searchYouTubeTracks } from "@/lib/server/youtube";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query) {
    return NextResponse.json({ items: [] });
  }

  try {
    const items = await searchYouTubeTracks(query, 14);
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "YouTube search failed", items: [] },
      { status: 500 }
    );
  }
}
