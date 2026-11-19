"use client";

import AppSidebar from "@/components/sidebar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function MyVideo() {
  const { data: videoUrl , isLoading } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3001/api/v1/videos", {
        withCredentials: true,
      });

      return res.data.videoUrl ?? [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading your videos...
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full bg-background text-foreground ">
        
      {/* Header */}
      <header className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-5 sm:px-8">
        <span className="text-accent hover:white"><AppSidebar/></span>
        <div className=" flex items-center gap-3">
          <h1 className="text-2xl font-bold text-accent sm:text-3xl border-r pr-2 border-border">
            My Videos
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm opacity-80 text-sm">
            Your generated videos, collected in one place.
          </p>
        </div>
      </header>

      {/* Video Section */}
      <main className="p-4 sm:p-6 lg:p-8 ">
        {videoUrl === null ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-muted bg-surface px-5 text-center">
            <h2 className="text-xl font-semibold">
              No videos yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your generated videos will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array(videoUrl).map((url: string , idx) => (
              <VideoCard key={idx} url={url} />
            ))}
          </div>
        )}
      </main>
    </section>
  );
}

// Video Card
function VideoCard({ url }: { url: string }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-background transition duration-200 hover:border-accent/60 hover:shadow-lg">
      
      <div className="p-3">
        <video
          src={url}
          controls
          preload="metadata"
          className="aspect-video w-full rounded-xl bg-surface object-contain"
        />
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <p className="text-sm font-medium text-accent">
          Generated Video
        </p>

        <a
          href={url}
          download
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-border opacity-80 px-3 py-1.5 text-xs font-medium transition hover:bg-background hover:text-accent"
        >
          Preview
        </a>
      </div>
    </div>
  );
}


