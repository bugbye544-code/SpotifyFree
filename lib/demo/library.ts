import type { LibraryCollection, LibraryTrack } from "@/lib/youtube/types";

function track(
  id: string,
  title: string,
  artist: string,
  album: string,
  durationLabel: string,
  artwork: string
): LibraryTrack {
  return { id, title, artist, album, durationLabel, artwork };
}

export const recentlyPlayed: LibraryTrack[] = [
  track("t1", "Midnight Current", "Neon Harbor", "Afterglow FM", "3:42", "/artwork/skyline-receiver.svg"),
  track("t2", "Soft Static", "Juniper Vale", "Glass Seasons", "4:08", "/artwork/afterlight-echoes.svg"),
  track("t3", "Open Skies", "Atlas Bloom", "Northern Thread", "3:17", "/artwork/north-arcade.svg"),
  track("t4", "Signal Hearts", "Pulse Theory", "Skyline Receiver", "4:01", "/artwork/pulse-theory.svg")
];

export const collections: LibraryCollection[] = [
  {
    id: "made-for-you",
    title: "Made For You",
    description: "Warm synths, late-night drums, and melodic indie textures.",
    artwork: "/artwork/pulse-theory.svg",
    tracks: [
      track("t5", "Night Array", "Pulse Theory", "Skyline Receiver", "3:58", "/artwork/pulse-theory.svg"),
      track("t6", "Blue Cinema", "North Arcade", "After Hours", "4:12", "/artwork/north-arcade.svg"),
      track("t7", "Cloud Receiver", "Neon Harbor", "Afterglow FM", "3:26", "/artwork/skyline-receiver.svg")
    ]
  },
  {
    id: "trending",
    title: "Trending Now",
    description: "Fast-moving picks styled like an editorial streaming home rail.",
    artwork: "/artwork/north-arcade.svg",
    tracks: [
      track("t8", "Saturn Drive", "Atlas Bloom", "Northern Thread", "2:58", "/artwork/north-arcade.svg"),
      track("t9", "Coastline Echo", "Juniper Vale", "Glass Seasons", "3:33", "/artwork/afterlight-echoes.svg"),
      track("t10", "Parallel Sun", "Neon Harbor", "Afterglow FM", "4:11", "/artwork/skyline-receiver.svg")
    ]
  },
  {
    id: "popular-albums",
    title: "Popular Albums",
    description: "Full-album style cards that can seed the queue.",
    artwork: "/artwork/afterlight-echoes.svg",
    tracks: [
      track("t11", "Afterlight", "Juniper Vale", "Afterlight Echoes", "4:04", "/artwork/afterlight-echoes.svg"),
      track("t12", "Receiver Bloom", "Pulse Theory", "Skyline Receiver", "3:37", "/artwork/skyline-receiver.svg"),
      track("t13", "Arcade Haze", "North Arcade", "Northern Thread", "3:49", "/artwork/north-arcade.svg")
    ]
  }
];

export const featuredPlaylists: LibraryCollection[] = [
  {
    id: "focus-flow",
    title: "Focus Flow",
    description: "A calm, no-friction work session mix.",
    artwork: "/artwork/afterlight-echoes.svg",
    tracks: [recentlyPlayed[0], recentlyPlayed[1], collections[0].tracks[0], collections[1].tracks[0]]
  },
  {
    id: "night-drive",
    title: "Night Drive",
    description: "Wide pads and momentum for a dark dashboard vibe.",
    artwork: "/artwork/skyline-receiver.svg",
    tracks: [collections[2].tracks[1], recentlyPlayed[3], collections[0].tracks[1], collections[1].tracks[2]]
  }
];
