"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { CoverArt } from "@/components/ui/cover-art";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/library/like-button";
import { playContext } from "@/store/player-store";
import type { QueueItem } from "@/lib/youtube/types";

type MediaCardProps = {
  title: string;
  subtitle: string;
  href: string;
  images?: { url: string }[];
  artwork?: string;
  queue?: QueueItem[];
  track?: QueueItem;
  uri?: string;
  contextUri?: string;
  type: "album" | "artist" | "playlist" | "track";
};

export function MediaCard({ title, subtitle, href, images, artwork, queue, track, type }: MediaCardProps) {
  const playable = track ?? queue?.[0];
  const normalizedImages = images ?? (artwork ? [{ url: artwork }] : undefined);

  return (
    <Link
      href={href}
      className="group rounded-[8px] bg-[#181818] p-3 transition duration-300 hover:bg-[#282828]"
    >
      <div className="relative">
        <CoverArt images={normalizedImages} alt={title} className="aspect-square w-full shadow-glow" />
        {playable ? (
          <>
            {type === "track" && playable ? (
              <div className="absolute right-16 top-3 opacity-0 transition group-hover:opacity-100">
                <LikeButton track={playable} />
              </div>
            ) : null}
            <Button
              type="button"
              size="icon"
              className="absolute bottom-2 right-2 h-12 w-12 translate-y-2 bg-accent text-black opacity-0 shadow-xl transition group-hover:translate-y-0 group-hover:opacity-100"
              onClick={(event) => {
                event.preventDefault();
                playContext({ queue: queue ?? (track ? [track] : []), track });
              }}
            >
              <Play className="size-5 fill-current" />
            </Button>
          </>
        ) : null}
      </div>
      <div className="px-1 pb-1 pt-3">
        <h3 className="line-clamp-1 text-[15px] font-bold">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/[0.7]">{subtitle}</p>
      </div>
    </Link>
  );
}
