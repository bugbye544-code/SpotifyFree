"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LibraryActions() {
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-5">
      <p className="text-sm font-semibold">Create a playlist</p>
      <p className="mt-1 text-sm text-white/[0.54]">Create a fresh playlist in your Supabase-backed library.</p>
      <div className="mt-4 flex flex-col gap-3 md:flex-row">
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Late night rotation" />
        <Button
          disabled={!name.trim() || pending}
          onClick={async () => {
            setPending(true);
            const response = await fetch("/api/library/playlists", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title: name })
            });
            setPending(false);
            if (!response.ok) {
              toast.error("Failed to create playlist");
              return;
            }
            setName("");
            toast.success("Playlist created");
            window.location.reload();
          }}
        >
          Create playlist
        </Button>
      </div>
    </div>
  );
}
