import express from "express";
import jwt from "jsonwebtoken";
import { signinSchema } from "../validators/validator";
import { prisma } from '../database/db';
import { randomBytes , createHash } from "node:crypto";
import bcrypt from "bcrypt";

export const signinRoute = express();


signinRoute.post("/signin", async (req,res)=>{
     const { data , success , error } = signinSchema.safeParse(req.body);
     if(!success) return res.status(400).json({message:"Invalid credentials", error: error.flatten().fieldErrors});
     const { username , password } = data ;
     
     const userExist = await prisma.user.findFirst({
        where :{     
                username
              }
        })

     if(!userExist) return res.status(401).json({message:"invalid username or password"});

    
     const isMatch = await bcrypt.compare(
        password,
        userExist.password 
     )

     if (!isMatch) return res.status(401).json({message:"Invalid username or password"});

     const JWT_SECRET = process.env.JWT_SECRET;

     if (!JWT_SECRET) {
     throw new Error("JWT_SECRET is not configured");
     }

    const accessToken = jwt.sign(
        {sub: String(userExist.id)},  
         JWT_SECRET,
         {expiresIn: "15m"}
     );

     res.cookie("accessToken" , accessToken , { 
        httpOnly : true , 
        secure : process.env.NODE_ENV === "production", 
        sameSite: "lax", 
        maxAge : 15 * 60 * 1000 
     });

     const refreshToken = randomBytes(64).toString("hex");

     const tokenHash = createHash("sha256")
     .update(refreshToken)
     .digest("hex")

     const expireAt = new Date(
     Date.now() + 7 * 24 * 60 * 60 * 1000
     );

     await prisma.refreshToken.create({
         data:{
             userId : userExist.id,
            tokenHash,
            expireAt
         }
     })

     res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure : process.env.NODE_ENV === "production",
        sameSite :"lax",
        maxAge : 7 * 24 * 60 * 60 * 1000
     })
     
     
     return res.status(200).json({
        message:"Signin successful"
     })
      
})
