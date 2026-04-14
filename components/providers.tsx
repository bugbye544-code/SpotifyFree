"use client";

import { useEffect } from "react";
import { PlayerSync } from "@/components/player/player-sync";
import { usePlayerStore } from "@/store/player-store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const hydrate = usePlayerStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <PlayerSync />
      {children}
    </>
  );
}
