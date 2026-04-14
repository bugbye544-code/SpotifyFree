"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Search } from "lucide-react";
import type { SpotifySearchResults } from "@/lib/spotify/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaCard } from "@/components/cards/media-card";
import { playContext } from "@/store/player-store";

export function SearchShell() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifySearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults(null);
        return;
      }

      setLoading(true);
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
      const json = await response.json();
      setResults(json);
      setLoading(false);
    }, 260);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-8">
      <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.035] p-5">
        <div className="relative max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/[0.4]" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tracks, albums, artists, playlists" className="pl-12" />
        </div>
      </div>
      {loading ? <div className="text-sm text-white/[0.54]">Searching Spotify...</div> : null}
      {results ? (
        <div className="space-y-10">
          <section>
            <SectionHeading title="Tracks" subtitle="Start playback instantly from any result." />
            <div className="space-y-2">
              {results.tracks?.items.map((track) => (
                <Link key={track.id} href={`/album/${track.album?.id}`} className="flex items-center justify-between rounded-2xl bg-white/[0.035] px-4 py-3 transition hover:bg-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="size-10"
                      onClick={(event) => {
                        event.preventDefault();
                        playContext({ uris: [track.uri] });
                      }}
                    >
                      <Play className="size-4 fill-current" />
                    </Button>
                    <div>
                      <p className="font-medium">{track.name}</p>
                      <p className="text-sm text-white/[0.52]">{track.artists.map((artist) => artist.name).join(", ")}</p>
                    </div>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/[0.36]">{track.album?.name}</p>
                </Link>
              ))}
            </div>
          </section>
          <section>
            <SectionHeading title="Albums" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {results.albums?.items.map((album) => (
                <MediaCard
                  key={album.id}
                  title={album.name}
                  subtitle={album.artists.map((artist) => artist.name).join(", ")}
                  href={`/album/${album.id}`}
                  images={album.images}
                  contextUri={album.uri}
                  type="album"
                />
              ))}
            </div>
          </section>
          <section>
            <SectionHeading title="Artists" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {results.artists?.items.map((artist) => (
                <MediaCard
                  key={artist.id}
                  title={artist.name}
                  subtitle="Artist"
                  href={`/artist/${artist.id}`}
                  images={artist.images}
                  uri={artist.uri}
                  type="artist"
                />
              ))}
            </div>
          </section>
          <section>
            <SectionHeading title="Playlists" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {results.playlists?.items.map((playlist) => (
                <MediaCard
                  key={playlist.id}
                  title={playlist.name}
                  subtitle={playlist.description || playlist.owner?.display_name || "Playlist"}
                  href={`/playlist/${playlist.id}`}
                  images={playlist.images}
                  contextUri={playlist.uri}
                  type="playlist"
                />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="rounded-[30px] border border-dashed border-white/10 bg-white/[0.025] p-10 text-center">
          <h2 className="font-display text-2xl font-semibold">Search across your Spotify world</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/[0.54]">
            Results update as you type. Albums, artists, playlists, and tracks all come directly from Spotify’s catalog and your account access.
          </p>
        </div>
      )}
    </div>
  );
}
