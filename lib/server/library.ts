import type { QueueItem } from "@/lib/youtube/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PlaylistRecord = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  created_at: string;
};

const LOCAL_USER_SLUG = "local-user";

export async function ensureLocalLibraryUser() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("user_library")
    .upsert(
      {
        slug: LOCAL_USER_SLUG,
        display_name: "Guest Listener"
      },
      { onConflict: "slug" }
    )
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function getLibrarySnapshot() {
  const supabase = createSupabaseServerClient();
  const user = await ensureLocalLibraryUser();

  const [{ data: playlists, error: playlistsError }, { data: likedSongs, error: likedError }] = await Promise.all([
    supabase
      .from("playlists")
      .select("id,title,description,cover_image_url,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("liked_songs")
      .select("track_id,title,artist,album,artwork_url,youtube_video_id,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
  ]);

  if (playlistsError) throw playlistsError;
  if (likedError) throw likedError;

  return {
    user,
    playlists: (playlists ?? []) as PlaylistRecord[],
    likedSongs: (likedSongs ?? []).map(
      (item): QueueItem => ({
        id: item.track_id,
        title: item.title,
        artist: item.artist,
        album: item.album ?? "YouTube",
        artwork: item.artwork_url ?? "/artwork/fallback-cover.svg",
        durationLabel: "Saved",
        youtube: item.youtube_video_id
          ? {
              videoId: item.youtube_video_id,
              title: item.title,
              channelTitle: item.artist,
              thumbnail: item.artwork_url ?? "/artwork/fallback-cover.svg"
            }
          : null
      })
    )
  };
}

export async function createPlaylist(input: { title: string; description?: string | null; coverImageUrl?: string | null }) {
  const supabase = createSupabaseServerClient();
  const user = await ensureLocalLibraryUser();
  const { data, error } = await supabase
    .from("playlists")
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description ?? null,
      cover_image_url: input.coverImageUrl ?? null
    })
    .select("id,title,description,cover_image_url,created_at")
    .single();

  if (error) throw error;
  return data as PlaylistRecord;
}

export async function listPlaylists() {
  return (await getLibrarySnapshot()).playlists;
}

export async function listLikedSongs() {
  return (await getLibrarySnapshot()).likedSongs;
}

export async function getPlaylistById(id: string) {
  const supabase = createSupabaseServerClient();
  const user = await ensureLocalLibraryUser();
  const { data, error } = await supabase
    .from("playlists")
    .select("id,title,description,cover_image_url,created_at")
    .eq("user_id", user.id)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as PlaylistRecord | null;
}

export async function setLikedSong(track: QueueItem) {
  const supabase = createSupabaseServerClient();
  const user = await ensureLocalLibraryUser();

  const { error } = await supabase.from("liked_songs").upsert(
    {
      user_id: user.id,
      track_id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork_url: track.artwork,
      youtube_video_id: track.youtube?.videoId ?? null
    },
    { onConflict: "user_id,track_id" }
  );

  if (error) throw error;
}

export async function removeLikedSong(trackId: string) {
  const supabase = createSupabaseServerClient();
  const user = await ensureLocalLibraryUser();
  const { error } = await supabase.from("liked_songs").delete().eq("user_id", user.id).eq("track_id", trackId);
  if (error) throw error;
}

export async function getLikedSongIds() {
  const supabase = createSupabaseServerClient();
  const user = await ensureLocalLibraryUser();
  const { data, error } = await supabase.from("liked_songs").select("track_id").eq("user_id", user.id);
  if (error) throw error;
  return (data ?? []).map((item) => item.track_id as string);
}
