import { CloudUpload  , Image , Images , Download ,Video} from "lucide-react"

export default function Avatar(){
       return (

       <div className=" h-screen overflow-hidden bg-background text-foreground">

         <header className="px-3 pt-2">

             <div className="flex items-center gap-2">

               <span className="font-bold text-2xl mb-1 ml-1">
                Avatar Studio
               </span>

               <span className="text-xs opacity-60 ml-1">
                Create your digital identity
               </span>

             </div>

         </header>


        <main className="grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start gap-6 m-3">
            
          <section className="border-r-0 lg:border-r border-border pr-0 lg:pr-6 lg:sticky lg:top-24 lg:self-start">

             <div className="flex flex-col">
                 <span className="font-bold ">Create your avatar</span>
                 <span className="text-xs opacity-60 mt-1 mb-4">Upload one reference photo to generate three professional headshots.</span>
             </div>    

             <div className="flex flex-col justify-center items-center gap-2 bg-surface h-110 w-full  border border-border rounded-xl"> 
              
             <div className="flex flex-col justify-center items-center bg-background/30 h-40 w-80 border border-dotted border-accent rounded-xl mb-3">

                 <span> <CloudUpload className="text-accent"/></span>
                 <span className="font-bold p-1">Upload  reference photo</span>
                 <span className="text-xs opacity-80">JPG · PNG · WEBP </span>

             </div>

             <div className="flex flex-col gap-4 w-full px-4">
                 <span className="text-lg font-bold">Generation settings</span>

                 <div className="flex flex-col text-sm gap-3">
                    <div className="flex justify-between">
                         <span className="opacity-60" >Number of images  </span>
                         <span>3 (fixed)</span>
                    </div>
                    
                    <div className="flex justify-between">
                         <span className="opacity-60">Image Type </span>
                         <span>Headshots</span>
                    </div>

                    <div className="flex justify-between">
                         <span className="opacity-60">Style </span>
                         <span>Professional</span>
                    </div>
                  
                    
                 </div>

             </div>
               
             <button className=" bg-accent text-background border border-border rounded-xl font-semibold px-18 py-2 m-3">Generate 3 Headshots</button>

             </div>
                

           </section>

           <section className="flex flex-col gap-5  border border-border rounded-xl p-1  lg:h-[calc(100vh-7rem)] ">
             
             <div className="flex items-center justify-between p-2">
                 <span className="textxl font-bold ml-2">Generated results</span>
                 <span className="text-sm opacity-60 mr-2">0 / 3</span>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-3 m-1 gap-3 lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
                 <span className="bg-surface aspect-[9/16] w-full border border-transparent rounded-xl flex items-center justify-center"><Image className="text-muted-foreground" size={32} /></span>
                 <span className="bg-surface aspect-[9/16] w-full border border-transparent rounded-xl flex items-center justify-center"><Image  className="text-muted-foreground" size={32}/></span>
                 <span className="bg-surface aspect-[9/16] w-full border border-transparent rounded-xl flex items-center justify-center"><Image  className="text-muted-foreground" size={32}/></span>
             </div>
               
                <p className="text-xs opacity-60 ml-1">Your generated Portraits will appear here</p>

             <div className="flex justify-between p-1 mb-5">
                <button className="bg-accent text-background border border-transparent rounded-xl px-10 py-2 text-sm font-semibold  flex justify-center items-center gap-2"><Images />Upload to Feed</button>
                <button  className="bg-accent text-background border border-transparent rounded-xl px-10 py-2 text-sm font-semibold  flex justify-center items-center gap-2"><Video />Generate Video</button>
                <button  className="bg-accent text-background border border-transparent rounded-xl px-10 py-2 text-sm font-semibold  flex justify-center items-center gap-2"><Download />Save in Device</button>
             </div>  

          </section>
           </main>

       </div>
       )}