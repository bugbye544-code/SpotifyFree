"use client";

import { useRouter } from "next/navigation";
import { ListPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CreatePlaylistButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="w-full justify-start rounded-2xl px-4 py-3 text-sm font-medium text-white/[0.58] hover:bg-white/[0.07] hover:text-white"
      onClick={async () => {
        const response = await fetch("/api/library/playlists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "New Playlist", description: "Created from the sidebar" })
        });

        if (!response.ok) {
          toast.error("Failed to create playlist");
          return;
        }

        toast.success("Playlist created");
        router.push("/library");
        router.refresh();
      }}
    >
      <ListPlus className="size-5" />
      Create Playlist
    </Button>
  );
}
