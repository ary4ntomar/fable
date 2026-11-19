import  express  from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { avatarRouter } from "./routes/avatar";
import {videoRouter }  from "./routes/video";
import { errorHandler } from "./middleware/error.middleware";
import { fetchAvatarRouter as myAvatar } from "./routes/myAvatars";
import { fetchVideoRouter as myVideo } from "./routes/myVideo";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

//This makes your local assets folder publicly accessible through HTTP.
app.use("/assets", express.static("assets"));

//signin/signup routes
app.use("/api/v1",authRouter);


//avatar generation + auto save route
app.use("/api/v1",avatarRouter);

//video genrnation + auto save route
app.use("/api/v1/",videoRouter);

//show all avatars
app.use("/api/v1/",myAvatar);

// view generated video history? list the user's videos
app.use("/api/v1", myVideo);

 app.use(errorHandler);

app.listen(3001,()=>{
    console.log("Running on port 3001......");
});

