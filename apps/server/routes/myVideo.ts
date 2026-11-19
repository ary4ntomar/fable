import {Router} from "express";
import { prisma } from "../database/db";
import { getSignedFileUrl } from "../services/storage.service";

export const fetchVideoRouter = Router();

fetchVideoRouter.get("/videos",async(req,res)=>{
     const userId = req.userId ;
     if(!userId) return res.status(400).json({message:"invald UserID"});

     const fetchVideo = await prisma.avatarVideo.findFirst({
        where:{
            userId
        }
     })

     
  if (fetchVideo === null ) {
    return res.status(404).json({ message: "Avatar not found" });
  }

      const videoUrl = fetchVideo.videoUrl ;

       const signedVideo = await getSignedFileUrl(videoUrl);

       return res.status(200).json({
         message: "Video fetched successfully",
         videoUrl: signedVideo
});

})


