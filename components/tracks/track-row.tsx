"use client";

import { Heart, MoreHorizontal, Play } from "lucide-react";
import { formatDuration, getImageUrl } from "@/lib/utils";
import type { SpotifyTrack } from "@/lib/spotify/types";
import { Button } from "@/components/ui/button";
import { playContext, toggleLikeTrack, usePlayerStore } from "@/store/player-store";

export function TrackRow({
  track,
  index,
  contextUri,
  queueUris,
  liked
}: {
  track: SpotifyTrack;
  index?: number;
  contextUri?: string;
  queueUris?: string[];
  liked?: boolean;
}) {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isActive = currentTrack?.id === track.id;

  return (
    <div
      className={`grid grid-cols-[40px_minmax(0,1fr)_120px_40px_40px] items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-white/[0.06] ${
        isActive ? "bg-white/[0.07]" : ""
      }`}
    >
      <button
        type="button"
        className="grid size-10 place-items-center rounded-xl bg-white/[0.06] text-white/[0.8] transition hover:bg-accent hover:text-background"
        onClick={() =>
          playContext({
            contextUri,
            uris: contextUri ? undefined : queueUris,
            offset: { position: index ? index - 1 : 0 }
          })
        }
      >
        <Play className="size-4 fill-current" />
      </button>
      <div className="flex min-w-0 items-center gap-3">
        <img src={getImageUrl(track.album?.images)} alt={track.name} className="size-12 rounded-xl object-cover" />
        <div className="min-w-0">
          <p className={`truncate text-sm font-semibold ${isActive ? "text-accent" : ""}`}>{track.name}</p>
          <p className="truncate text-sm text-white/[0.52]">{track.artists.map((artist) => artist.name).join(", ")}</p>
        </div>
      </div>
      <p className="truncate text-sm text-white/[0.46]">{track.album?.name ?? "Single"}</p>
      <button
        type="button"
        className={`grid size-10 place-items-center rounded-full transition ${liked ? "text-accent" : "text-white/[0.44] hover:text-white"}`}
        onClick={() => toggleLikeTrack(track.id, !liked)}
      >
        <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
      </button>
      <div className="flex items-center justify-end gap-2 text-xs text-white/[0.46]">
        <span>{formatDuration(track.duration_ms)}</span>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}
