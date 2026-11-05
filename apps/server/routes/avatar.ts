import {Router} from "express";
import { avatarSchema } from "../validators/validator";
import { uuid } from "uuidv4";
import { createImage } from "../services/image.service";
import { prisma } from "../database/db";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadFile } from "../services/storage.service";

export const avatarRouter = Router();

avatarRouter.use(authMiddleware)

 avatarRouter.post("/avatar",async(req,res)=>{

     const {data,success,error} = avatarSchema.safeParse(req.body);
     if(!success) return res.status(400).json({message:"Invalid Request",error: error.flatten().fieldErrors})
    
     if(!req.userId) return res.status(401).json({message:"Unauthorized"})

     const leftProfileId = uuid();
     const rightProfileId = uuid();
     const frontProfileId = uuid();

    const[ leftImage,rightImage,frontImage ] = await Promise.all([  //promise.all runs multiple async tasks together
        createImage("Using the provided reference photograph, generate a photorealistic professional headshot of the EXACT SAME PERSON, viewed from their LEFT SIDE in a natural 90-degree side profile. Preserve their identity with maximum accuracy: facial structure, bone structure, forehead, nose shape, lips, jawline, chin, ears, skin tone, age, hairstyle, hairline, and all distinctive facial characteristics. The person must be looking straight ahead in profile, with only one side of the face visible. Do not beautify, redesign, idealize, or alter their appearance , Preserve the exact same outfit, clothing colors, fabric, accessories and styling from the reference image; do not change or redesign any clothing. Only change the viewing angle. Create a clean professional studio portrait with soft, balanced lighting, a simple neutral background, natural skin texture, realistic details, sharp facial focus, and a natural expression. Frame the head and shoulders, keeping the entire head visible. The result must look like a real professional photography session, not an AI-generated image.", data.image),
        createImage("Using the provided reference photograph, generate a photorealistic professional headshot of the EXACT SAME PERSON, viewed from their RIGHT SIDE in a natural 90-degree side profile. Preserve their identity with maximum accuracy: facial structure, bone structure, forehead, nose shape, lips, jawline, chin, ears, skin tone, age, hairstyle, hairline, and all distinctive facial characteristics. The person must be looking straight ahead in profile, with only one side of the face visible. Do not beautify, redesign, idealize, or alter their appearance , Preserve the exact same outfit, clothing colors, fabric, accessories and styling from the reference image; do not change or redesign any clothing. Only change the viewing angle. Create a clean professional studio portrait with soft, balanced lighting, a simple neutral background, natural skin texture, realistic details, sharp facial focus, and a natural expression. Frame the head and shoulders, keeping the entire head visible. The result must look like a real professional photography session, not an AI-generated image.", data.image),
        createImage("Using the provided reference photograph, generate a photorealistic professional front-facing headshot of the EXACT SAME PERSON. The person must face directly toward the camera with their head upright, both eyes visible, both ears naturally positioned, and their face centered and symmetrical in the frame. Preserve their identity with maximum accuracy: facial structure, bone structure, forehead, eye shape, eyebrows, nose, lips, jawline, chin, ears, skin tone, age, hairstyle, hairline, and all distinctive facial characteristics. Do not beautify, redesign, idealize, or alter their appearance ,Preserve the exact same outfit, clothing colors, fabric, accessories and styling from the reference image; do not change or redesign any clothing. Only change the viewing angle. Create a clean professional studio portrait with soft, balanced lighting, a simple neutral background, natural skin texture, realistic details, sharp facial focus, and a natural expression. Frame the head and shoulders, keeping the entire head visible. The result must look like a real professional photography session, not an AI-generated image.", data.image),
     ])

    const leftKey  = `avatars/${req.userId}/${leftProfileId}.png`; 
    const rightKey = `avatars/${req.userId}/${rightProfileId}.png`; 
    const frontKey = `avatars/${req.userId}/${frontProfileId}.png`; 
     
    await Promise.all([
      uploadFile(leftImage,leftKey,"image/png"),
      uploadFile(rightImage,rightKey,"image/png"),
      uploadFile(frontImage,frontKey,"image/png"),
    ])

     
     const avatar = await prisma.avatar.create({
        data:{
            userId: req.userId,
            name: data.name,
            avatarImage:{
              create :[
                 {url: data.image, type: "user" },
                 {url: leftKey, type:"model"},
                 {url: rightKey, type:"model" },
                 {url: frontKey, type:"model"}
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
