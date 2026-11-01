import {z} from "zod";

export const signupSchema = z.object({
    username : 
    z.string().min(3).max(8) ,

    password : 
    z.string().min(8,{ message: "Password must be at least 8 characters long" }).max(100)
})


export const signinSchema = z.object({
    username : 
    z.string().min(3).max(8),

    password :
    z.string().min(1)
})


export const avatarSchema = z.object({
    name : 
    z.string().min(1),
    image :
    z.string().url().min(1)
})

export const videoSchema = z.object({
    avatarId :
     z.string() ,
    prompt : 
    z.string().min(1)
    
})