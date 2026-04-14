import { NextResponse } from "next/server";
import { spotifyFetch, spotifyMutation } from "@/lib/server/spotify";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  const playlist = await spotifyFetch(`/playlists/${id}`);
  return NextResponse.json(playlist);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  await spotifyMutation(`/playlists/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: body.name,
      description: body.description,
      public: body.public ?? false
    })
  });

  return NextResponse.json({ ok: true });
}
