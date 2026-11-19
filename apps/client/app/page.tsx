import Link from "next/link"
export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">

        <video className="absolute inset-0 h-full w-full object-cover"
         autoPlay
         loop
         muted
         playsInline >
           <source src="/mobile.mp4" media="(max-width: 767px)" />
           <source src="/home.mp4" media="(min-width: 768px)" />
        </video>

        <div className="absolute inset-0 bg-black/80  md:bg-black/50"></div>

        <nav className="absolute z-20 flex justify-between items-center w-full p-3 sm:p-4 md:p-6 text-white">
           <span className=" text-2xl md:text-3xl font-bold text-foreground pb-2" >fable</span>
           <span className="flex items-center">
               <Link href="/signin"><button className="bg-white text-black py-1.5 px-3 md:py-2 md:px-5 m-1 md:m-2 rounded-3xl cursor-pointer transition-colors duration-200 hover:bg-[#E5E1D8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ">Signin</button></Link>
             <Link href="/signup"><button className="bg-accent text-black py-1.5 px-3 md:py-2 md:px-5 m-1 md:m-2 rounded-3xl cursor-pointer transition duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Create Account</button></Link>
           </span>
        </nav>

        <main className="absolute flex flex-col items-center justify-center inset-0 z-10 text-foreground px-4 sm:px-6">
            <h4 className=" text-xs sm:text-sm md:text-lg font-semibold tracking-wider cursor-default">YOUR VISUAL IDENTITY, REIMAGINED</h4>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-bold font-display m-1 cursor-default">One face. <span className="text-accent whitespace-nowrap">Endless possibilities.</span></h1>
            <p className=" text-xs text-center max-w-[320px] sm:max-w-md  md:text-base font-medium mt-2 md:mt-4 mb-2 tracking-wider cursor-default text-muted">Your identity,transformed into portraits and cinematic videos.</p>
            <div className="flex flex-wrap justify-center">
               <button className="bg-white text-black py-2 px-4 md:px-5 m-2 rounded-3xl cursor-pointer transition-colors duration-200 hover:bg-[#E5E1D8] focus-visible:outline-offset-2 focus-visible:outline-accent focus-visible:outline-2">Watch Demo</button>
                <Link href="/feed"><button className="bg-accent text-black py-2 px-4 md:px-5 m-2 rounded-3xl cursor-pointer transition duration-200 hover:brightness-110 focus-visible:outline-offset-2 focus-visible:outline-accent focus-visible:outline-2">Start Creating</button></Link>
            </div>
        </main>
        <footer className="absolute flex flex-col items-center justify-end bottom-0 left-0 right-0 px-3 py-5 md:p-10 text-[9px] sm:text-xs font-light tracking-wider  cursor-default z-20 text-foreground">
               PROFESSIONAL HEADSHOTS • CONSISTENT IDENTITY • CINEMATIC VIDEO
        </footer>
    </div>
  )}



