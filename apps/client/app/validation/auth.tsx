import {z} from "zod";

export const signupSchema = z.object({
    username : 
    z.string().min(3).max(20) ,

    password : 
    z.string().min(8,{ message: "Password must be at least 8 characters long" }).max(100),

    confirmPassword : 
    z.string().min(8,{ message: "Password must be at least 8 characters long" }).max(100),

}).refine((data)=>data.password === data.confirmPassword,{
    message:"Password do not match",
    path: ["confirmPassword"],
});

export const signinSchema = z.object({
    username : 
    z.string().min(3).max(20) ,

    password : 
    z.string().min(8,{ message: "Password must be at least 8 characters long" }).max(100),

})