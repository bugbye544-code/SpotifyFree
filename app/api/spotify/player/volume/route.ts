import { NextResponse } from "next/server";
import { spotifyMutation } from "@/lib/server/spotify";

export async function PUT(request: Request) {
  const body = await request.json();
  await spotifyMutation(`/me/player/volume?volume_percent=${body.volumePercent}`, { method: "PUT" });
  return NextResponse.json({ ok: true });
}
