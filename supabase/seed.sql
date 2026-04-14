insert into users (spotify_user_id, email, display_name, avatar_url, product)
values
  ('demo_listener', 'demo@lumaplayer.dev', 'Luma Listener', '/branding/avatar-ring.svg', 'premium')
on conflict (spotify_user_id) do nothing;

insert into artists (spotify_artist_id, name, image_url, metadata)
values
  ('demo_artist_1', 'Pulse Theory', '/artwork/pulse-theory.svg', '{"genre":"synthwave"}'),
  ('demo_artist_2', 'North Arcade', '/artwork/north-arcade.svg', '{"genre":"alt-pop"}')
on conflict (spotify_artist_id) do nothing;

insert into albums (spotify_album_id, title, cover_image_url, metadata)
values
  ('demo_album_1', 'Skyline Receiver', '/artwork/skyline-receiver.svg', '{"note":"Editorial fallback content only. Playback still comes from Spotify."}'),
  ('demo_album_2', 'Afterlight Echoes', '/artwork/afterlight-echoes.svg', '{"note":"Editorial fallback content only. Playback still comes from Spotify."}')
on conflict (spotify_album_id) do nothing;
