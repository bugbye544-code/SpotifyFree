import { NextResponse } from "next/server";
import { spotifyMutation } from "@/lib/server/spotify";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  await spotifyMutation(`/playlists/${id}/images`, {
    method: "PUT",
    headers: { "Content-Type": "image/jpeg" },
    body: body.imageBase64
  });
  return NextResponse.json({ ok: true });
}
