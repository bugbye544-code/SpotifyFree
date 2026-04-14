import { AppShell } from "@/components/layout/app-shell";
import { MediaCard } from "@/components/cards/media-card";
import { getLibrarySnapshot } from "@/lib/server/library";

export default async function LikedPage() {
  const library = await getLibrarySnapshot();
  const tracks = library.likedSongs;

  return (
    <AppShell userName={library.user.display_name} title="Liked Songs" subtitle="Your Supabase-backed liked songs collection">
      <div className="rounded-[32px] border border-white/[0.08] bg-white/[0.035] p-5 md:p-6">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.24em] text-white/[0.38]">Collection</p>
          <h2 className="mt-3 font-display text-4xl font-semibold">Liked Songs</h2>
          <p className="mt-2 text-sm text-white/[0.54]">{tracks.length} saved tracks pulled directly from your Supabase library.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tracks.map((track) => (
            <MediaCard
              key={track.id}
              title={track.title}
              subtitle={track.artist}
              href="/liked"
              artwork={track.artwork}
              queue={tracks}
              track={track}
              type="track"
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
