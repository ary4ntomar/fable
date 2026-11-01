import type { Request , Response , NextFunction } from "express";
import jwt from "jsonwebtoken";
import{env} from "../config/env";



export function authMiddleware(req:Request,res:Response,next:NextFunction){
    const authHeader = req.headers.authorization ;


    if(!authHeader || !authHeader.startsWith("Bearer ")){
         return res.status(401).json({message:"Authorization token is missing or invlaid"})
    }

    const token = authHeader.split(" ")[1];
    if(!token) return res.status(401).json({message:"Token is missing"})

    const decoded = jwt.verify(token,env.JWT_SECRET)
     if(typeof decoded !== "object" || decoded==null ||
         typeof decoded.userId !== "string"){
            return res.status(401).json({
                message:"Invalid token payload"
            })
         } 
         
         req.userId = decoded.userId ;
         return next();
}