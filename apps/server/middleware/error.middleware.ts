import type { Request , Response , NextFunction} from "express";

export function errorHandler (
    err : any,
    req : Request,
    res : Response,
    next : NextFunction
) {

    //safety-switch
    if(res.headersSent){
        return next(err);
    }

   // smart status and msg
   const statusCode = err.statusCode || 500 ;
   const message = err.message || "Internal Server Error";
 
  // prinit to your terminal 
   console.error(err);
  
  // send the clean answer to the user 

    res.status(statusCode).json({
        message:message,
    });     
}