create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.user_library (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_library(id) on delete cascade,
  title text not null,
  description text,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.playlist_tracks (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null references public.playlists(id) on delete cascade,
  track_id text not null,
  title text not null,
  artist text not null,
  album text,
  artwork_url text,
  youtube_video_id text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index if not exists playlist_tracks_playlist_position_idx
  on public.playlist_tracks (playlist_id, position);

create table if not exists public.liked_songs (
  user_id uuid not null references public.user_library(id) on delete cascade,
  track_id text not null,
  title text not null,
  artist text not null,
  album text,
  artwork_url text,
  youtube_video_id text,
  created_at timestamptz not null default now(),
  primary key (user_id, track_id)
);

create unique index if not exists liked_songs_user_created_idx
  on public.liked_songs (user_id, created_at desc);

drop trigger if exists user_library_set_updated_at on public.user_library;
create trigger user_library_set_updated_at
before update on public.user_library
for each row execute function public.set_updated_at();

drop trigger if exists playlists_set_updated_at on public.playlists;
create trigger playlists_set_updated_at
before update on public.playlists
for each row execute function public.set_updated_at();
