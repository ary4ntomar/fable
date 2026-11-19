
// "use client";

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import {
//   RefreshCw,
//   Image as ImageIcon,
//   Maximize2,
//   X,
//   Sparkles,
// } from "lucide-react";
// import AppSidebar from "@/components/sidebar";

// interface Avatar {
//   avatarId: string;
//   name: string;
//   images: string[];
// }

// interface AvatarResponse {
//   message: string;
//   avatars: Avatar[];
// }

// const fetchAvatars = async (): Promise<Avatar[]> => {
//   const res = await axios.get<AvatarResponse>(
//     "http://localhost:3001/api/v1/avatars",
//     { withCredentials: true }
//   );

//   return res.data.avatars;
// };

// export default function MyAvatar() {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   const {  data: avatars = [], isLoading, isError,  refetch, isFetching, } = useQuery({
//     queryKey: ["avatars"],
//     queryFn: fetchAvatars,
//   });

//   const images = avatars.flatMap((avatar) =>
//     avatar.images.map((url, index) => ({
//       url,
//       name: avatar.name,
//       id: `${avatar.avatarId}-${index}`,
//     }))
//   );

//   return (
//     <main className="min-h-screen bg-[#111110] text-[#f5f3ee]">
//       <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-7 sm:px-8">

//         <header className="mb-9 flex flex-col justify-between gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end">

//           <div className="flex gap-2 items-center">
//             <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c5a77b]">
//               <span className="hover:white"><AppSidebar></AppSidebar></span>
//             </div>

//             <h1 className="font-sans text-accent text-xl font-medium tracking-tight sm:text-4xl border-r pr-2 border-muted">
//               My Avatars
//             </h1>

//             <p className="mt-2 text-sm text-[#99958d]">
//               Your generated identities, collected in one place.
//             </p>
//           </div>

//           <button
//             onClick={() => refetch()}
//             disabled={isFetching}
//             className="flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm text-white/80 transition hover:border-[#c5a77b]/40 hover:bg-white/[0.08] disabled:opacity-50 sm:self-auto"
//           >
//             <RefreshCw
//               size={15}
//               className={isFetching ? "animate-spin" : ""}
//             />
//             Refresh library
//           </button>

//         </header>

//         <section>

//           <div className="mb-5 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Sparkles size={16} className="text-[#c5a77b]" />
//               <h2 className="text-sm font-semibold">
//                 Generated collection
//               </h2>
//             </div>

//             <span className="text-xs text-[#99958d]">
//               {images.length} {images.length === 1 ? "image" : "images"}
//             </span>
//           </div>

//           {isLoading && (
//             <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
//               {[1, 2, 3, 4, 5].map((item) => (
//                 <div
//                   key={item}
//                   className="aspect-[4/5] animate-pulse rounded-xl bg-white/[0.06]"
//                 />
//               ))}
//             </div>
//           )}

//           {isError && (
//             <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-center">
//               <ImageIcon size={30} className="mb-4 text-[#99958d]" />
//               <h3 className="font-medium">Unable to load your library</h3>
//               <p className="mt-2 text-sm text-[#99958d]">
//                 Please check your connection and try again.
//               </p>
//               <button
//                 onClick={() => refetch()}
//                 className="mt-5 rounded-lg bg-[#c5a77b] px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
//               >
//                 Try again
//               </button>
//             </div>
//           )}

//           {!isLoading && !isError && images.length === 0 && (
//             <div className="flex min-h-[340px] flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] text-center">
//               <ImageIcon size={34} className="mb-4 text-[#c5a77b]" />
//               <h3 className="font-serif text-2xl">
//                 No avatars yet
//               </h3>
//               <p className="mt-2 max-w-sm text-sm text-[#99958d]">
//                 Your generated avatars will appear here once you create them in Avatar Studio.
//               </p>
//             </div>
//           )}

//           {!isLoading && !isError && images.length > 0 && (
//             <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">

//               {images.map((image, index) => (
//                 <article
//                   key={image.id}
//                   className="group overflow-hidden rounded-xl border border-white/10 bg-[#191918] transition hover:-translate-y-1 hover:border-[#c5a77b]/40"
//                 >
//                   <button
//                     onClick={() => setSelectedImage(image.url)}
//                     className="relative block w-full overflow-hidden"
//                     aria-label={`Preview avatar ${index + 1}`}
//                   >
//                     <img
//                       src={image.url}
//                       alt={`Generated avatar ${index + 1}`}
//                       loading="lazy"
//                       className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
//                     />

//                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />

//                     <span className="absolute bottom-3 left-3 text-[10px] font-medium tracking-widest text-white">
//                       AVATAR {String(index + 1).padStart(2, "0")}
//                     </span>

//                     <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/40 p-2 text-white opacity-0 transition group-hover:opacity-100">
//                       <Maximize2 size={14} />
//                     </span>
//                   </button>

//                   <div className="px-3 py-3">
//                     <p className="truncate text-sm font-medium">
//                       {image.name}
//                     </p>
//                     <p className="mt-1 text-[11px] text-[#99958d]">
//                       Fable creation
//                     </p>
//                   </div>
//                 </article>
//               ))}

//             </div>
//           )}

//         </section>

//         {!isLoading && !isError && images.length > 0 && (
//           <footer className="mt-7 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-[#99958d]">
//             <span>Showing {images.length} avatars</span>
//             <span className="flex items-center gap-2">
//               <Sparkles size={13} className="text-[#c5a77b]" />
//               Created with Fable
//             </span>
//           </footer>
//         )}

//       </div>

//       {selectedImage && (
//         <div
//           onClick={() => setSelectedImage(null)}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
//         >
//           <button
//             onClick={() => setSelectedImage(null)}
//             className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20"
//             aria-label="Close preview"
//           >
//             <X size={22} />
//           </button>

//           <img
//             src={selectedImage}
//             alt="Full-size avatar preview"
//             onClick={(event) => event.stopPropagation()}
//             className="max-h-[90vh] max-w-full rounded-lg object-contain"
//           />
//         </div>
//       )}
//     </main>
//   );
// }


"use client";

import { useState } from "react";
import AppSidebar from "@/components/sidebar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Avatar {
  avatarId: string;
  name: string;
  images: string[];
}

