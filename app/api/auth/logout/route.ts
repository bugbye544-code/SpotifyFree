import { NextResponse } from "next/server";
import { clearSession } from "@/lib/server/session";

export async function POST(request: Request) {
  await clearSession();
  return NextResponse.redirect(new URL("/login", request.url));
}
