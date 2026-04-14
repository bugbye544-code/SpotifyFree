"use client";

import { useEffect, useState } from "react";
import { Music2, Play } from "lucide-react";
import type { QueueItem } from "@/lib/youtube/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { playContext } from "@/store/player-store";
import { useSearchUiStore } from "@/store/search-ui-store";

export function YouTubeSearchShell() {
  const query = useSearchUiStore((state) => state.query);
  const [results, setResults] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.error || "YouTube search failed");
        }
        setResults(json.items ?? []);
      } catch (err) {
        setResults([]);
        setError(err instanceof Error ? err.message : "YouTube search failed");
      } finally {
        setLoading(false);
      }
    }, 260);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-8">
      {error ? <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

      {loading ? (
        <section className="space-y-4">
          <SectionHeading title="Songs" subtitle="Matching tracks are loading." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="rounded-[8px] bg-[#181818] p-3">
                <div className="aspect-square animate-pulse rounded-[6px] bg-white/[0.08]" />
                <div className="mt-4 h-4 w-4/5 animate-pulse rounded bg-white/[0.08]" />
                <div className="mt-2 h-3 w-3/5 animate-pulse rounded bg-white/[0.06]" />
              </div>
            ))}
          </div>
        </section>
      ) : results.length ? (
        <section className="space-y-4">
          <SectionHeading title="Songs" subtitle={`Top results for "${query}"`} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {results.map((track, index) => (
              <button
                key={`${track.id}-${index}`}
                type="button"
                onClick={() => playContext({ queue: results, track })}
                className="group rounded-[8px] bg-[#181818] p-3 text-left transition-all duration-200 hover:bg-[#282828]"
              >
                <div className="relative overflow-hidden rounded-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                  <img src={track.artwork} alt={track.title} className="aspect-square w-full object-cover" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
                  <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="grid size-12 place-items-center rounded-full bg-accent text-black shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
                      <Play className="ml-0.5 size-5 fill-current" />
                    </span>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-[15px] font-semibold text-white">{track.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/[0.6]">
                      {[track.artist, track.album].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <div className="rounded-[8px] border border-dashed border-white/10 bg-[#181818] p-10 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-white/[0.05] text-white/[0.66]">
            <Music2 className="size-7" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-semibold">{query ? "No songs found" : "Search across YouTube music"}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/[0.54]">
            {query
              ? "Try a different song title, artist name, or search phrase."
              : "Use the search field in the top bar. Results come from the YouTube Data API, and selecting a song immediately updates the player and starts playback."}
          </p>
        </div>
      )}
    </div>
  );
}
