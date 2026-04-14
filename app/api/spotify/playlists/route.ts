import { NextResponse } from "next/server";
import { requireSpotifySession, spotifyFetch, spotifyMutation } from "@/lib/server/spotify";

export async function GET() {
  const playlists = await spotifyFetch("/me/playlists?limit=50");
  return NextResponse.json(playlists);
}

export async function POST(request: Request) {
  const session = await requireSpotifySession();
  const body = await request.json();
  const playlist = await spotifyMutation(`/users/${session.user.id}/playlists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: body.name,
      description: body.description ?? "Created in Luma Player",
      public: false
    })
  });

  return NextResponse.json(playlist);
}
