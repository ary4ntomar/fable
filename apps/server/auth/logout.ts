import express from "express";
import { randomBytes , createHash } from "node:crypto";
import { prisma } from '../database/db';

export const logoutRoute = express();

logoutRoute.post("/logout", async (req,res)=>{
     
     const refreshToken  = req.cookies.refreshToken ;
      
     if(refreshToken){
        const hashToken = createHash("sha256")
       .update(refreshToken)
       .digest("hex")

     await prisma.refreshToken.updateMany({
         where: {
            tokenHash : hashToken,
            revokedAt : null
         }, 
         data: {
            revokedAt: new Date()
         }
      })
    };

     res.clearCookie("refreshToken");
     res.clearCookie("accessToken");


     return res.status(200).json({
        message:"Logout Successfull"
     })
})