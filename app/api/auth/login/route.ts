import { NextResponse } from "next/server";
import { createSpotifyAuthUrl } from "@/lib/server/spotify";

export async function GET() {
  return NextResponse.redirect(createSpotifyAuthUrl());
}
