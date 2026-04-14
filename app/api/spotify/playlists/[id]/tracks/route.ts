import { NextResponse } from "next/server";
import { spotifyMutation } from "@/lib/server/spotify";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  const result = await spotifyMutation(`/playlists/${id}/tracks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uris: body.uris, position: body.position })
  });
  return NextResponse.json(result);
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  const result = await spotifyMutation(`/playlists/${id}/tracks`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tracks: body.uris.map((uri: string) => ({ uri })) })
  });
  return NextResponse.json(result);
}
