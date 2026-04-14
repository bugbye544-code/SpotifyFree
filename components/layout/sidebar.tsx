"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Library, ListPlus, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { navigationLinks } from "@/components/layout/navigation-links";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LibraryPlaylist = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
};

type LibrarySnapshot = {
  playlists: LibraryPlaylist[];
  likedSongs: { id: string }[];
};

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [library, setLibrary] = useState<LibrarySnapshot | null>(null);
  const [loadingLibrary, setLoadingLibrary] = useState(true);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);

  const primaryLinks = useMemo(() => navigationLinks.filter((link) => link.href === "/" || link.href === "/search"), []);

  useEffect(() => {
    let cancelled = false;

    const loadLibrary = async () => {
      setLoadingLibrary(true);

      try {
        const response = await fetch("/api/library");
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error || "Unable to load library");
        }

        if (!cancelled) {
          setLibrary({
            playlists: json.playlists ?? [],
            likedSongs: json.likedSongs ?? []
          });
        }
      } catch {
        if (!cancelled) {
          setLibrary({ playlists: [], likedSongs: [] });
        }
      } finally {
        if (!cancelled) {
          setLoadingLibrary(false);
        }
      }
    };

    void loadLibrary();

    return () => {
      cancelled = true;
    };
  }, []);

  const createPlaylist = async () => {
    if (creatingPlaylist) return;

    setCreatingPlaylist(true);

    try {
      const response = await fetch("/api/library/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "My Playlist", description: "Freshly created in Luma Player" })
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || "Failed to create playlist");
      }

      const playlist = json.item as LibraryPlaylist;
      setLibrary((current) => ({
        playlists: playlist ? [playlist, ...(current?.playlists ?? [])] : current?.playlists ?? [],
        likedSongs: current?.likedSongs ?? []
      }));
      toast.success("Playlist created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create playlist");
    } finally {
      setCreatingPlaylist(false);
    }
  };

  return (
    <aside className="sticky top-2 hidden h-[calc(100vh-112px)] w-[420px] shrink-0 flex-col gap-2 self-start lg:flex lg:max-w-[420px]">
      <div className="rounded-[8px] bg-panel px-2 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
        <div className="mb-1 flex items-center gap-3 px-3 py-2">
          <div className="grid size-10 place-items-center rounded-full bg-white text-black">
            <span className="font-display text-base font-bold">L</span>
          </div>
          <div>
            <p className="font-display text-base font-bold tracking-tight">Luma Player</p>
            <p className="text-xs text-white/[0.55]">Library owner: {userName}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {primaryLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-4 rounded-md px-4 py-3 text-base font-bold transition-colors duration-200",
                  active ? "text-white" : "text-white/[0.7] hover:text-white"
                )}
              >
                <Icon className={cn("size-6", active ? "fill-current" : "")} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[8px] bg-panel shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <Link
            href="/library"
            className={cn(
              "flex items-center gap-3 rounded-full px-2 py-1 text-white/[0.7] transition-colors duration-200 hover:text-white",
              pathname.startsWith("/library") && "text-white"
            )}
          >
            <Library className="size-5" />
            <span className="text-base font-bold">Your Library</span>
          </Link>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/[0.68] hover:bg-white/[0.08] hover:text-white"
              onClick={createPlaylist}
              disabled={creatingPlaylist}
              aria-label="Create playlist"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 pb-3">
          <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-semibold text-white">Playlists</span>
          <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-semibold text-white/[0.75]">Artists</span>
        </div>

        <div className="flex items-center justify-between px-4 pb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/[0.4]">Recents</p>
          <Search className="size-4 text-white/[0.5]" />
        </div>

        <div className="spotify-scroll min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          <Link
            href="/liked"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-200 hover:bg-white/[0.08]",
              pathname.startsWith("/liked") && "bg-white/[0.08]"
            )}
          >
            <div className="grid size-12 shrink-0 place-items-center rounded-[4px] bg-[linear-gradient(135deg,#450af5,#c4efd9)]">
              <Heart className="size-5 fill-current text-white" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-white">Liked Songs</p>
              <p className="truncate text-sm text-white/[0.56]">{library?.likedSongs.length ?? 0} saved tracks</p>
            </div>
          </Link>

          {loadingLibrary ? (
            <div className="space-y-2 px-1 pt-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 rounded-md px-3 py-2">
                  <div className="size-12 animate-pulse rounded-[4px] bg-white/[0.08]" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-white/[0.08]" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.06]" />
                  </div>
                </div>
              ))}
            </div>
          ) : library?.playlists.length ? (
            <div className="pt-2">
              {library.playlists.map((playlist) => (
                <Link
                  key={playlist.id}
                  href={`/playlist/${playlist.id}`}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-200 hover:bg-white/[0.08]",
                    pathname === `/playlist/${playlist.id}` && "bg-white/[0.08]"
                  )}
                >
                  <div className="grid size-12 shrink-0 place-items-center rounded-[4px] bg-[#2a2a2a] text-white/[0.7]">
                    <ListPlus className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-white">{playlist.title}</p>
                    <p className="truncate text-sm text-white/[0.56]">
                      Playlist
                      {playlist.description ? ` · ${playlist.description}` : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3 px-2 pt-2">
              <div className="rounded-[8px] bg-panel-2 px-4 py-4">
                <p className="text-sm font-semibold text-white">Create your first playlist</p>
                <p className="mt-1 text-sm text-white/[0.55]">It&apos;s easy, we&apos;ll help you</p>
                <button
                  type="button"
                  onClick={createPlaylist}
                  className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.03]"
                >
                  Create playlist
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
