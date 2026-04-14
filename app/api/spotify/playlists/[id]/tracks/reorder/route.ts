import { NextResponse } from "next/server";
import { spotifyMutation } from "@/lib/server/spotify";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  const result = await spotifyMutation(`/playlists/${id}/tracks`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      range_start: body.rangeStart,
      insert_before: body.insertBefore,
      range_length: 1
    })
  });
  return NextResponse.json(result);
}
