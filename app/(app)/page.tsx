import { AppShell } from "@/components/layout/app-shell";
import { MediaCard } from "@/components/cards/media-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getHomeSections } from "@/lib/server/youtube";
import { collections, featuredPlaylists, recentlyPlayed } from "@/lib/demo/library";

export default async function HomePage() {
  const sections = await getHomeSections("US").catch(() => [
    {
      id: "fallback-recent",
      title: "Recently Played",
      subtitle: "Fallback content while the YouTube API is unavailable",
      tracks: recentlyPlayed
    },
    {
      id: "fallback-featured",
      title: "Recommended Playlists",
      subtitle: "Demo rails standing in until live discovery returns",
      tracks: featuredPlaylists.flatMap((playlist) => playlist.tracks).slice(0, 8)
    },
    {
      id: "fallback-grid",
      title: "Home Grid",
      subtitle: "Local backup content",
      tracks: collections.flatMap((collection) => collection.tracks).slice(0, 8)
    }
  ]);

  return (
    <AppShell userName="Guest Listener" title="Home" subtitle="A polished YouTube-powered listening dashboard">
      <div className="space-y-10 pb-12">
        <section className="rounded-[32px] border border-white/[0.08] bg-white/[0.035] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-white/[0.4]">Now flowing through YouTube</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-5xl">A Spotify-style dashboard with a hidden YouTube playback engine.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/[0.56]">
            Browse curated home rails, click any card, and the app will search YouTube for the best song match automatically. The sticky player stays visible while the embedded player stays tucked out of the way.
          </p>
        </section>

        {sections.map((section) => (
          <section key={section.id}>
            <SectionHeading title={section.title} subtitle={section.subtitle} />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {section.tracks.map((track) => (
                <MediaCard
                  key={`${section.id}-${track.id}`}
                  title={track.title}
                  subtitle={track.artist}
                  href="/"
                  artwork={track.artwork}
                  queue={section.tracks.map((item) => ({
                    ...item,
                    sourceCollectionId: section.id,
                    sourceCollectionTitle: section.title
                  }))}
                  track={{
                    ...track,
                    sourceCollectionId: section.id,
                    sourceCollectionTitle: section.title
                  }}
                  type="track"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
