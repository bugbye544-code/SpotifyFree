import { ArrowRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-12">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[36px] border border-white/[0.08] bg-panel p-8 shadow-glow md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/[0.56]">
            <Radio className="size-3.5" />
            Spotify-powered playback
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            Premium listening, original product design.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/[0.62]">
            Luma Player uses your Spotify Premium account for real playback, real playlists, and real library control. Nothing is hosted locally,
            and the sticky player follows you across the whole app.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/api/auth/login">
              <Button className="min-w-48">
                Continue with Spotify
                <ArrowRight className="size-4" />
              </Button>
            </a>
          </div>
        </section>
        <section className="rounded-[36px] border border-white/[0.08] bg-white/[0.04] p-8 md:p-12">
          <div className="grid h-full gap-4 md:grid-cols-2">
            {[
              "Full Spotify Web Playback SDK integration",
              "Real queue-aware playback contexts",
              "Playlist creation, editing, and reordering",
              "Search, library, likes, and recent plays"
            ].map((item) => (
              <div key={item} className="rounded-[28px] border border-white/[0.08] bg-panel-2 p-6">
                <p className="text-sm font-medium text-white/[0.82]">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
