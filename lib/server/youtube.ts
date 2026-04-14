import type { QueueItem, YouTubeVideoMatch } from "@/lib/youtube/types";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

function getApiKey() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY is missing.");
  return apiKey;
}

export async function searchBestYouTubeMatch(query: string) {
  const url = new URL(`${BASE_URL}/search`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("maxResults", "5");
  url.searchParams.set("q", query);
  url.searchParams.set("key", getApiKey());

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`YouTube search failed with ${response.status}`);
  }

  const json = await response.json();
  const item = json.items?.[0];
  if (!item) return null;

  const match: YouTubeVideoMatch = {
    videoId: item.id.videoId,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url ?? "/artwork/fallback-cover.svg"
  };

  return match;
}

function normalizeVideoItem(item: any, fallbackArtwork = "/artwork/fallback-cover.svg"): QueueItem {
  const title = item.snippet.title as string;
  const channelTitle = item.snippet.channelTitle as string;
  const artwork =
    item.snippet.thumbnails?.high?.url ??
    item.snippet.thumbnails?.medium?.url ??
    item.snippet.thumbnails?.default?.url ??
    fallbackArtwork;

  return {
    id: item.id.videoId ?? item.id,
    title,
    artist: channelTitle,
    album: "YouTube",
    durationLabel: "Live",
    artwork,
    query: `${title} ${channelTitle}`,
    youtube: {
      videoId: item.id.videoId ?? item.id,
      title,
      channelTitle,
      thumbnail: artwork
    }
  };
}

export async function searchYouTubeTracks(query: string, maxResults = 12) {
  const url = new URL(`${BASE_URL}/search`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("videoCategoryId", "10");
  url.searchParams.set("videoSyndicated", "true");
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("q", query);
  url.searchParams.set("key", getApiKey());

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`YouTube search failed with ${response.status}`);
  }

  const json = await response.json();
  return (json.items ?? []).map((item: any) => normalizeVideoItem(item));
}

export async function getTrendingMusicVideos(regionCode = "US", maxResults = 12) {
  const url = new URL(`${BASE_URL}/videos`);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("chart", "mostPopular");
  url.searchParams.set("videoCategoryId", "10");
  url.searchParams.set("regionCode", regionCode);
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("key", getApiKey());

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`YouTube videos.list failed with ${response.status}`);
  }

  const json = await response.json();
  return (json.items ?? []).map((item: any) => normalizeVideoItem(item));
}

export async function getHomeSections(regionCode = "US") {
  const [trending, pop, chill, live] = await Promise.all([
    getTrendingMusicVideos(regionCode, 8),
    searchYouTubeTracks("pop hits official audio", 8),
    searchYouTubeTracks("chill electronic official audio", 8),
    searchYouTubeTracks("indie alternative live session", 8)
  ]);

  return [
    {
      id: "trending-music",
      title: "Trending Music",
      subtitle: `Most popular music videos in ${regionCode}`,
      tracks: trending
    },
    {
      id: "pop-picks",
      title: "Pop Picks",
      subtitle: "Big hooks, polished production, and current chart energy",
      tracks: pop
    },
    {
      id: "chill-electronic",
      title: "Chill Electronic",
      subtitle: "Softer momentum for a sleek dark dashboard",
      tracks: chill
    },
    {
      id: "live-sessions",
      title: "Live Sessions",
      subtitle: "Performance-driven cuts and studio session picks",
      tracks: live
    }
  ];
}
