import { NextResponse } from "next/server";
import { spotifyMutation } from "@/lib/server/spotify";

export async function PUT(request: Request) {
  const body = await request.json();
  await spotifyMutation("/me/player", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      device_ids: [body.deviceId],
      play: false
    })
  });

  return NextResponse.json({ ok: true });
}
