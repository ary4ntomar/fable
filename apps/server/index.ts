import  express  from "express";
import { authRouter } from "./routes/auth";
import { avatarRouter } from "./routes/avatar";
import {videoRouter }  from "./routes/video";

const app = express();

app.use(express.json());

//This makes your local assets folder publicly accessible through HTTP.
app.use("/assets", express.static("assets"));

//signin/signup routes
app.use("/api/v1",authRouter);

//avatar generation route
app.use("/api/v1",avatarRouter);

//video genrnation route
app.use("/api/v1/",videoRouter);


app.get("/api/v1/video/:videoId",(req,res)=>{

})


app.get("/api/v1/videos",(req,res)=>{

})

app.get("/api/v1/me",(req,res)=>{

})

app.get("/api/v1/models",(req,res)=>{

})

app.get("api/v1/avatar/:avatarId",(req,res)=>{

})

app.get("api/v1/avatars",(req,res)=>{
    
})

app.listen(3000,()=>{
    console.log("Running on port 3000......")
});

