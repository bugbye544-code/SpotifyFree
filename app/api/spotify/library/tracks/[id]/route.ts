import { NextResponse } from "next/server";
import { spotifyMutation } from "@/lib/server/spotify";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(_: Request, { params }: RouteContext) {
  const { id } = await params;
  await spotifyMutation(`/me/tracks?ids=${id}`, { method: "PUT" });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const { id } = await params;
  await spotifyMutation(`/me/tracks?ids=${id}`, { method: "DELETE" });
  return NextResponse.json({ ok: true });
}
