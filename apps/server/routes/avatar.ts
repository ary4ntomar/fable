import {Router} from "express";
import { uuid } from "uuidv4";
import { createImage } from "../services/image.service";
import { prisma } from "../database/db";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadFile , getSignedFileUrl } from "../services/storage.service";
import { avatarUpload } from "../middleware/upload.middleware";
import { avatarNameSchema } from "../validators/validator";
import path from "node:path";
import { APPROACHABLE_HEADSHOT_PROMPT, CLASSIC_HEADSHOT_PROMPT, MODERN_HEADSHOT_PROMPT } from "../services/prompt.service";

export const avatarRouter = Router();

avatarRouter.use(authMiddleware)

 avatarRouter.post("/avatar", avatarUpload.single("image"),async(req,res)=>{
    
          
    if(!req.file){
        return res.status(400).json({
          message:"Image is required",
        });
       }

     const {data,success,error} = avatarNameSchema.safeParse(req.body);
     if(!success) return res.status(400).json({message:"Invalid Request",error: error.flatten().fieldErrors})
    
     if(!req.userId) return res.status(401).json({message:"Unauthorized"})

   const avatarId = uuid();
   const pathName = path.extname(req.file.originalname)
   const originalKey = `avatars/${req.userId}/${avatarId}/original${pathName}`;

   await uploadFile(req.file.buffer ,originalKey, req.file.mimetype);
    const originalImageURL = await getSignedFileUrl(originalKey)


    const[ classicImage,modernImage,approachableImage ] = await Promise.all([  //promise.all runs multiple async tasks together
        createImage(CLASSIC_HEADSHOT_PROMPT, originalImageURL),
        createImage(MODERN_HEADSHOT_PROMPT,originalImageURL),
        createImage(APPROACHABLE_HEADSHOT_PROMPT,originalImageURL)
    ]);

    const classicKey  = `avatars/${req.userId}/${avatarId}/classic.png`; 
    const modernKey = `avatars/${req.userId}/${avatarId}/modern.png`; 
    const approachableKey = `avatars/${req.userId}/${avatarId}/approachable.png`; 
     
    await Promise.all([
      uploadFile(classicImage,classicKey,"image/png"),
      uploadFile(modernImage,modernKey,"image/png"),
      uploadFile(approachableImage,approachableKey,"image/png"),
    ])

     
     const avatar = await prisma.avatar.create({
        data:{
            id: avatarId ,
            userId: req.userId,
            name: data.name,
            avatarImage:{
              create :[
                 {url: originalKey, type: "user" },
                 {url: classicKey, type:"model"},
                 {url: modernKey, type:"model" },
                 {url: approachableKey, type:"model"}
              ],
            },
        },
        include:{
            avatarImage:true
        },
     });


     return res.status(201).json({
     message: "Avatar created successfully",
      avatar,
});
});
