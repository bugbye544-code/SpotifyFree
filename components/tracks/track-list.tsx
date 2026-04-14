import type { SpotifyTrack } from "@/lib/spotify/types";
import { TrackRow } from "@/components/tracks/track-row";

export function TrackList({
  tracks,
  contextUri,
  likedTrackIds
}: {
  tracks: SpotifyTrack[];
  contextUri?: string;
  likedTrackIds?: string[];
}) {
  const queueUris = tracks.map((track) => track.uri);

  return (
    <div className="space-y-1">
      {tracks.map((track, index) => (
        <TrackRow
          key={`${track.id}-${index}`}
          track={track}
          index={index + 1}
          contextUri={contextUri}
          queueUris={queueUris}
          liked={likedTrackIds?.includes(track.id)}
        />
      ))}
    </div>
  );
}
