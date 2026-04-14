import { NextResponse } from "next/server";
import { getLibrarySnapshot } from "@/lib/server/library";

export async function GET() {
  const snapshot = await getLibrarySnapshot();
  return NextResponse.json(snapshot);
}
