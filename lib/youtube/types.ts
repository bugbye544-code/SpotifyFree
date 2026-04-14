export type LibraryTrack = {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationLabel: string;
  artwork: string;
  query?: string;
};

export type LibraryCollection = {
  id: string;
  title: string;
  description: string;
  artwork: string;
  tracks: LibraryTrack[];
};

export type YouTubeVideoMatch = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
};

export type QueueItem = LibraryTrack & {
  sourceCollectionId?: string;
  sourceCollectionTitle?: string;
  youtube?: YouTubeVideoMatch | null;
};
