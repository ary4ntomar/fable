import  express  from "express";
import { authRouter } from "./routes/auth";
import { avatarRouter } from "./routes/avatar";
import {videoRouter }  from "./routes/video";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

//This makes your local assets folder publicly accessible through HTTP.
app.use("/assets", express.static("assets"));

//signin/signup routes
app.use("/api/v1",authRouter);

//avatar generation + auto save route
app.use("/api/v1",avatarRouter);

//video genrnation + auto save route
app.use("/api/v1/",videoRouter);


app.get("/api/v1/video/:videoId",(req,res)=>{
  // open one particular generated video
})


app.get("/api/v1/videos",(req,res)=>{
  // view generated video history? list the user's videos
})

app.get("/api/v1/me",(req,res)=>{
 // open my profile / get logged-in user information
})

// app.get("/api/v1/models",(req,res)=>{
//    //view avalaible generation models,if we expose model selection
// })

app.get("api/v1/avatar/:avatarId",(req,res)=>{
  // open one particular avatar + it's images
})

app.get("api/v1/avatars",(req,res)=>{
    //view saved avatars / list the user's avatar
})

//Later, we need publishing functionality:
// - Publish an avatar or video.
// - Unpublish a creation.
// - Retrieve public feed posts.
// - Retrieve a creator's published posts.





 app.use(errorHandler);

app.listen(3000,()=>{
    console.log("Running on port 3000......");
});