export default function MyAvatar() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: avatars = [], isLoading } = useQuery({
    queryKey: ["avatars"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3001/api/v1/avatars", {
        withCredentials: true,
      });

      return res.data.avatars ?? [];
    },
  });

  const images = avatars.flatMap((avatar: Avatar) =>
    avatar.images.map((url: string, index: number) => ({
      url,
      name: avatar.name,
      id: `${avatar.avatarId}-${index}`,
    }))
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="animate-pulse text-sm text-muted-foreground">
          Loading your avatars...
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full bg-background text-foreground">

      {/* Header */}
      <header className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-5 sm:px-8">
        <span className="text-accent hover:white">
          <AppSidebar />
        </span>

        <div className="flex items-center gap-3">
          <h1 className="border-r border-border pr-2 text-2xl font-bold text-accent sm:text-3xl">
            My Avatars
          </h1>

          <p className="mt-1 text-xs text-muted-foreground text-sm opacity-80">
            Your generated avatars, collected in one place.
          </p>
        </div>
      </header>

      {/* Avatar Section */}
      <main className="p-4 sm:p-6 lg:p-8">

        {images.length === 0 ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-muted bg-surface px-5 text-center">
            <h2 className="text-xl font-semibold">
              No avatars yet
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Your generated avatars will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {images.map((image: { url: string; name: string; id: string }) => (
              <AvatarCard
                key={image.id}
                url={image.url}
                name={image.name}
                onPreview={() => setSelectedImage(image.url)}
              />
            ))}

          </div>
        )}

      </main>

      {/* Image Preview */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute right-5 top-5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white hover:bg-white/20"
          >
            Close ✕
          </button>

          <img
            src={selectedImage}
            alt="Avatar preview"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
          />
        </div>
      )}

    </section>
  );
}

// Avatar Card
function AvatarCard({
  url,
  name,
  onPreview,
}: {
  url: string;
  name: string;
  onPreview: () => void;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-background transition duration-200 hover:border-accent/60 hover:shadow-lg">

      <button
        onClick={onPreview}
        className="block w-full overflow-hidden bg-surface"
      >
        <img
          src={url}
          alt={name}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </button>

      <div className="flex items-center justify-between border-t border-border px-4 py-3">

        <p className="truncate text-sm font-medium text-accent">
          {name}
        </p>

        <button
          onClick={onPreview}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium opacity-80 transition hover:bg-background hover:text-accent"
        >
          Preview
        </button>

      </div>
    </div>
  );
}
