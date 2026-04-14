import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(ms?: number) {
  if (!ms) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatFollowers(value?: number) {
  if (!value) return "0 followers";
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value) + " followers";
}

export function formatTrackCount(value?: number) {
  if (!value) return "0 songs";
  return `${value} song${value === 1 ? "" : "s"}`;
}

export function getImageUrl(images?: { url: string }[], fallback = "/artwork/fallback-cover.svg") {
  return images?.[0]?.url ?? fallback;
}

export function pick<T>(items: T[], count: number) {
  return items.slice(0, count);
}
