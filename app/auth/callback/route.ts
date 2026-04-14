import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForSession } from "@/lib/server/spotify";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=spotify_callback_missing_code", request.url));
  }

  try {
    await exchangeCodeForSession(code);
    return NextResponse.redirect(new URL("/", request.url));
  } catch {
    return NextResponse.redirect(new URL("/login?error=spotify_callback_failed", request.url));
  }
}
