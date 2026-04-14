"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { SpotifyPlaylist, SpotifyTrack } from "@/lib/spotify/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PlaylistEditor({ playlist, tracks }: { playlist: SpotifyPlaylist; tracks: SpotifyTrack[] }) {
  const [title, setTitle] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description ?? "");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search.trim()) {
        setResults([]);
        return;
      }

      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(search)}`);
      const json = await response.json();
      setResults(json.tracks?.items ?? []);
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  async function saveMeta() {
    const response = await fetch(`/api/spotify/playlists/${playlist.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: title, description })
    });

    if (!response.ok) {
      toast.error("Failed to update playlist");
      return;
    }

    toast.success("Playlist updated");
    window.location.reload();
  }

  async function removeTrack(uri: string) {
    const response = await fetch(`/api/spotify/playlists/${playlist.id}/tracks`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uris: [uri] })
    });
    if (!response.ok) return toast.error("Unable to remove track");
    toast.success("Removed from playlist");
    window.location.reload();
  }

  async function reorder(rangeStart: number, insertBefore: number) {
    const response = await fetch(`/api/spotify/playlists/${playlist.id}/tracks/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rangeStart, insertBefore })
    });
    if (!response.ok) return toast.error("Unable to reorder track");
    toast.success("Playlist order updated");
    window.location.reload();
  }

  async function addTrack(uri: string) {
    const response = await fetch(`/api/spotify/playlists/${playlist.id}/tracks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uris: [uri] })
    });
    if (!response.ok) return toast.error("Unable to add track");
    toast.success("Added to playlist");
    setSearch("");
    setResults([]);
    window.location.reload();
  }

  async function uploadImage(file: File) {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== "string") {
          reject(new Error("Invalid image payload"));
          return;
        }
        resolve(result.split(",")[1] ?? "");
      };
      reader.onerror = () => reject(reader.error ?? new Error("Failed to read image"));
      reader.readAsDataURL(file);
    });
    const response = await fetch(`/api/spotify/playlists/${playlist.id}/image`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64 })
    });
    if (!response.ok) return toast.error("Unable to upload playlist cover");
    toast.success("Playlist cover updated");
    window.location.reload();
  }

  return (
    <div className="space-y-4 rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-5">
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Playlist title" />
        <Input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Playlist description" />
        <Button onClick={saveMeta}>
          <Save className="size-4" />
          Save details
        </Button>
      </div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium">
        <ImagePlus className="size-4" />
        Upload cover
        <input type="file" accept="image/jpeg" className="hidden" onChange={(event) => event.target.files?.[0] && uploadImage(event.target.files[0])} />
      </label>
      <div className="rounded-[24px] bg-white/[0.03] p-4">
        <p className="mb-3 text-sm font-semibold">Add songs</p>
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Spotify and add tracks" />
        {results.length ? (
          <div className="mt-3 space-y-2">
            {results.slice(0, 5).map((track) => (
              <div key={track.id} className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{track.name}</p>
                  <p className="text-sm text-white/[0.52]">{track.artists.map((artist) => artist.name).join(", ")}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => addTrack(track.uri)}>
                  Add
                </Button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div key={`${track.id}-${index}`} className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3">
            <div>
              <p className="text-sm font-medium">{track.name}</p>
              <p className="text-sm text-white/[0.52]">{track.artists.map((artist) => artist.name).join(", ")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" disabled={index === 0} onClick={() => reorder(index, index - 1)}>
                <ArrowUp className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" disabled={index === tracks.length - 1} onClick={() => reorder(index, index + 2)}>
                <ArrowDown className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeTrack(track.uri)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
