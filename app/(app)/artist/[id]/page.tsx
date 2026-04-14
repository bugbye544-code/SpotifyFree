import { AppShell } from "@/components/layout/app-shell";
import { MediaCard } from "@/components/cards/media-card";
import { TrackList } from "@/components/tracks/track-list";
import { SectionHeading } from "@/components/ui/section-heading";
import { getArtist, getSavedTracks, requireSpotifySession } from "@/lib/server/spotify";
import { formatFollowers, getImageUrl } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export default async function ArtistPage({ params }: Props) {
  const session = await requireSpotifySession();
  const { id } = await params;
  const [{ artist, topTracks, albums }, liked] = await Promise.all([getArtist(id), getSavedTracks()]);

  return (
    <AppShell userName={session.user.displayName} title="Artist" subtitle="Top tracks and releases from Spotify">
      <div className="space-y-8">
        <section className="grid gap-6 rounded-[32px] border border-white/[0.08] bg-white/[0.035] p-6 md:grid-cols-[260px_1fr]">
          <img src={getImageUrl(artist.images)} alt={artist.name} className="aspect-square w-full rounded-[28px] object-cover shadow-glow" />
          <div className="flex flex-col justify-end">
            <p className="text-xs uppercase tracking-[0.24em] text-white/[0.38]">Artist</p>
            <h2 className="mt-4 font-display text-5xl font-semibold tracking-tight">{artist.name}</h2>
            <p className="mt-3 text-sm leading-7 text-white/[0.56]">{formatFollowers(artist.followers?.total)}</p>
          </div>
        </section>
        <section>
          <SectionHeading title="Top Tracks" />
          <TrackList tracks={topTracks} likedTrackIds={liked.items.map((item) => item.track.id)} />
        </section>
        <section>
          <SectionHeading title="Releases" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {albums.map((album) => (
              <MediaCard
                key={album.id}
                title={album.name}
                subtitle={album.release_date ?? "Album"}
                href={`/album/${album.id}`}
                images={album.images}
                contextUri={album.uri}
                type="album"
              />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
