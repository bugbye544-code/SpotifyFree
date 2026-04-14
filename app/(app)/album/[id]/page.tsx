import { AppShell } from "@/components/layout/app-shell";
import { TrackList } from "@/components/tracks/track-list";
import { getAlbum, getSavedTracks, requireSpotifySession } from "@/lib/server/spotify";
import { getImageUrl } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export default async function AlbumPage({ params }: Props) {
  const session = await requireSpotifySession();
  const { id } = await params;
  const [album, liked] = await Promise.all([getAlbum(id), getSavedTracks()]);

  return (
    <AppShell userName={session.user.displayName} title="Album" subtitle="Track-level context playback from Spotify">
      <div className="space-y-6">
        <section className="grid gap-6 rounded-[32px] border border-white/[0.08] bg-white/[0.035] p-6 md:grid-cols-[260px_1fr]">
          <img src={getImageUrl(album.images)} alt={album.name} className="aspect-square w-full rounded-[28px] object-cover shadow-glow" />
          <div className="flex flex-col justify-end">
            <p className="text-xs uppercase tracking-[0.24em] text-white/[0.38]">{album.album_type}</p>
            <h2 className="mt-4 font-display text-5xl font-semibold tracking-tight">{album.name}</h2>
            <p className="mt-3 text-sm leading-7 text-white/[0.56]">{album.artists.map((artist) => artist.name).join(", ")} · {album.release_date}</p>
          </div>
        </section>
        <TrackList tracks={album.tracks.items} contextUri={album.uri} likedTrackIds={liked.items.map((item) => item.track.id)} />
      </div>
    </AppShell>
  );
}
