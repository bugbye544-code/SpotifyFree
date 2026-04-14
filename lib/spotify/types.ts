export type SpotifyImage = { url: string; width?: number | null; height?: number | null };

export type SpotifyArtist = {
  id: string;
  name: string;
  uri: string;
  images?: SpotifyImage[];
  followers?: { total: number };
};

export type SpotifyAlbum = {
  id: string;
  name: string;
  uri: string;
  album_type?: string;
  release_date?: string;
  total_tracks?: number;
  images?: SpotifyImage[];
  artists: SpotifyArtist[];
};

export type SpotifyTrack = {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  explicit?: boolean;
  track_number?: number;
  album?: SpotifyAlbum;
  artists: SpotifyArtist[];
  is_local?: boolean;
};

export type SpotifyPlaylist = {
  id: string;
  name: string;
  uri: string;
  description?: string;
  collaborative?: boolean;
  public?: boolean;
  images?: SpotifyImage[];
  owner?: { id: string; display_name: string };
  tracks?: { total: number; items?: Array<{ track: SpotifyTrack }> };
  snapshot_id?: string;
};

export type SpotifyPlaybackState = {
  is_playing: boolean;
  progress_ms: number;
  repeat_state: "off" | "track" | "context";
  shuffle_state: boolean;
  device?: { id?: string; name?: string; volume_percent?: number };
  item?: SpotifyTrack;
};

export type SpotifySearchResults = {
  tracks?: { items: SpotifyTrack[] };
  albums?: { items: SpotifyAlbum[] };
  artists?: { items: SpotifyArtist[] };
  playlists?: { items: SpotifyPlaylist[] };
};

export type SpotifyUser = {
  id: string;
  display_name: string;
  email?: string;
  images?: SpotifyImage[];
  product?: string;
};
