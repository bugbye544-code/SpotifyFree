import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getLibrarySnapshot, getPlaylistById } from "@/lib/server/library";
import { formatTrackCount } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export default async function PlaylistPage({ params }: Props) {
  const library = await getLibrarySnapshot();
  const { id } = await params;
  const playlist = await getPlaylistById(id);

  if (!playlist) notFound();

  return (
    <AppShell userName={library.user.display_name} title="Playlist" subtitle="A Supabase-backed custom playlist">
      <div className="space-y-6">
        <section className="grid gap-6 rounded-[32px] border border-white/[0.08] bg-white/[0.035] p-6 md:grid-cols-[260px_1fr]">
          <img
            src={playlist.cover_image_url ?? "/artwork/fallback-cover.svg"}
            alt={playlist.title}
            className="aspect-square w-full rounded-[28px] object-cover shadow-glow"
          />
          <div className="flex flex-col justify-end">
            <p className="text-xs uppercase tracking-[0.24em] text-white/[0.38]">Playlist</p>
            <h2 className="mt-4 font-display text-5xl font-semibold tracking-tight">{playlist.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/[0.56]">
              {playlist.description || "A custom playlist stored in your local Supabase library."}
            </p>
            <p className="mt-4 text-sm text-white/[0.46]">
              {library.user.display_name} · {formatTrackCount(0)}
            </p>
          </div>
        </section>
        <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-8 text-center">
          <h3 className="font-display text-2xl font-semibold">Playlist tracks are ready for the next pass</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/[0.54]">
            This playlist now exists in Supabase and shows up in your Library. The next step is wiring playlist_tracks and drag-reorder against the same database layer.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
