"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar({ title, subtitle, userName }: { title: string; subtitle?: string; userName: string }) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-20 mb-6 flex items-center justify-between gap-4 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(18,18,18,0)_100%)] px-2 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="icon" className="bg-black/70" onClick={() => router.back()}>
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="secondary" size="icon" className="bg-black/70" onClick={() => router.forward()}>
          <ChevronRight className="size-4" />
        </Button>
        <div className="ml-1">
          <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle ? <p className="text-sm text-white/[0.55]">{subtitle}</p> : null}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white/[0.9]">{userName}</div>
        <Button variant="ghost" className="text-white/[0.72]">
          <LogOut className="size-4" />
          Local Library
        </Button>
      </div>
    </div>
  );
}
