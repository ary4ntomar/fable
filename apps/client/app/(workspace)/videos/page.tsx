
"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Download, Film } from "lucide-react";
import AppSidebar from "@/components/sidebar";

interface Avatar {
  avatarId: string;
  name: string;
  images: string[];
}

interface AvatarResponse {
  message: string;
  avatars: Avatar[];
}

interface VideoResponse {
  message: string;
  playbackUrl: string;
}

// Fetch avatars
const fetchAvatars = async (): Promise<Avatar[]> => {
  const response = await axios.get<AvatarResponse>(
    "http://localhost:3001/api/v1/avatars",
    { withCredentials: true }
  );

  return response.data.avatars;
};

// Generate video
const generateVideo = async (data: {
  avatarId: string;
  prompt: string;
}): Promise<string> => {
  const response = await axios.post<VideoResponse>(
    "http://localhost:3001/api/v1/video",
    data,
    { withCredentials: true }
  );

  return response.data.playbackUrl;
};

export default function Video() {
  const [avatarId, setAvatarId] = useState("");
  const [prompt, setPrompt] = useState("");

  // Fetch user's avatars
  const {
    data: avatars = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["avatars"],
    queryFn: fetchAvatars,
  });

  // Video generation
  const videoMutation = useMutation({
    mutationFn: generateVideo,
  });

  const selectedAvatar = avatars.find(
    (avatar) => avatar.avatarId === avatarId
  );

  const handleGenerate = () => {
    if (!avatarId || !prompt.trim()) return;

    videoMutation.mutate({
      avatarId,
      prompt: prompt.trim(),
    });
  };

  const videoUrl = videoMutation.data;

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Page Header */}
      <header className="px-4 pt-4 sm:px-6">
        <div className="flex gap-2 items-center">
           <span className="text-accent hover:white"><AppSidebar></AppSidebar></span>
          <h1 className="text-2xl font-semibold tracking-tight text-accent border-r pr-3 border-border">
            Video Studio
          </h1>

          <p className="mt-1 text-sm text-foreground opacity-70 ">
            Bring your digital identity to life with AI video generation.
          </p>
        </div>
      </header>

      <main className="grid grid-cols-1 gap-5 p-4 sm:p-6 lg:grid-cols-[350px_minmax(0,1fr)] lg:items-start">

        {/* LEFT PANEL */}
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:p-5">

          <div>
            <h2 className=" font-semibold text-accent">
              Create your video
            </h2>

            <p className="mt-1 text-xs leading-relaxed text-foreground opacity-80">
              Select one of your avatars and describe the scene.
            </p>
          </div>

          {/* Avatar Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium opacity-80">
              Select avatar
            </label>

            <select
              value={avatarId}
              onChange={(e) => {
                setAvatarId(e.target.value);
                videoMutation.reset();
              }}
              disabled={isLoading || avatars.length === 0}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-accent disabled:opacity-50"
            >
              <option value="">Choose an avatar</option>

              {avatars.map((avatar) => (
                <option key={avatar.avatarId} value={avatar.avatarId}>
                  {avatar.name}
                </option>
              ))}
            </select>

            {isLoading && (
              <p className="text-xs text-muted-foreground">
                Loading avatars...
              </p>
            )}

            {isError && (
              <p className="text-xs text-red-400">
                Unable to load avatars.
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="ml-1 underline"
                >
                  Try again
                </button>
              </p>
            )}

            {!isLoading && !isError && avatars.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No avatars found. Create an avatar first.
              </p>
            )}
          </div>

          {/* Selected Avatar */}
          {selectedAvatar && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium">
                Reference images
              </span>

              <div className="grid grid-cols-3 gap-2">
                {selectedAvatar.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Reference ${index + 1}`}
                    className="aspect-square w-full rounded-lg border border-border object-cover"
                  />
                ))}
              </div>

              <p className="text-[10px] text-muted-foreground">
                Three reference images will be used for generation.
              </p>
            </div>
          )}

          {/* Scene Description */}
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium opacity-80">
                Scene description
              </label>

              <span className="text-[10px] text-foreground opacity-80">
                {prompt.length}/300
              </span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                videoMutation.reset();
              }}
              maxLength={300}
              rows={4}
              placeholder="Describe the scene, movement and camera direction..."
              className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-accent"
            />
          </div>

          {/* Generation Settings */}
          <div className="border-t border-border pt-4">
            <h3 className="mb-4 text-sm font-semibold">
              Generation settings
            </h3>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Duration
                </span>
                <span className="font-medium opacity-80">5 seconds</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Resolution
                </span>
                <span className="font-medium opacity-80">720p</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Aspect ratio
                </span>
                <span className="font-medium opacity-80">16:9</span>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={
              !avatarId ||
              !prompt.trim() ||
              videoMutation.isPending
            }
            className="mt-1 w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-background transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {videoMutation.isPending
              ? "Generating video..."
              : "Generate Video"}
          </button>

          {videoMutation.isError && (
            <p className="text-xs text-red-400">
              {videoMutation.error.message ||
                "Video generation failed. Please try again."}
            </p>
          )}

        </section>

        {/* RIGHT PANEL */}
        <section className="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:p-5">

          {/* Preview Header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-accent">
                Video Preview
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Preview your generated video
              </p>
            </div>

            <Film size={20} className="text-accent" />
          </div>

          {/* Video Player */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-background">

            {videoMutation.isPending ? (
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />

                <span className="text-xs text-muted-foreground">
                  Creating your video...
                </span>

                <span className="text-[10px] text-muted-foreground">
                  This may take a few minutes.
                </span>
              </div>
            ) : (
              <>
                <video
                  key={videoUrl || "sample-video"}
                  src={videoUrl || "/video.mp4"}
                  controls
                  playsInline
                  className="h-full w-full object-contain"
                />

                {!videoUrl && (
                  <span className="absolute left-3 top-3 rounded-md border border-white/10 bg-black/60 px-2 py-1 text-[10px] text-white">
                    Sample preview
                  </span>
                )}
              </>
            )}

          </div>

          {/* Video Actions */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-xs font-semibold">
                {videoUrl ? "Video generated" : "Video output"}
              </p>

              <p className="mt-1 text-[10px] text-muted-foreground">
                {videoUrl
                  ? "Your video is ready to watch."
                  : "Your generated video will appear here."}
              </p>
            </div>

            {videoUrl && (
              <a
                href={videoUrl}
                download="fable-video.mp4"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium transition hover:border-accent"
              >
                <Download size={14} />
                Download
              </a>
            )}
          </div>

        </section>
      </main>
    </div>
  );
}
