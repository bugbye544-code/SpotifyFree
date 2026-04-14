import { NextResponse } from "next/server";
import { getCurrentUser, requireSpotifySession } from "@/lib/server/spotify";

export async function GET() {
  const session = await requireSpotifySession();
  const me = await getCurrentUser();
  return NextResponse.json({ profile: me, accessToken: session.accessToken });
}
