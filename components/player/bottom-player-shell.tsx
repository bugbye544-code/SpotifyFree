"use client";

import { ListMusic, MonitorSpeaker, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { LikeButton } from "@/components/library/like-button";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/utils";
import { usePlayerStore } from "@/store/player-store";

export function BottomPlayer() {
  const {
    currentTrack,
    isPlaying,
    progressMs,
    durationMs,
    volume,
    repeatMode,
    queue,
    next,
    previous,
    toggleRepeat,
    setPlaybackMeta
  } = usePlayerStore();

  const progressPercent = durationMs ? Math.min(100, (progressMs / durationMs) * 100) : 0;
  const volumePercent = Math.min(100, Math.max(0, volume));
  const trackSubtitle = currentTrack ? [currentTrack.artist, currentTrack.album].filter(Boolean).join(" - ") : "YouTube-powered playback";

  return (
    <div className="mt-2 rounded-[8px] border border-white/[0.06] bg-[#181818] px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.28)]">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,300px)_1fr_280px] lg:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={currentTrack?.youtube?.thumbnail ?? currentTrack?.artwork ?? "/artwork/fallback-cover.svg"}
            alt={currentTrack?.title ?? "No track"}
            className="size-14 rounded-[4px] object-cover shadow-[0_4px_14px_rgba(0,0,0,0.35)]"
          />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-white">{currentTrack?.title ?? "Choose something to play"}</p>
            <p className="truncate text-xs text-white/[0.55]">{trackSubtitle}</p>
          </div>
          {currentTrack ? <LikeButton track={currentTrack} /> : null}
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex items-center justify-center gap-1.5">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/[0.72] hover:text-white">
              <Shuffle className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/[0.72] hover:text-white" onClick={() => previous()}>
              <SkipBack className="size-4 fill-current" />
            </Button>
            <Button
              variant="primary"
              size="icon"
              className="h-8 w-8 bg-white text-black hover:scale-[1.04] hover:bg-white"
              onClick={() => {
                const state = usePlayerStore.getState();
                state.setPlaybackMeta({ isPlaying: !state.isPlaying });
                window.postMessage({ type: state.isPlaying ? "luma-youtube-pause" : "luma-youtube-play" }, "*");
              }}
            >
              {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/[0.72] hover:text-white" onClick={() => next()}>
              <SkipForward className="size-4 fill-current" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/[0.72] hover:text-white" onClick={() => toggleRepeat()}>
              {repeatMode === "one" ? (
                <Repeat1 className="size-4 text-accent" />
              ) : (
                <Repeat className={`size-4 ${repeatMode === "all" ? "text-accent" : ""}`} />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-white/[0.55]">
            <span className="w-10 text-right">{formatDuration(progressMs)}</span>
            <input
              type="range"
              min={0}
              max={durationMs || 0}
              value={progressMs}
              onChange={(event) => {
                const seekMs = Number(event.target.value);
                setPlaybackMeta({ progressMs: seekMs });
                window.postMessage({ type: "luma-youtube-seek", payload: seekMs / 1000 }, "*");
              }}
              className="spotify-slider h-1 w-full cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, #ffffff 0%, #ffffff ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            <span className="w-10">{formatDuration(durationMs)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" size="icon" className="hidden h-8 w-8 text-white/[0.6] hover:text-white lg:inline-flex">
            <MonitorSpeaker className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden h-8 w-8 text-white/[0.6] hover:text-white lg:inline-flex">
            <ListMusic className="size-4" />
          </Button>

          <div className="flex items-center gap-2 px-1 py-2">
            <Volume2 className="size-4 text-white/[0.6]" />
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(event) => {
                const nextVolume = Number(event.target.value);
                setPlaybackMeta({ volume: nextVolume });
                window.postMessage({ type: "luma-youtube-volume", payload: nextVolume }, "*");
              }}
              className="spotify-slider h-1 w-24 cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, #ffffff 0%, #ffffff ${volumePercent}%, rgba(255,255,255,0.2) ${volumePercent}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
          </div>

          <div className="hidden min-w-[110px] text-right lg:block">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/[0.38]">Queue</p>
            <p className="text-sm text-white/[0.54]">{queue.length ? `${queue.length} tracks ready` : "Context-driven"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
