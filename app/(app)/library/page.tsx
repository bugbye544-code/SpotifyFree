import { AppShell } from "@/components/layout/app-shell";
import { MediaCard } from "@/components/cards/media-card";
import { LibraryActions } from "@/components/library-actions";
import { SectionHeading } from "@/components/ui/section-heading";
import { getLibrarySnapshot } from "@/lib/server/library";

export default async function LibraryPage() {
  const library = await getLibrarySnapshot();

  return (
    <AppShell userName={library.user.display_name} title="Your Library" subtitle="Saved playlists and liked songs from Supabase">
      <div className="space-y-10">
        <LibraryActions />
        <section>
          <SectionHeading title="Saved playlists" subtitle="Your real playlists stored in Supabase." />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {library.playlists.map((playlist) => (
              <MediaCard
                key={playlist.id}
                title={playlist.title}
                subtitle={playlist.description ?? "Custom playlist"}
                href={`/playlist/${playlist.id}`}
                artwork={playlist.cover_image_url ?? "/artwork/fallback-cover.svg"}
                type="playlist"
              />
            ))}
          </div>
        </section>
        <section>
          <SectionHeading title="Liked songs" subtitle={`${library.likedSongs.length} saved tracks ready to queue`} />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {library.likedSongs.slice(0, 8).map((track) => (
              <MediaCard
                key={track.id}
                title={track.title}
                subtitle={track.artist}
                href="/liked"
                artwork={track.artwork}
                track={track}
                type="track"
              />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
