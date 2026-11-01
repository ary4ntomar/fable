import jwt from "jsonwebtoken";
import { prisma } from "../database/db";
import { env } from "../config/env";
import { signupSchema , signinSchema } from "../validators/validator";


import {Router} from "express";
export const authRouter =  Router();


authRouter.post("/signup",async(req,res)=>{

   const {data,success,error} = signupSchema.safeParse(req.body);
   if(!success) return res.status(400).json({message:"Invalid signup input", error:error.flatten().fieldErrors})

   const { username,password } = data ;

   const userExist =  await prisma.user.findUnique({
           where :{ username }
   })

   if(userExist) return res.status(409).json({
         message : "User already exist"
   })     
   
   const hashedPassword = await Bun.password.hash(password);

   await prisma.user.create({
          data:{
              username ,
              password : hashedPassword
          }
   })
   
   res.status(201).json({
           message :" Signup Successfull"
   })
})

 authRouter.post("/signin",async(req,res)=>{
    
    const{data,success,error}= signinSchema.safeParse(req.body);
    if(!success) return res.status(400).json({message:"Invlaid singin inpugt",error:error.flatten().fieldErrors})

    const {username,password} =  data ;
    const userExist = await prisma.user.findFirst({
        where:{username}
    })   

    if(!userExist) return res.status(401).json({
         message:"Invlaid username or password"
    })

    const isValid = await Bun.password.verify(password, userExist.password);

    if(!isValid) return res.status(401).json({
        message:"Invalid username or password"
    })

   const token = jwt.sign({
      userId : userExist.id
   }, env.JWT_SECRET,{expiresIn : "1h"})

   res.json({
          token : token,
          message :"Signin Successfull"
   })
  
})