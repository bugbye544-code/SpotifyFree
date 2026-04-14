import { NextResponse } from "next/server";
import { spotifyMutation } from "@/lib/server/spotify";

export async function PUT(request: Request) {
  const body = await request.json().catch(() => ({}));
  const query = body.deviceId ? `?device_id=${body.deviceId}` : "";

  await spotifyMutation(`/me/player/play${query}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      body.contextUri || body.uris
        ? {
            context_uri: body.contextUri,
            uris: body.uris,
            offset: body.offset
          }
        : {}
    )
  });

  return NextResponse.json({ ok: true });
}
