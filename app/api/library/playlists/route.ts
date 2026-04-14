import { NextResponse } from "next/server";
import { createPlaylist, listPlaylists } from "@/lib/server/library";

export async function GET() {
  const items = await listPlaylists();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json();
  const playlist = await createPlaylist({
    title: body.title,
    description: body.description,
    coverImageUrl: body.coverImageUrl
  });
  return NextResponse.json({ item: playlist });
}
