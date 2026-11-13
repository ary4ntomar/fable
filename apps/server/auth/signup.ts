import express from "express";
import { signupSchema } from "../validators/validator";
import { prisma } from '../database/db';
import bcrypt from "bcrypt";

export const signupRoute = express();

signupRoute.post("/signup",async(req,res)=>{
    const { data ,success,error } = signupSchema.safeParse(req.body);
    if(!success) return res.status(400).json({message:"invlaid credential" , error: error.flatten().fieldErrors } );
    const { username , password } = data;

    const userExist = await prisma.user.findUnique({
             where:{
                username: data.username
             }
    });

    if(userExist) return res.status(409).json({message:"user already exist"});
    
     const hashpassword = await bcrypt.hash(password , 10 );

     await prisma.user.create({
        data:{
            username,
            password : hashpassword,
        }
     })

     return res.status(201).json({message:"Account successfully created"});
})