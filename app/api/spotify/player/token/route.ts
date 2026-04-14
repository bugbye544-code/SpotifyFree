import { NextResponse } from "next/server";
import { requireSpotifySession } from "@/lib/server/spotify";

export async function GET() {
  const session = await requireSpotifySession();
  return NextResponse.json({ accessToken: session.accessToken });
}
