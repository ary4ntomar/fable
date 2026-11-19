"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signinSchema } from "../app/validation/auth";
import type { FormEvent } from 'react';
import axios , { isAxiosError} from "axios";
import { Button } from "@/components/ui/button";
import {  Eye,EyeClosed } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";

export function SigninForm({ ...props }: React.ComponentProps<typeof Card>) {

  const router = useRouter();

   const [username,setUsername] = useState("");
   const [password,setPassword] = useState("");
   const [loading , setLoading] = useState(false);
   const [error, setError] = useState("");
   const [showPass , setShowPass] = useState(false);


   const handleSubmit =  async (event : FormEvent<HTMLFormElement>) =>{
     event.preventDefault();
      setError("");
       
      const result = signinSchema.safeParse ( { username , password } );
         if (!result.success) {
          setError(result.error.issues[0]?.message ?? "Invalid input");
           return ;
       } else {
          setLoading(true);
 try {
       await axios.post(
        "http://localhost:3001/api/v1/signin",
             {
                username: result.data.username,
                password: result.data.password,
             },{
              headers:{
                "Content-Type" : "application/json",
              },
              withCredentials : true,
             }
        );

        router.push("/avatars"); 
     } catch(err){
       if(isAxiosError(err) && err.response){
             setError(err.response.data?.message || "Something went wrong during singin");
         } else {
           setError("Unable to connect to the server. Please try again")
         }
      } finally{
        setLoading(false);
      }  
   }   
 }

  return (
    <Card className="border-[#302E2A] bg-[#191918]/80 text-[#F3F0E9] backdrop-blur-xl shadow-2xl" {...props}>
      <CardHeader>
        <CardTitle  className="text-3xl font-medium text-[#F3F0E9]">Signin to your account</CardTitle>
        <CardDescription className="text-[#A7A39B]">
          Enter your information below to login your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username" className="text-[#D8D2C8]">Username</FieldLabel>
              <Input id="username" value={username} onChange={(e)=>setUsername(e.target.value)} type="text" placeholder="Enter your username " required className="border-[#302E2A] bg-black/20 text-[#F3F0E9] placeholder:text-[#77736D] focus-visible:border-[#C7A77A]/60 focus-visible:ring-0" />
               <FieldDescription>
                Must be at least 3 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className=" relative flex items-center">
              <Input id="password" 
              value={password} 
              onChange={(e)=>setPassword(e.target.value)}
               type= {showPass ? "text" : "password"  } 
               placeholder="Enter your password"
               required  className="border-[#302E2A] bg-black/20 text-[#F3F0E9] placeholder:text-[#77736D] focus-visible:border-[#C7A77A]/60 focus-visible:ring-0 pr-10"/>
               <button
               type="button"
               onClick={() => setShowPass((prev) => !prev)}
               className="absolute right-3 text-[#77736D] hover:text-[#F3F0E9] focus:outline-none"
               >    
              {showPass ? <Eye className="w-5 h-5" /> : <EyeClosed className="w-5 h-5" />}
               </button>
              </div>
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
             </Field>
             {error && (
             <FieldDescription className="text-red-400">
                    {error}
             </FieldDescription>
             )}
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading}  className="w-full bg-[#C7A77A] text-[#10100F] hover:bg-[#D5B88F]">Signin</Button>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

