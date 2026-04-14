import { NextResponse } from "next/server";
import { getLikedSongIds, removeLikedSong, setLikedSong } from "@/lib/server/library";

export async function GET() {
  const ids = await getLikedSongIds();
  return NextResponse.json({ ids });
}

export async function POST(request: Request) {
  const body = await request.json();
  await setLikedSong(body.track);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  await removeLikedSong(body.track?.id ?? body.trackId);
  return NextResponse.json({ ok: true });
}
