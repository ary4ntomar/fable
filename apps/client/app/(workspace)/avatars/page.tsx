
"use client";

import { CloudUpload, Scan, Download, X, Image } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AvatarResponse } from "@/app/validation/avatar";
import AppSidebar from "@/components/sidebar";

export default function Avatar() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [prevFile, setPrevFile] = useState<string | null>(null);
  const [avatarName, setAvatarName] = useState("");
  const [prevImg, setPrevImg] = useState<string | null>(null);

  // Preview uploaded reference image
  useEffect(() => {
    if (!file) {
      setPrevFile(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPrevFile(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Avatar generation API
  const avatarMutation = useMutation<AvatarResponse, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post(
        "http://localhost:3001/api/v1/avatar",
        formData,
        { withCredentials: true }
      );

      return response.data;
    },
  });

  // Generate three headshots
  const handleGenerate = () => {
    if (!file || !avatarName.trim()) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", avatarName.trim());

    avatarMutation.mutate(formData);
  };

  // Validate uploaded image
  const handleFile = (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Please select a JPG, PNG or WEBP image.");
      return;
    }

    setFile(selectedFile);
    avatarMutation.reset();
  };

  // Generated images
  const img = avatarMutation.data?.images;

  const imgRes = img?.map((url, index) => (
    <div
      key={index}
      className="relative h-full w-full overflow-hidden rounded-xl group"
    >
      <img
        src={url}
        alt={`Generated avatar ${index + 1}`}
        className="h-full w-full object-cover"
      />

      {/* Image actions */}
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button
          type="button"
          onClick={() => setPrevImg(url)}
          title="Preview image"
          aria-label={`Preview headshot ${index + 1}`}
          className="rounded-lg border border-white/15 bg-black/70 p-2 text-white backdrop-blur-sm transition hover:bg-accent hover:text-background"
        >
          <Scan size={17} />
        </button>

        <a
          href={url}
          download={`generated-avatar-${index + 1}.png`}
          title="Download image"
          aria-label={`Download headshot ${index + 1}`}
          className="rounded-lg border border-white/15 bg-black/70 p-2 text-white backdrop-blur-sm transition hover:bg-accent hover:text-background"
        >
          <Download size={17} />
        </a>
      </div>

      <span className="absolute left-3 top-3 rounded-md border border-white/15 bg-black/60 px-2 py-1 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
        HEADSHOT 0{index + 1}
      </span>
    </div>
  ));

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Page Header */}
      <header className=" px-4 pt-4 sm:px-6">
        <div className="flex gap-2 items-center"> 
            <span className="text-accent hover:white"><AppSidebar></AppSidebar></span>
          <h1 className="text-2xl font-semibold tracking-tight text-accent border-r pr-2 border-border">
            Avatar Studio
          </h1>
          <p className="mt-1 text-sm text-foreground opacity-80">
            Create professional portraits from a single reference photo.
          </p>
        </div>
      </header>

      <main className="grid grid-cols-1 gap-5 p-4 sm:p-6 lg:grid-cols-[350px_minmax(0,1fr)] lg:items-start">

        {/* LEFT PANEL */}
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:p-5">

          <div>
            <h2 className="text-base font-semibold text-accent">
              Create your avatar
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-foreground opacity-80">
              Upload a clear reference photo and we'll create three professional headshots.
            </p>
          </div>

          {/* Reference Image Upload */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-foreground">
              Reference photo
            </span>

            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  fileInputRef.current?.click();
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => e.preventDefault()}
              className="flex h-52 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-accent/50 bg-background/50 transition hover:border-accent hover:bg-background"
            >
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  handleFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />

              {prevFile ? (
                <img
                  src={prevFile}
                  alt="Reference photo preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent">
                    <CloudUpload size={21} />
                  </div>

                  <span className="text-sm font-semibold">
                    Upload reference photo
                  </span>

                  <span className="mt-1 text-xs text-muted-foreground">
                    Drag and drop or browse files
                  </span>

                  <span className="mt-2 text-[10px] tracking-wide text-muted-foreground">
                    JPG · PNG · WEBP
                  </span>
                </>
              )}
            </div>

            {file && (
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-muted-foreground">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    avatarMutation.reset();
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="shrink-0 text-xs text-accent hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Project Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="avatar-name"
              className="text-xs font-medium"
            >
              Project name
            </label>

            <input
              id="avatar-name"
              type="text"
              value={avatarName}
              onChange={(e) => setAvatarName(e.target.value)}
              placeholder="e.g. Professional Portrait"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-accent"
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
                  Number of images
                </span>
                <span className="font-medium opacity-80">03 (Fixed)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Image type
                </span>
                <span className="font-medium opacity-80">Headshots</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Visual style
                </span>
                <span className="font-medium opacity-80">Professional</span>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!file || !avatarName.trim() || avatarMutation.isPending}
            className="mt-1 w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-background transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {avatarMutation.isPending
              ? "Generating headshots..."
              : "Generate 3 Headshots"}
          </button>

          {avatarMutation.isError && (
            <p className="text-xs text-red-400">
              {avatarMutation.error.message || "Generation failed. Please try again."}
            </p>
          )}

        </section>

        {/* RIGHT PANEL */}
        <section className="flex min-w-0 flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:p-5">

          {/* Results Header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-accent">
                Generated portraits
              </h2>
              <p className="mt-1 text-xs text-muted-foreground opacity-80">
                Your professional headshot collection
              </p>
            </div>

            <span className="shrink-0 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {img?.length ?? 0} / 3
            </span>
          </div>

          {/* Image Results */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">

            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-background"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-background/70">

                  {avatarMutation.isPending ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
                      <span className="text-xs text-muted-foreground">
                        Creating portrait...
                      </span>
                    </div>
                  ) : img?.[index] ? (
                    imgRes?.[index]
                  ) : (
                    <img
                      src={`/img${index + 1}.png`}
                      alt={`Sample portrait ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  )}

                  {!avatarMutation.isPending && !img?.[index] && (
                    <span className="absolute left-2 top-2 rounded-md border border-white/10 bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-sm">
                      Sample
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-border px-3 py-3">
                  <div>
                    <p className="text-xs font-semibold opacity-80">
                      Portrait 0{index + 1}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {img?.[index] ? "Generation complete" : "Preview image"}
                    </p>
                  </div>

                  {!avatarMutation.isPending && img?.[index] && (
                    <span className="text-[10px] font-medium text-accent">
                      Ready
                    </span>
                  )}
                </div>
              </div>
            ))}

          </div>

          <p className="text-xs leading-relaxed text-muted-foreground opacity-80">
            {avatarMutation.isSuccess
              ? "Your portraits have been generated. Preview or download each image individually."
              : "Your generated portraits will appear here. Sample images are shown until generation is complete."}
          </p>

        </section>
      </main>

      {/* Full Image Preview */}
      {prevImg && (
        <div
          onClick={() => setPrevImg(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-4xl"
          >
            <button
              type="button"
              onClick={() => setPrevImg(null)}
              aria-label="Close preview"
              className="absolute -right-3 -top-3 z-10 rounded-full border border-border bg-surface p-2 text-foreground transition hover:bg-accent hover:text-background"
            >
              <X size={19} />
            </button>

            <img
              src={prevImg}
              alt="Full-size generated portrait"
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}


// "use client";



// import { CloudUpload , Scan , Download} from "lucide-react"
// import { useEffect, useRef ,useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import { AvatarResponse } from "@/app/validation/avatar";
// import { SpinnerEmpty } from "@/components/Avatarspinner";


// export default function Avatar(){

//  const fileInputRef = useRef<HTMLInputElement>(null);
//  const[file,setFile]=useState< File | null >(null);
//  const[prevFile,setPrevFile]=useState< string | null>(null);
//  const[avatarName , setAvatarName]=useState<string>("");
//  const [showOverlay, setShowOverlay] = useState(false);
//  const[prevImg,setPrevImg]=useState<string | null >(null);
    

//   useEffect(()=>{
//    if(!file) {
//    setPrevFile(null)
//    return ; }

//  const url = URL.createObjectURL(file)
//   setPrevFile(url);
         
//  return () => { URL.revokeObjectURL(url) };
//   },
//   [file]);

//   //usemutation() defines the API operation , mutationFn contains the axios request , mutate(formData) triggers that function , axios sends the request to your backend

//   const avatarMutation = useMutation<AvatarResponse, Error, FormData>({
//      mutationFn: async(formData: FormData) =>{  // mutationFn defines what happens when the api operations execute
//       const response =   await axios.post(
//      "http://localhost:3001/api/v1/avatar",
//       formData,
//       {withCredentials:true}
//        );

//      return response.data;
//       },
//     });

//     useEffect(() => {
//   if (avatarMutation.isPending) {
//     setShowOverlay(true);
//     return;
//   }

//   if (avatarMutation.isSuccess || avatarMutation.isError) {
//     const timer = setTimeout(() => {
//       setShowOverlay(false);
//     }, 1500);

//     return () => clearTimeout(timer);
//   }
// }, [avatarMutation.isPending, avatarMutation.isSuccess, avatarMutation.isError]);
   
//    const handleGenerate = ()=>{  
         
//      const formData = new FormData();
          
//       if(!file || !avatarName.trim() ) return ;
//      formData.append("image", file); 
//      formData.append("name", avatarName); 
         
//      avatarMutation.mutate(formData)

//       }


//      const img = avatarMutation.data?.images;
//      const imgRes = img?.map((url, index) => (
//       <div key={index} className="relative group w-full h-full">
//         <img
//          src={url}
//          alt={`Generated avatar ${index + 1}`}
//          className="h-full w-full object-cover rounded-xl cursor-pointer"
//          />
//          <div className="absolute bottom-3 right-3 flex gap-2">
//               <button onClick={() => setPrevImg(url)} className="p-2 rounded-lg bg-black/70 text-white hover:bg-black cursor-pointer"
//                title="Preview">
//                 <Scan size={18}/>
//                </button>
//              <a href={url} download={`generated-avatar-${index + 1}.png`}
//              className="p-2 rounded-lg bg-black/70 text-white hover:bg-black cursor-pointer"
//              title="Download">
//              <Download size={18}/>
//              </a>
//          </div>
        
//      </div>

// ));
//        return (

//      <div className="min-h-screen lg:h-full lg:overflow-hidden bg-background text-foreground">
           
//         {showOverlay && (avatarMutation.isPending || avatarMutation.isSuccess || avatarMutation.isError) && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
//             <SpinnerEmpty
//               title={
//                 avatarMutation.isPending
//                   ? "Generating..."
//                   : avatarMutation.isSuccess
//                   ? "Generation successful"
//                   : "Generation failed"
//               }
//               description={
//                 avatarMutation.isPending
//                   ? "Please wait while we generate your headshots"
//                   : avatarMutation.isSuccess
//                   ? avatarMutation.data?.message || "Your headshots are ready!"
//                   : avatarMutation.error?.message || "Something went wrong"
//               }
//             />
//           </div>
//         )}
        
//          <header className="px-3 pt-2">

//              <div className="flex items-center gap-2">

//                <span className="font-bold text-2xl mb-1 ml-1">
//                 Avatar Studio
//                </span>

//                <span className="text-xs opacity-60 ml-1">
//                 Create your digital identity
//                </span>

//              </div>

//          </header>


//         <main className="grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start gap-6 m-3">
            
//           <section className="border-r-0 lg:border-r border-border pr-0 lg:pr-6 lg:sticky lg:top-24 lg:self-start">

//              <div className="flex flex-col">
//                  <span className="font-bold ">Create your avatar</span>
//                  <span className="text-xs opacity-60 mt-1 mb-4">Upload one reference photo to generate three professional headshots.</span>
//              </div>    

//              <div className="flex flex-col justify-center items-center gap-2 bg-surface h-110 w-full  border border-border rounded-xl"> 
              
//              <div className="flex flex-col justify-center items-center bg-background/30 h-40 w-80 border border-dotted border-accent rounded-xl mb-3"  onClick={()=>fileInputRef.current?.click()}  onDrop={ (e)=> { e.preventDefault() ; setFile(e.dataTransfer.files[0] ?? null )} } onDragOver={(e) => e.preventDefault()}>


//                     <input type="file"
//                      accept="image/png,image/jpeg,image/webp"
//                      ref={fileInputRef} 
//                      className="hidden"
//                      onChange={(e)=>setFile(e.target.files?.[0] ?? null )}
//                       />

//                      {prevFile ? (<img src={prevFile} className="object-contain h-full w-full" />)  :  (
                    
//                     <>
//                      <span> <CloudUpload className="text-accent" /></span>
//                      <span className="font-bold p-1"> Upload reference image</span>
//                      <span className="text-xs opacity-80"  >JPG · PNG · WEBP </span>
//                     </>
                   

//                       ) }
//              </div>
               
//                      <input type="text" value={avatarName} onChange={(n)=>setAvatarName(n.target.value)} placeholder=" Enter Project's Name " className="text-center border border-accent border-dotted rounded-lg h-8 w-80 " />
                

//              <div className="flex flex-col gap-4 w-full px-4">
//                  <span className="text-lg font-bold">Generation settings</span>

//                  <div className="flex flex-col text-sm gap-3">
//                     <div className="flex justify-between">
//                          <span className="opacity-60" >Number of images  </span>
//                          <span>3 (fixed)</span>
//                     </div>
                    
//                     <div className="flex justify-between">
//                          <span className="opacity-60">Image Type </span>
//                          <span>Headshots</span>
//                     </div>

//                     <div className="flex justify-between">
//                          <span className="opacity-60">Style </span>
//                          <span>Professional</span>
//                     </div>
                  
                    
//                  </div>

//              </div>
               
//              <button className=" bg-accent text-background border border-border rounded-xl font-semibold px-18 py-2 m-3 cursor-pointer" onClick={handleGenerate} disabled={avatarMutation.isPending}>Generate 3 Headshots</button>

//              </div>
                

//            </section>

//            <section className="flex flex-col   border border-border rounded-xl p-1  lg:h-min-h-screen ">
             
//              <div className="flex items-center justify-between p-2">
//                  <span className="textxl font-bold ml-2">Generated results</span>
//                  <span className="text-sm opacity-60 mr-2">{img?.length ?? 0} / 3</span>
//              </div>

             
//              <div className="grid grid-cols-1 lg:grid-cols-3 m-1  gap-2 lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
//                  <span className="bg-surface w-full border border-transparent rounded-xl flex items-center justify-center">{imgRes?.[0] ?? <img src="/img1.png" className="text-muted-foreground rounded-xl"/>}</span>
//                  <span className="bg-surface  w-full border border-transparent rounded-xl flex items-center justify-center">{imgRes?.[1] ?? <img src="/img2.png" className="text-muted-foreground rounded-xl"/>}</span>
//                  <span className="bg-surface  w-full border border-transparent rounded-xl flex items-center justify-center">{imgRes?.[2] ?? <img src="/img3.png" className="text-muted-foreground rounded-xl"/>}</span>
//              </div>
//                 <p className="text-xs opacity-60 ml-1">Your generated Portraits will appear here</p>
//           </section>

//            </main>


         
//        </div>

           
 
//        )}


// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import {
//   AlertCircle,
//   ArrowDownToLine,
//   Check,
//   CloudUpload,
//   Download,
//   Film,
//   Image as ImageIcon,
//   Images,
//   Maximize2,
//   RefreshCw,
//   Sparkles,
//   Video,
//   X,
// } from "lucide-react";
// import { AvatarResponse } from "@/app/validation/avatar";
// import { SpinnerEmpty } from "@/components/Avatarspinner";
// import AppSidebar from "@/components/sidebar";


// const MAX_FILE_SIZE = 10 * 1024 * 1024;
// const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// export default function Avatar() {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [file, setFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [avatarName, setAvatarName] = useState("");
//   const [dragActive, setDragActive] = useState(false);
//   const [fileError, setFileError] = useState("");
//   const [activeImage, setActiveImage] = useState<string | null>(null);
//   const [downloading, setDownloading] = useState(false);

//   useEffect(() => {
//     if (!file) {
//       setPreviewUrl(null);
//       return;
//     }

//     const objectUrl = URL.createObjectURL(file);
//     setPreviewUrl(objectUrl);

//     return () => URL.revokeObjectURL(objectUrl);
//   }, [file]);

//   useEffect(() => {
//     if (!activeImage) return;

//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === "Escape") setActiveImage(null);
//     };

//     document.body.style.overflow = "hidden";
//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.body.style.overflow = "";
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [activeImage]);

//   const avatarMutation = useMutation<AvatarResponse, Error, FormData>({
//     mutationFn: async (formData: FormData) => {
//       const response = await axios.post<AvatarResponse>(
//         "http://localhost:3001/api/v1/avatar",
//         formData,
//         { withCredentials: true }
//       );
//       return response.data;
//     },
//   });

//   const generatedImages = Array.isArray(avatarMutation.data?.images)
//     ? avatarMutation.data.images.slice(0, 3)
//     : [];

//   const validateAndSetFile = (selectedFile?: File) => {
//     if (!selectedFile) return;

//     setFileError("");

//     if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
//       setFileError("Choose a JPG, PNG or WEBP image.");
//       return;
//     }

//     if (selectedFile.size > MAX_FILE_SIZE) {
//       setFileError("Image must be 10 MB or smaller.");
//       return;
//     }

//     setFile(selectedFile);
//     avatarMutation.reset();
//   };

//   const handleGenerate = () => {
//     if (!file || !avatarName.trim() || avatarMutation.isPending) return;

//     const formData = new FormData();
//     formData.append("image", file);
//     formData.append("name", avatarName.trim());
//     avatarMutation.mutate(formData);
//   };

//   const handleDownload = async (url: string, index: number) => {
//     try {
//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Download failed");

//       const blob = await response.blob();
//       const objectUrl = URL.createObjectURL(blob);
//       const link = document.createElement("a");

//       link.href = objectUrl;
//       link.download = `${avatarName.trim().replace(/[^a-z0-9-_]/gi, "-") || "fable-avatar"}-${index + 1}.png`;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       URL.revokeObjectURL(objectUrl);
//     } catch {
//       window.open(url, "_blank", "noopener,noreferrer");
//     }
//   };

//   const handleDownloadAll = async () => {
//     if (!generatedImages.length || downloading) return;

//     setDownloading(true);
//     try {
//       for (let index = 0; index < generatedImages.length; index += 1) {
//         await handleDownload(generatedImages[index], index);
//       }
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const canGenerate = Boolean(file && avatarName.trim()) && !avatarMutation.isPending;

//   return (
//     <main className="h-[100dvh] min-h-0 w-full overflow-hidden bg-background text-foreground">
//       <div className="mx-auto flex h-full w-full max-w-[1800px] min-h-0 flex-col px-4 pb-4 pt-4 sm:px-6 lg:px-7">
//         {/* Compact studio header */}
//         <header className="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
//           <div className="flex items-center gap-3">
//                               <span>{AppSidebar()}</span>
//                               <span className="font-sans text-[18px] text-accent font-bold tracking-[0.16em]">Avatar Studio</span>
//                       <span className="hidden h-4 w-px bg-white/15 sm:block" />
//                       <span className="hidden text-[11px] tracking-wide text-white/55 sm:block">Create your digital identity</span>
                          
//                   </div>

//           <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-[11px] text-muted-foreground">
//             <Sparkles className="h-3.5 w-3.5 text-accent" />
//             <span>3 professional headshots</span>
//           </div>
//         </header>

//         {/* Desktop: fixed-height workspace; mobile: natural document flow */}
//         <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto pb-1 lg:grid-cols-[minmax(290px,340px)_minmax(0,1fr)] lg:overflow-hidden xl:grid-cols-[360px_minmax(0,1fr)]">
//           {/* Creation controls */}
//           <aside className="flex min-h-0 flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5 lg:overflow-y-auto">
//             <div>
//               <p className="text-sm font-semibold tracking-tight">Create your avatar</p>
//               <p className="mt-1 text-xs leading-5 text-muted-foreground">
//                 Add one clear reference photo. Fable will use it to create three
//                 professional headshots.
//               </p>
//             </div>

//             {/* Upload / drop zone */}
//             <div>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/jpeg,image/png,image/webp"
//                 className="hidden"
//                 onChange={(event) => {
//                   validateAndSetFile(event.target.files?.[0]);
//                   event.currentTarget.value = "";
//                 }}
//               />

//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 onDragEnter={(event) => {
//                   event.preventDefault();
//                   setDragActive(true);
//                 }}
//                 onDragOver={(event) => {
//                   event.preventDefault();
//                   setDragActive(true);
//                 }}
//                 onDragLeave={(event) => {
//                   event.preventDefault();
//                   setDragActive(false);
//                 }}
//                 onDrop={(event) => {
//                   event.preventDefault();
//                   setDragActive(false);
//                   validateAndSetFile(event.dataTransfer.files?.[0]);
//                 }}
//                 className={`group relative flex aspect-[5/4] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed text-center transition ${
//                   dragActive
//                     ? "border-accent bg-accent/10"
//                     : "border-border bg-background/50 hover:border-accent/60 hover:bg-background/80"
//                 }`}
//               >
//                 {previewUrl ? (
//                   <>
//                     <img
//                       src={previewUrl}
//                       alt="Selected reference"
//                       className="absolute inset-0 h-full w-full object-contain p-2"
//                     />
//                     <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/65 px-3 py-2 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
//                       <RefreshCw className="h-3.5 w-3.5" />
//                       Change reference photo
//                     </span>
//                     <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white">
//                       <Check className="h-3.5 w-3.5" />
//                     </span>
//                   </>
//                 ) : (
//                   <span className="flex flex-col items-center px-4">
//                     <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent transition group-hover:scale-105">
//                       <CloudUpload className="h-5 w-5" />
//                     </span>
//                     <span className="text-sm font-semibold">Choose a reference photo</span>
//                     <span className="mt-1 text-[11px] text-muted-foreground">
//                       or drag and drop it here
//                     </span>
//                     <span className="mt-3 text-[10px] tracking-wide text-muted-foreground/75">
//                       JPG · PNG · WEBP · MAX 10 MB
//                     </span>
//                   </span>
//                 )}
//               </button>

//               {file && (
//                 <div className="mt-2 flex min-w-0 items-center justify-between gap-2 rounded-lg border border-border/70 bg-background/50 px-3 py-2">
//                   <div className="flex min-w-0 items-center gap-2">
//                     <ImageIcon className="h-4 w-4 shrink-0 text-accent" />
//                     <span className="truncate text-xs text-muted-foreground">{file.name}</span>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setFile(null);
//                       setFileError("");
//                       avatarMutation.reset();
//                     }}
//                     aria-label="Remove reference image"
//                     className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-red-500/10 hover:text-red-400"
//                   >
//                     <X className="h-3.5 w-3.5" />
//                   </button>
//                 </div>
//               )}

//               {fileError && (
//                 <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
//                   <AlertCircle className="h-3.5 w-3.5 shrink-0" />
//                   {fileError}
//                 </p>
//               )}
//             </div>

//             {/* Project name */}
//             <div className="space-y-2">
//               <label htmlFor="avatar-name" className="text-xs font-semibold text-foreground">
//                 Project name
//               </label>
//               <input
//                 id="avatar-name"
//                 type="text"
//                 value={avatarName}
//                 maxLength={50}
//                 onChange={(event) => setAvatarName(event.target.value)}
//                 placeholder="e.g. Studio Portrait"
//                 className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground/50 focus:border-accent"
//               />
//               <p className="text-right text-[10px] text-muted-foreground">
//                 {avatarName.length}/50
//               </p>
//             </div>

//             <div className="h-px shrink-0 bg-border/70" />

//             {/* Fixed generation specification */}
//             <section className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xs font-semibold tracking-wide">Generation settings</h2>
//                 <span className="text-[10px] text-muted-foreground">Preset</span>
//               </div>

//               <div className="divide-y divide-border/70 rounded-xl border border-border/80 bg-background/40 px-3">
//                 <div className="flex items-center justify-between gap-3 py-3">
//                   <span className="text-xs text-muted-foreground">Output quantity</span>
//                   <span className="text-xs font-medium">03 images</span>
//                 </div>
//                 <div className="flex items-center justify-between gap-3 py-3">
//                   <span className="text-xs text-muted-foreground">Composition</span>
//                   <span className="text-xs font-medium">Headshots</span>
//                 </div>
//                 <div className="flex items-center justify-between gap-3 py-3">
//                   <span className="text-xs text-muted-foreground">Visual direction</span>
//                   <span className="text-xs font-medium">Professional</span>
//                 </div>
//               </div>
//               <p className="text-[10px] leading-4 text-muted-foreground">
//                 These settings are fixed to keep the three outputs consistent.
//               </p>
//             </section>

//             <div className="mt-auto space-y-2 pt-1">
//               <button
//                 type="button"
//                 onClick={handleGenerate}
//                 disabled={!canGenerate}
//                 className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-background shadow-sm transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
//               >
//                 {avatarMutation.isPending ? (
//                   <>
//                     <RefreshCw className="h-4 w-4 animate-spin" />
//                     Creating headshots…
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="h-4 w-4" />
//                     Generate 3 headshots
//                   </>
//                 )}
//               </button>
//               <p className="text-center text-[10px] text-muted-foreground">
//                 One reference photo · Three generated portraits
//               </p>
//             </div>
//           </aside>

//           {/* Results workspace */}
//           <section className="flex min-h-[560px] min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface p-4 sm:p-5 lg:min-h-0">
//             <div className="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <h2 className="text-sm font-semibold tracking-tight">Generated results</h2>
//                   {avatarMutation.isSuccess && (
//                     <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-400">
//                       Complete
//                     </span>
//                   )}
//                 </div>
//                 <p className="mt-1 text-xs text-muted-foreground">
//                   Three views of the same digital identity
//                 </p>
//               </div>
//               <span className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs tabular-nums text-muted-foreground">
//                 {generatedImages.length} <span className="opacity-50">/</span> 3
//               </span>
//             </div>

//             <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
//               {[0, 1, 2].map((index) => {
//                 const imageUrl = generatedImages[index];

//                 return (
//                   <div
//                     key={index}
//                     className="group relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-background/55 sm:min-h-0"
//                   >
//                     {imageUrl ? (
//                       <>
//                         <img
//                           src={imageUrl}
//                           alt={`Generated professional headshot ${index + 1}`}
//                           className="absolute inset-0 h-full w-full object-contain"
//                         />
//                         <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/75 to-transparent px-3 pb-3 pt-10 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
//                           <span className="text-[10px] font-semibold tracking-wider text-white/90">
//                             PORTRAIT 0{index + 1}
//                           </span>
//                           <div className="flex items-center gap-1.5">
//                             <button
//                               type="button"
//                               onClick={() => setActiveImage(imageUrl)}
//                               aria-label={`Preview portrait ${index + 1}`}
//                               className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-black/35 text-white backdrop-blur transition hover:bg-white/20"
//                             >
//                               <Maximize2 className="h-3.5 w-3.5" />
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => handleDownload(imageUrl, index)}
//                               aria-label={`Download portrait ${index + 1}`}
//                               className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-black/35 text-white backdrop-blur transition hover:bg-white/20"
//                             >
//                               <ArrowDownToLine className="h-3.5 w-3.5" />
//                             </button>
//                           </div>
//                         </div>
//                       </>
//                     ) : (
//                       <div className="flex flex-col items-center px-4 text-center">
//                         <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground/65">
//                           <ImageIcon className="h-5 w-5" />
//                         </div>
//                         <span className="text-xs font-medium text-muted-foreground">
//                           Portrait 0{index + 1}
//                         </span>
//                         <span className="mt-1 text-[10px] text-muted-foreground/55">
//                           Awaiting generation
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Result actions */}
//             <div className="mt-4 flex shrink-0 flex-col gap-3 border-t border-border/70 pt-4">
//               {avatarMutation.isError && (
//                 <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 py-2.5 text-xs text-red-400">
//                   <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
//                   <span>
//                     {avatarMutation.error.message ||
//                       "Avatar generation failed. Please check your connection and try again."}
//                   </span>
//                 </div>
//               )}

//               {avatarMutation.isSuccess && generatedImages.length > 0 && (
//                 <div className="flex flex-wrap items-center justify-between gap-2">
//                   <p className="flex items-center gap-1.5 text-xs text-emerald-400">
//                     <Check className="h-3.5 w-3.5" />
//                     Your headshots are ready.
//                   </p>
//                   <button
//                     type="button"
//                     onClick={handleDownloadAll}
//                     disabled={downloading}
//                     className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-medium transition hover:border-accent/50 hover:text-accent disabled:opacity-50"
//                   >
//                     {downloading ? (
//                       <RefreshCw className="h-3.5 w-3.5 animate-spin" />
//                     ) : (
//                       <Download className="h-3.5 w-3.5" />
//                     )}
//                     Download all
//                   </button>
//                 </div>
//               )}
//                   <div className="mt-3 flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-3">
//                                <div className="flex min-w-0 items-center gap-2.5">
//                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/[0.04] text-[#B99D75]"><Film size={14} /></div>
//                                  <div className="min-w-0"><p className="text-[10px] font-medium text-white/70">Fable demo preview</p><p className="text-[9px] text-white/30">{generatedImages.length} of 3 headshots generated</p></div>
//                                </div>
//                                <div className="flex shrink-0 flex-wrap items-center gap-2">
//                                  <a  download="fable-demo-video.mp4" className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-white/[0.12] bg-white/[0.025] px-3 text-[9px] font-medium text-white/70 transition hover:border-[#B99D75]/45 hover:text-[#E8D4B4]"><Download size={12} /> Download</a>
//                                </div>
//                              </div>
//               {/* <div className="flex flex-wrap items-center gap-2">
//                 <button
//                   type="button"
//                   disabled={!avatarMutation.isSuccess || generatedImages.length === 0}
//                   title="Connect your feed API to enable publishing"
//                   className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground transition hover:border-accent/50 hover:bg-accent/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   <Images className="h-4 w-4" />
//                   Upload to Feed
//                 </button>
//                 <button
//                   type="button"
//                   disabled={!avatarMutation.isSuccess || generatedImages.length === 0}
//                   title="Connect your video studio route to enable video creation"
//                   className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground transition hover:border-accent/50 hover:bg-accent/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   <Video className="h-4 w-4" />
//                   Generate Video
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleDownloadAll}
//                   disabled={!avatarMutation.isSuccess || generatedImages.length === 0 || downloading}
//                   className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-3 text-xs font-semibold text-background transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   <Download className="h-4 w-4" />
//                   Save to device
//                 </button>
//               </div> */}
//               <p className="text-[10px] leading-4 text-muted-foreground">
//                 Feed publishing and video creation will activate when their
//                 respective API routes are connected. Individual portrait
//                 downloads and Save to device are available after generation.
//               </p>
//             </div>
//           </section>
//         </div>
//       </div>

//       {/* Generation status overlay */}
//       {avatarMutation.isPending && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/75 p-4 backdrop-blur-md">
//           <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-7 text-center shadow-2xl">
//             <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
//               <RefreshCw className="h-5 w-5 animate-spin" />
//             </div>
//             <h3 className="font-serif text-xl font-medium">Creating your identity</h3>
//             <p className="mt-2 text-sm leading-6 text-muted-foreground">
//               Generating three professional headshots from your reference photo.
//               This may take a moment.
//             </p>
//             <div className="mt-6 h-1 overflow-hidden rounded-full bg-border">
//               <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Full-size portrait viewer */}
//       {activeImage && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-6"
//           role="dialog"
//           aria-modal="true"
//           aria-label="Generated portrait preview"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget) setActiveImage(null);
//           }}
//         >
//           <div className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#171715] shadow-2xl">
//             <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
//               <div>
//                 <p className="text-sm font-semibold text-white">Portrait preview</p>
//                 <p className="mt-0.5 text-[11px] text-white/45">Generated with Fable</p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setActiveImage(null)}
//                 aria-label="Close preview"
//                 className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/70 transition hover:bg-white/10 hover:text-white"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//             <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-black/30 p-4">
//               <img
//                 src={activeImage}
//                 alt="Generated portrait full-size"
//                 className="max-h-[calc(94dvh-90px)] max-w-full rounded-lg object-contain"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }



// "use client";

// import { CloudUpload, Eye, Download, X, Image, LoaderCircle } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import { AvatarResponse } from "@/app/validation/avatar";

// export default function Avatar() {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [file, setFile] = useState<File | null>(null);
//   const [prevFile, setPrevFile] = useState<string | null>(null);
//   const [avatarName, setAvatarName] = useState("");
//   const [previewImage, setPreviewImage] = useState<string | null>(null);

//   // Sample images
//   const sampleImages = ["/img1.png", "/img2.png", "/img3.png"];

//   // Preview uploaded reference image
//   useEffect(() => {
//     if (!file) {
//       setPrevFile(null);
//       return;
//     }

//     const url = URL.createObjectURL(file);
//     setPrevFile(url);

//     return () => URL.revokeObjectURL(url);
//   }, [file]);

//   // Avatar generation API
//   const avatarMutation = useMutation<AvatarResponse, Error, FormData>({
//     mutationFn: async (formData: FormData) => {
//       const response = await axios.post(
//         "http://localhost:3001/api/v1/avatar",
//         formData,
//         { withCredentials: true }
//       );

//       return response.data;
//     },
//   });

//   // Generate three headshots
//   const handleGenerate = () => {
//     if (!file || !avatarName.trim()) return;

//     const formData = new FormData();
//     formData.append("image", file);
//     formData.append("name", avatarName);

//     avatarMutation.mutate(formData);
//   };

//   const images = avatarMutation.data?.images;

//   // Download individual image
//   const handleDownload = (url: string, index: number) => {
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `avatar-${index + 1}.png`;
//     link.target = "_blank";
//     link.click();
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground">

//       {/* Header */}
//       <header className="px-4 pt-3">
//         <h1 className="text-2xl font-bold">Avatar Studio</h1>
//         <p className="text-sm text-muted-foreground mt-1">
//           Create your digital identity
//         </p>
//       </header>

//       <main className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-5 p-4">

//         {/* Create Avatar */}
//         <section className="lg:border-r lg:border-border lg:pr-5">

//           <h2 className="font-semibold text-lg">Create your avatar</h2>
//           <p className="text-sm text-muted-foreground mt-1 mb-4">
//             Upload one reference photo to generate three professional headshots.
//           </p>

//           <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">

//             {/* Image Upload */}
//             <div
//               onClick={() => fileInputRef.current?.click()}
//               onDrop={(e) => {
//                 e.preventDefault();
//                 setFile(e.dataTransfer.files[0] ?? null);
//               }}
//               onDragOver={(e) => e.preventDefault()}
//               className="flex h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-accent bg-background/30"
//             >
//               <input
//                 type="file"
//                 accept="image/png,image/jpeg,image/webp"
//                 ref={fileInputRef}
//                 className="hidden"
//                 onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//               />

//               {prevFile ? (
//                 <img
//                   src={prevFile}
//                   alt="Reference image"
//                   className="h-full w-full object-contain"
//                 />
//               ) : (
//                 <>
//                   <CloudUpload size={30} className="text-accent mb-3" />
//                   <span className="font-semibold">Upload reference image</span>
//                   <span className="text-xs text-muted-foreground mt-1">
//                     JPG · PNG · WEBP
//                   </span>
//                 </>
//               )}
//             </div>

//             {file && (
//               <button
//                 onClick={() => {
//                   setFile(null);
//                   if (fileInputRef.current) fileInputRef.current.value = "";
//                 }}
//                 className="text-xs text-muted-foreground underline"
//               >
//                 Remove image
//               </button>
//             )}

//             {/* Project Name */}
//             <input
//               type="text"
//               value={avatarName}
//               onChange={(e) => setAvatarName(e.target.value)}
//               placeholder="Enter project name"
//               className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-accent"
//             />

//             {/* Settings */}
//             <div className="border-t border-border pt-4">
//               <h3 className="font-semibold mb-4">Generation settings</h3>

//               <div className="flex flex-col gap-3 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Number of images</span>
//                   <span>3 (fixed)</span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Image type</span>
//                   <span>Headshots</span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Style</span>
//                   <span>Professional</span>
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={handleGenerate}
//               disabled={!file || !avatarName.trim() || avatarMutation.isPending}
//               className="w-full rounded-lg bg-accent py-3 font-semibold text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {avatarMutation.isPending ? "Generating..." : "Generate 3 Headshots"}
//             </button>

//             {avatarMutation.isError && (
//               <p className="text-sm text-red-500">
//                 {avatarMutation.error.message || "Generation failed. Please try again."}
//               </p>
//             )}

//           </div>
//         </section>

//         {/* Generated Results */}
//         <section className="flex flex-col gap-4 rounded-xl border border-border p-4">

//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-semibold">Your headshots</h2>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Preview and download your images
//               </p>
//             </div>

//             <span className="text-sm text-muted-foreground">
//               {images?.length ?? 0} / 3 generated
//             </span>
//           </div>

//           {/* Image Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

//             {sampleImages.map((sample, index) => {
//               const imageUrl = images?.[index] || sample;

//               return (
//                 <div
//                   key={index}
//                   className="overflow-hidden rounded-xl border border-border bg-surface"
//                 >
//                   <div className="relative aspect-[3/4]">

//                     {avatarMutation.isPending ? (
//                       <div className="flex h-full flex-col items-center justify-center gap-3 bg-background/40">
//                         <LoaderCircle className="animate-spin text-accent" size={28} />
//                         <span className="text-xs text-muted-foreground">
//                           Generating headshot...
//                         </span>
//                       </div>
//                     ) : (
//                       <>
//                         <img
//                           src={imageUrl}
//                           alt={`Headshot ${index + 1}`}
//                           className="h-full w-full object-cover"
//                         />

//                         <span className="absolute left-2 top-2 rounded-md bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
//                           {images?.[index] ? "Generated" : "Sample preview"}
//                         </span>

//                         <button
//                           onClick={() => setPreviewImage(imageUrl)}
//                           title="Preview image"
//                           className="absolute bottom-2 right-2 rounded-lg bg-background/90 p-2 text-foreground hover:bg-accent hover:text-background"
//                         >
//                           <Eye size={18} />
//                         </button>
//                       </>
//                     )}

//                   </div>

//                   <div className="flex items-center justify-between p-3">
//                     <span className="text-sm font-medium">
//                       Headshot {index + 1}
//                     </span>

//                     {!avatarMutation.isPending && images?.[index] && (
//                       <button
//                         onClick={() => handleDownload(imageUrl, index)}
//                         title="Download image"
//                         className="text-muted-foreground hover:text-foreground"
//                       >
//                         <Download size={18} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}

//           </div>

//           <p className="text-xs text-muted-foreground">
//             {images?.length
//               ? "Your generated headshots are ready."
//               : "Sample images will be replaced when generation starts."}
//           </p>

//         </section>
//       </main>

//       {/* Image Preview */}
//       {previewImage && (
//         <div
//           onClick={() => setPreviewImage(null)}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="relative max-w-3xl"
//           >
//             <button
//               onClick={() => setPreviewImage(null)}
//               className="absolute -right-3 -top-3 rounded-full bg-background p-2"
//             >
//               <X size={20} />
//             </button>

//             <img
//               src={previewImage}
//               alt="Headshot preview"
//               className="max-h-[85vh] max-w-full rounded-xl object-contain"
//             />
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
