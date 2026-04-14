import { NextResponse } from "next/server";
import { spotifyMutation } from "@/lib/server/spotify";

export async function POST() {
  await spotifyMutation("/me/player/next", { method: "POST" });
  return NextResponse.json({ ok: true });
}
