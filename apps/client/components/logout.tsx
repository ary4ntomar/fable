// "use client"

// import { useRouter } from "next/navigation";
// import { useMutation , useQueryClient } from "@tanstack/react-query";
// import axios from "axios";

// const router = useRouter();

// export default function useLogout(){
//     const queryClient = useQueryClient();
//     const LogoutUser = useMutation({
//         mutationFn: async () =>{
//             const response = await axios.post(
//                 "http://localhost:3001/api/v1/logout",
//                 {},
//                 { withCredentials: true }
//             );
//             return response;
//         } ,

//         onSettled: () => {
//       // 1. Wipe TanStack Query client cache
//       queryClient.clear();

//       // 2. Clear any access token stored in memory/state or localStorage
//       localStorage.removeItem("accessToken");
//       // setUser(null); // reset AuthContext / Zustand if you use one

//       // 3. Redirect to login and purge Next.js Server Component cache
//       router.replace("/login");
//       router.refresh();
//     },
       
// })}
