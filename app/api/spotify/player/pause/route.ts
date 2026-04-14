import { NextResponse } from "next/server";
import { spotifyMutation } from "@/lib/server/spotify";

export async function PUT() {
  await spotifyMutation("/me/player/pause", { method: "PUT" });
  return NextResponse.json({ ok: true });
}
