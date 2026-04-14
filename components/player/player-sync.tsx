"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/player-store";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function PlayerSync() {
  const iframeRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);
  const {
    resolvedVideoId,
    volume,
    playerReady,
    setPlayerReady,
    setPlaybackMeta,
    next
  } = usePlayerStore();

  useEffect(() => {
    if (window.YT?.Player) return;
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    window.onYouTubeIframeAPIReady = () => {
      if (!iframeRef.current || playerRef.current) return;

      playerRef.current = new window.YT.Player(iframeRef.current, {
        width: "200",
        height: "200",
        videoId: "",
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: () => {
            playerRef.current.setVolume(volume);
            setPlayerReady(true);
          },
          onStateChange: (event: { data: number }) => {
            const YT = window.YT;
            const state = event.data;
            setPlaybackMeta({ isPlaying: state === YT.PlayerState.PLAYING });
            if (state === YT.PlayerState.ENDED) {
              next();
            }
          }
        }
      });
    };
  }, [next, setPlaybackMeta, setPlayerReady, volume]);

  useEffect(() => {
    if (!playerReady || !resolvedVideoId || !playerRef.current) return;
    playerRef.current.loadVideoById(resolvedVideoId);
  }, [playerReady, resolvedVideoId]);

  useEffect(() => {
    if (!playerRef.current || !playerReady) return;
    playerRef.current.setVolume(volume);
    window.localStorage.setItem("luma-youtube-volume", String(volume));
  }, [playerReady, volume]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (!playerRef.current) return;
      if (event.data?.type === "luma-youtube-play") playerRef.current.playVideo();
      if (event.data?.type === "luma-youtube-pause") playerRef.current.pauseVideo();
      if (event.data?.type === "luma-youtube-seek") playerRef.current.seekTo(event.data.payload, true);
      if (event.data?.type === "luma-youtube-volume") playerRef.current.setVolume(event.data.payload);
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!playerReady || !playerRef.current) return;

    intervalRef.current = window.setInterval(() => {
      const player = playerRef.current;
      if (!player?.getCurrentTime) return;
      const currentSeconds = Number(player.getCurrentTime() || 0);
      const durationSeconds = Number(player.getDuration() || 0);
      setPlaybackMeta({
        progressMs: currentSeconds * 1000,
        durationMs: durationSeconds * 1000
      });
    }, 500);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [playerReady, setPlaybackMeta]);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-0 h-[200px] w-[200px] overflow-hidden rounded-3xl opacity-[0.015]">
      <div ref={iframeRef} />
    </div>
  );
}
