"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import type { QueueItem } from "@/lib/youtube/types";
import { Button } from "@/components/ui/button";

export function LikeButton({ track, iconOnly = true }: { track: QueueItem; iconOnly?: boolean }) {
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetch("/api/library/liked")
      .then((response) => response.json())
      .then((json) => {
        if (!ignore) {
          setLiked((json.ids ?? []).includes(track.id));
        }
      })
      .catch(() => undefined);

    return () => {
      ignore = true;
    };
  }, [track.id]);

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={pending}
      onClick={async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setPending(true);
        const method = liked ? "DELETE" : "POST";
        const response = await fetch("/api/library/liked", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ track })
        });
        setPending(false);
        if (!response.ok) {
          toast.error("Unable to update liked songs");
          return;
        }
        setLiked(!liked);
        toast.success(liked ? "Removed from liked songs" : "Saved to liked songs");
      }}
      className={liked ? "bg-transparent text-accent hover:bg-white/[0.08]" : "bg-transparent text-white/[0.7] hover:bg-white/[0.08] hover:text-white"}
      aria-label={liked ? "Unlike song" : "Like song"}
      title={liked ? "Unlike song" : "Like song"}
    >
      <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
      {iconOnly ? null : <span>Like</span>}
    </Button>
  );
}
