"use client";

import { create } from "zustand";
import { toast } from "sonner";
import type { QueueItem, YouTubeVideoMatch } from "@/lib/youtube/types";

type RepeatMode = "off" | "all" | "one";

type PlayerStore = {
  playerReady: boolean;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
  volume: number;
  repeatMode: RepeatMode;
  currentTrack: QueueItem | null;
  queue: QueueItem[];
  queueIndex: number;
  resolvedVideoId: string | null;
  hydrate: () => void;
  setPlayerReady: (ready: boolean) => void;
  setPlaybackMeta: (payload: Partial<Pick<PlayerStore, "isPlaying" | "progressMs" | "durationMs" | "volume">>) => void;
  setResolvedVideo: (match: YouTubeVideoMatch | null) => void;
  setQueue: (queue: QueueItem[], index?: number) => void;
  playTrackNow: (track: QueueItem, queue?: QueueItem[]) => Promise<void>;
  playTrackAtIndex: (index: number) => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  toggleRepeat: () => void;
};

async function resolveYouTubeMatch(track: QueueItem) {
  if (track.youtube?.videoId) {
    return track.youtube;
  }
  const query = encodeURIComponent(track.query ?? `${track.title} ${track.artist} audio`);
  const response = await fetch(`/api/youtube/search-track?q=${query}`);
  if (!response.ok) {
    const json = await response.json().catch(() => ({ error: "Unable to search YouTube" }));
    throw new Error(json.error || "Unable to search YouTube");
  }
  const json = await response.json();
  return (json.match ?? null) as YouTubeVideoMatch | null;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  playerReady: false,
  isPlaying: false,
  progressMs: 0,
  durationMs: 0,
  volume: 70,
  repeatMode: "off",
  currentTrack: null,
  queue: [],
  queueIndex: 0,
  resolvedVideoId: null,
  hydrate: () => {
    const savedVolume = window.localStorage.getItem("luma-youtube-volume");
    if (savedVolume) set({ volume: Number(savedVolume) });
  },
  setPlayerReady: (ready) => set({ playerReady: ready }),
  setPlaybackMeta: (payload) => set(payload),
  setResolvedVideo: (match) =>
    set((state) => ({
      resolvedVideoId: match?.videoId ?? null,
      currentTrack: state.currentTrack ? { ...state.currentTrack, youtube: match } : state.currentTrack
    })),
  setQueue: (queue, index = 0) =>
    set({
      queue,
      queueIndex: index,
      currentTrack: queue[index] ?? null,
      resolvedVideoId: queue[index]?.youtube?.videoId ?? null,
      progressMs: 0,
      durationMs: 0
    }),
  playTrackNow: async (track, queue) => {
    const nextQueue = queue ?? [track];
    const nextIndex = Math.max(
      0,
      nextQueue.findIndex((item) => item.id === track.id)
    );

    set({
      queue: nextQueue,
      queueIndex: nextIndex,
      currentTrack: nextQueue[nextIndex] ?? track,
      progressMs: 0,
      durationMs: 0,
      isPlaying: false
    });

    try {
      const match = await resolveYouTubeMatch(track);
      if (!match) {
        toast.error("No playable YouTube result found for this song.");
        return;
      }
      set((state) => ({
        resolvedVideoId: match.videoId,
        currentTrack: state.currentTrack ? { ...state.currentTrack, youtube: match } : state.currentTrack
      }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "YouTube search failed");
    }
  },
  playTrackAtIndex: async (index) => {
    const queue = get().queue;
    const track = queue[index];
    if (!track) return;
    await get().playTrackNow(track, queue);
  },
  next: async () => {
    const { queue, queueIndex, repeatMode } = get();
    if (!queue.length) return;
    if (repeatMode === "one") {
      await get().playTrackAtIndex(queueIndex);
      return;
    }
    const nextIndex = queueIndex + 1 >= queue.length ? (repeatMode === "all" ? 0 : queueIndex) : queueIndex + 1;
    if (nextIndex === queueIndex && repeatMode === "off") {
      set({ isPlaying: false, progressMs: 0 });
      return;
    }
    await get().playTrackAtIndex(nextIndex);
  },
  previous: async () => {
    const { queue, queueIndex } = get();
    if (!queue.length) return;
    const prevIndex = queueIndex === 0 ? 0 : queueIndex - 1;
    await get().playTrackAtIndex(prevIndex);
  },
  toggleRepeat: () =>
    set((state) => ({
      repeatMode: state.repeatMode === "off" ? "all" : state.repeatMode === "all" ? "one" : "off"
    }))
}));

export async function playContext({
  queue,
  track,
  index = 0
}: {
  queue?: QueueItem[];
  track?: QueueItem;
  index?: number;
  uris?: string[];
  contextUri?: string;
}) {
  const safeQueue = queue ?? (track ? [track] : []);
  const target = track ?? safeQueue[index] ?? safeQueue[0];
  if (!target) return;
  await usePlayerStore.getState().playTrackNow(target, safeQueue);
}

export async function toggleLikeTrack(trackId?: string, save = true) {
  if (!trackId) return;
  const currentTrack = usePlayerStore.getState().currentTrack;
  const track =
    currentTrack?.id === trackId
      ? currentTrack
      : {
          id: trackId,
          title: currentTrack?.title ?? "Saved Track",
          artist: currentTrack?.artist ?? "Unknown Artist",
          album: currentTrack?.album ?? "YouTube",
          artwork: currentTrack?.artwork ?? "/artwork/fallback-cover.svg",
          durationLabel: "Saved",
          youtube: currentTrack?.youtube ?? null
        };

  const response = await fetch("/api/library/liked", {
    method: save ? "POST" : "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(save ? { track } : { trackId })
  });

  if (!response.ok) {
    toast.error("Unable to update liked songs");
    return;
  }

  toast.success(save ? "Saved to liked songs" : "Removed from liked songs");
}
