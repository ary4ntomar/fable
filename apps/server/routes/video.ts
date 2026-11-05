import { Router} from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { videoSchema } from "../validators/validator";
import { prisma } from "../database/db";
import { generateVideo } from "../services/video.service";
import { uuid } from "uuidv4";
export const videoRouter = Router();
import { uploadFile , getSignedFileUrl } from "../services/storage.service";
videoRouter.use(authMiddleware);

//Video-genration-workflow--

// 1. Check auth
// 2. Find avatar from DB using avatarId + req.userId
// 3. Include avatarImage
// 4. Take model image URLs from avatarImage
// 5. Send those URLs to generateVideo()
// 6. Save returned videoUrl in DB
// 7. Return response


videoRouter.post("/video",async(req,res)=>{

      const {data,success,error} = videoSchema.safeParse(req.body);
      if(!success) return res.status(400).json({message:"Invalid request", error: error.flatten().fieldErrors})

      if(!req.userId) return res.status(401).json({message:"Unauthorized"});
     

      // find the avatar whose ID the frontend sent
      //make sure it belongs to the current logged-in user
      //also fetch the iamges associated with that avatar

     const avatar =  await prisma.avatar.findFirst({
      where:{
            id : data.avatarId ,
            userId :  req.userId
      },
      include:{
            avatarImage:true
        },
     })

     if (!avatar) {
     return res.status(404).json({ message: "Avatar not found" });}

      const imageUrls = avatar.avatarImage
      .filter(image =>image.type ==="model") //selectd the record we want
      .map(image => image.url); //extracts something from those selected records
      
       
       if (imageUrls.length !== 3) {
      return res.status(400).json({
      message: "Avatar must have exactly 3 model reference images",
     });
    }
        const signedImageUrls = await Promise.all(
      imageUrls.map(imageUrl => getSignedFileUrl(imageUrl))
        ) 
       
     const result = await generateVideo( data.prompt ,signedImageUrls) ;
  

     const videoId = uuid(); 
     const videoKey = `videos/${req.userId}/${videoId}.mp4`;
      
    await uploadFile(result.videoBuffer,videoKey, result.contentType);

    const video = await prisma.avatarVideo.create({
         data:{
            userId : req.userId,
            prompt : data.prompt,
            videoUrl: videoKey,
            duration : 5,
            width:1280,
            height:720,
            status:"Done",
            avatarVideoRef:{
                  create:{
                        avatarId : avatar.id,
                  }
            }
         }
     })

     const playbackUrl = await getSignedFileUrl(video.videoUrl);

     return res.status(201).json({
   message: "Video generated successfully", 
   video ,
   playbackUrl,
});

     
})