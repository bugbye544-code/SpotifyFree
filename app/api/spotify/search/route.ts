import { NextRequest, NextResponse } from "next/server";
import { searchSpotify } from "@/lib/server/spotify";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ tracks: { items: [] }, albums: { items: [] }, artists: { items: [] }, playlists: { items: [] } });
  const results = await searchSpotify(query);
  return NextResponse.json(results);
}
