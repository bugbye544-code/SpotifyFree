import { AppShell } from "@/components/layout/app-shell";
import { YouTubeSearchShell } from "@/components/search/youtube-search-shell";

export default async function SearchPage() {
  return (
    <AppShell userName="Guest Listener" title="Search" subtitle="Use the top search bar to find tracks and play them instantly">
      <YouTubeSearchShell />
    </AppShell>
  );
}
