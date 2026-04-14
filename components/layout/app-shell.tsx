"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Home, Search } from "lucide-react";
import { BottomPlayer } from "@/components/player/bottom-player";
import { Sidebar } from "@/components/layout/sidebar";
import { navigationLinks } from "@/components/layout/navigation-links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSearchUiStore } from "@/store/search-ui-store";

export function AppShell({
  userName,
  title,
  subtitle,
  children
}: {
  userName: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isSearchPage = pathname.startsWith("/search");
  const query = useSearchUiStore((state) => state.query);
  const setQuery = useSearchUiStore((state) => state.setQuery);
  const resetQuery = useSearchUiStore((state) => state.reset);

  useEffect(() => {
    if (!isSearchPage) {
      resetQuery();
    }
  }, [isSearchPage, resetQuery]);

  return (
    <div className="flex min-h-screen flex-col bg-background p-2">
      <div className="flex min-h-0 flex-1 gap-2">
        <Sidebar userName={userName} />
        <main className="min-h-0 flex-1 overflow-hidden rounded-[8px] bg-panel page-gradient">
          <div className="flex h-full flex-col">
            <div className="spotify-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-28 md:px-6">
              <div className="flex gap-2 overflow-x-auto pb-3 pt-3 lg:hidden">
                {navigationLinks.map((link) => {
                  const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
                        active ? "bg-white text-black" : "bg-white/[0.08] text-white/[0.72] hover:text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <header className="sticky top-0 z-30 -mx-4 mb-8 bg-[linear-gradient(180deg,rgba(0,0,0,0.68)_0%,rgba(18,18,18,0.82)_42%,rgba(18,18,18,0)_100%)] px-4 py-4 backdrop-blur-md md:-mx-6 md:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
                    <Button variant="secondary" size="icon" className="h-8 w-8 bg-black/70 hover:bg-black" onClick={() => router.back()}>
                      <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="hidden h-8 w-8 bg-black/70 hover:bg-black sm:inline-flex"
                      onClick={() => router.forward()}
                    >
                      <ChevronRight className="size-4" />
                    </Button>

                    {isSearchPage ? (
                      <div className="relative ml-1 max-w-[540px] flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/[0.55]" />
                        <Input
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="What do you want to play?"
                          className="h-12 border-white/10 bg-[#242424] pl-11 pr-4 text-[14px] font-medium text-white placeholder:text-white/[0.45] focus:border-white/20 focus:bg-[#2a2a2a]"
                        />
                      </div>
                    ) : (
                      <div className="min-w-0 pl-1">
                        <h1 className="truncate text-[2rem] font-bold tracking-[-0.03em] text-white">{title}</h1>
                        {subtitle ? <p className="mt-1 text-sm text-white/[0.6]">{subtitle}</p> : null}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/"
                      className={cn(
                        "grid h-12 w-12 place-items-center rounded-full transition-colors duration-200",
                        pathname === "/" ? "bg-white text-black" : "bg-black/70 text-white/[0.7] hover:text-white"
                      )}
                      aria-label="Home"
                    >
                      <Home className="size-5" />
                    </Link>
                    <div className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">{userName}</div>
                  </div>
                </div>
              </header>

              {children}
            </div>
          </div>
        </main>
      </div>
      <BottomPlayer />
    </div>
  );
}
