import { NextResponse } from "next/server";
import { spotifyMutation } from "@/lib/server/spotify";

export async function POST() {
  await spotifyMutation("/me/player/previous", { method: "POST" });
  return NextResponse.json({ ok: true });
}
