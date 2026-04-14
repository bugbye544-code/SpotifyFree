import { NextRequest, NextResponse } from "next/server";
import { searchBestYouTubeMatch } from "@/lib/server/youtube";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const match = await searchBestYouTubeMatch(query);
    return NextResponse.json({ match });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "YouTube search failed" }, { status: 500 });
  }
}
