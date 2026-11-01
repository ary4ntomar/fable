import {Router} from "express";
import { avatarSchema } from "../validators/validator";
import { uuid } from "uuidv4";
import { createImage } from "../services/image.service";
import { prisma } from "../database/db";
import { authMiddleware } from "../middleware/auth.middleware";

export const avatarRouter = Router();

avatarRouter.use(authMiddleware)

 avatarRouter.post("/avatar",async(req,res)=>{

     const {data,success,error} = avatarSchema.safeParse(req.body);
     if(!success) return res.status(400).json({message:"Invalid Request",error: error.flatten().fieldErrors})
    
     if(!req.userId) return res.status(401).json({message:"Unauthorized"})

     const leftProfileId = uuid();
     const rightProfileId = uuid();
     const frontProfileId = uuid();

     await Promise.all([  //promise.all runs multiple async tasks together
        createImage("Create a side profile for the left side.It should be high quality portfolio shoot type photo", data.image,`./assets/${leftProfileId}.png`),
        createImage("Create a side profile for the right side.It should be high quality portfolio shoot type photo", data.image,`./assets/${rightProfileId}.png`),
        createImage("Create a side profile for the front side.It should be high quality portfolio shoot type photo", data.image,`./assets/${frontProfileId}.png`),
     ])


     //saving in S3 is pending
     
     const avatar = await prisma.avatar.create({
        data:{
            userId: req.userId,
            name: data.name,
            avatarImage:{
              create :[
                 {url: data.image, type: "user" },
                 {url:`/assets/${leftProfileId}.png`, type:"model"},
                 {url:`/assets/${rightProfileId}.png`, type:"model" },
                 {url:`/assets/${frontProfileId}.png`, type:"model"}
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
