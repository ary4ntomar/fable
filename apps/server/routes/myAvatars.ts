import {Router} from "express";
import { prisma } from "../database/db";
import { getSignedFileUrl } from "../services/storage.service";

export const fetchAvatarRouter = Router();

fetchAvatarRouter.get("/avatars", async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "invalid userID" });
  }

  const avatar = await prisma.avatar.findMany({
    where: {
      userId,
    },
    include:{
      avatarImage:true,
    }
  });

  if (avatar.length === 0 ) {
    return res.status(404).json({ message: "Avatar not found" });
  }


  const allAvatars = await Promise.all(
    avatar.map(async(avatar)=>{
      const modelImages = avatar.avatarImage.filter(
        (Img) => Img.type ==="model"
    );
   const sigendImages = await Promise.all(
    modelImages.map((img)=>getSignedFileUrl(img.url))
   );
   
   return{
    avatarId: avatar.id,
    name: avatar.name,
    images:sigendImages,
     };
  }) 
);
  
  return res.status(200).json({
    message:"Avatar fetched successfully",
    avatars: allAvatars,
  })
  
});