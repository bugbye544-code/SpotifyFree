import { redirect } from "next/navigation";
import { getSession, setSession, type SessionPayload } from "@/lib/server/session";
import type {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyPlaybackState,
  SpotifyPlaylist,
  SpotifySearchResults,
  SpotifyTrack,
  SpotifyUser
} from "@/lib/spotify/types";

const SPOTIFY_API = "https://api.spotify.com/v1";
const ACCOUNTS_API = "https://accounts.spotify.com/api/token";

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is missing.`);
  return value;
}

function getBasicAuth() {
  const clientId = getRequiredEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = getRequiredEnv("SPOTIFY_CLIENT_SECRET");
  return Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}

export function getSpotifyScopes() {
  return (
    process.env.SPOTIFY_SCOPES ??
    "user-read-email user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing streaming user-library-read user-library-modify user-read-recently-played playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public ugc-image-upload"
  );
}

export function createSpotifyAuthUrl() {
  const url = new URL("https://accounts.spotify.com/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", getRequiredEnv("SPOTIFY_CLIENT_ID"));
  url.searchParams.set("scope", getSpotifyScopes());
  url.searchParams.set("redirect_uri", getRequiredEnv("SPOTIFY_REDIRECT_URI"));
  url.searchParams.set("show_dialog", "false");
  return url.toString();
}

async function refreshAccessToken(session: SessionPayload) {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: session.refreshToken
  });

  const response = await fetch(ACCOUNTS_API, {
    method: "POST",
    headers: {
      Authorization: `Basic ${getBasicAuth()}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Spotify access token.");
  }

  const json = await response.json();
  const nextSession: SessionPayload = {
    ...session,
    accessToken: json.access_token,
    refreshToken: json.refresh_token ?? session.refreshToken,
    expiresAt: Date.now() + json.expires_in * 1000
  };

  await setSession(nextSession);
  return nextSession;
}

export async function requireSpotifySession() {
  const session = await getSession();
  if (!session) redirect("/login");

  if (session.expiresAt < Date.now() + 60_000) {
    return refreshAccessToken(session);
  }

  return session;
}

export async function exchangeCodeForSession(code: string) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: getRequiredEnv("SPOTIFY_REDIRECT_URI")
  });

  const tokenResponse = await fetch(ACCOUNTS_API, {
    method: "POST",
    headers: {
      Authorization: `Basic ${getBasicAuth()}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!tokenResponse.ok) {
    throw new Error("Failed to exchange Spotify authorization code.");
  }

  const tokenJson = await tokenResponse.json();
  const meResponse = await fetch(`${SPOTIFY_API}/me`, {
    headers: { Authorization: `Bearer ${tokenJson.access_token}` }
  });

  if (!meResponse.ok) {
    throw new Error("Failed to load Spotify profile.");
  }

  const user = (await meResponse.json()) as SpotifyUser;
  const session: SessionPayload = {
    accessToken: tokenJson.access_token,
    refreshToken: tokenJson.refresh_token,
    expiresAt: Date.now() + tokenJson.expires_in * 1000,
    user: {
      id: user.id,
      displayName: user.display_name,
      email: user.email,
      image: user.images?.[0]?.url,
      product: user.product
    }
  };

  await setSession(session);
  return session;
}

export async function spotifyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const session = await requireSpotifySession();
  const response = await fetch(`${SPOTIFY_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (response.status === 204) {
    return null as T;
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${response.status} ${message}`);
  }

  return response.json() as Promise<T>;
}

export async function spotifyMutation(path: string, init?: RequestInit) {
  const session = await requireSpotifySession();
  const response = await fetch(`${SPOTIFY_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${response.status} ${message}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function getCurrentUser() {
  return spotifyFetch<SpotifyUser>("/me");
}

export async function getPlaybackState() {
  return spotifyFetch<SpotifyPlaybackState | null>("/me/player");
}

export async function getHomeContent() {
  const [recent, featured, newReleases, playlists] = await Promise.all([
    spotifyFetch<{ items: Array<{ track: SpotifyTrack; played_at: string }> }>("/me/player/recently-played?limit=12"),
    spotifyFetch<{ playlists: { items: SpotifyPlaylist[] } }>("/browse/featured-playlists?limit=8"),
    spotifyFetch<{ albums: { items: SpotifyAlbum[] } }>("/browse/new-releases?limit=8"),
    spotifyFetch<{ items: SpotifyPlaylist[] }>("/me/playlists?limit=8")
  ]);

  return {
    recentlyPlayed: recent.items.map((item) => item.track),
    featuredPlaylists: featured.playlists.items,
    newReleases: newReleases.albums.items,
    yourPlaylists: playlists.items
  };
}

export async function searchSpotify(query: string) {
  return spotifyFetch<SpotifySearchResults>(
    `/search?q=${encodeURIComponent(query)}&type=track,album,artist,playlist&limit=8`
  );
}

export async function getSavedTracks() {
  return spotifyFetch<{ items: Array<{ added_at: string; track: SpotifyTrack }> }>("/me/tracks?limit=50");
}

export async function hasLikedTrack(id: string) {
  return spotifyFetch<boolean[]>(`/me/tracks/contains?ids=${id}`);
}

export async function getPlaylists() {
  return spotifyFetch<{ items: SpotifyPlaylist[] }>("/me/playlists?limit=50");
}

export async function getPlaylist(id: string) {
  return spotifyFetch<SpotifyPlaylist>(`/playlists/${id}`);
}

export async function getAlbum(id: string) {
  const album = await spotifyFetch<SpotifyAlbum & { tracks: { items: SpotifyTrack[] } }>(`/albums/${id}`);
  return {
    ...album,
    tracks: {
      items: album.tracks.items.map((track) => ({
        ...track,
        album: {
          id: album.id,
          name: album.name,
          uri: album.uri,
          artists: album.artists,
          images: album.images
        }
      }))
    }
  };
}

export async function getArtist(id: string) {
  const [artist, topTracks, albums] = await Promise.all([
    spotifyFetch<SpotifyArtist>(`/artists/${id}`),
    spotifyFetch<{ tracks: SpotifyTrack[] }>(`/artists/${id}/top-tracks?market=from_token`),
    spotifyFetch<{ items: SpotifyAlbum[] }>(`/artists/${id}/albums?include_groups=album,single&limit=12`)
  ]);

  return {
    artist,
    topTracks: topTracks.tracks,
    albums: albums.items
  };
}
