import { NextResponse } from "next/server";
import { getSavedTracks } from "@/lib/server/spotify";

export async function GET() {
  const tracks = await getSavedTracks();
  return NextResponse.json(tracks);
}
