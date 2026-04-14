import { NextResponse } from "next/server";
import { getPlaybackState } from "@/lib/server/spotify";

export async function GET() {
  const state = await getPlaybackState();
  return NextResponse.json(state);
}
