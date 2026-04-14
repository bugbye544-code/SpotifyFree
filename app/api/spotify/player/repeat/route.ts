import { NextResponse } from "next/server";
import { spotifyMutation } from "@/lib/server/spotify";

export async function PUT(request: Request) {
  const body = await request.json();
  await spotifyMutation(`/me/player/repeat?state=${body.state}`, { method: "PUT" });
  return NextResponse.json({ ok: true });
}
