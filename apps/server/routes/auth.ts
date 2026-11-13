import  { Router } from "express";
import { signupRoute } from "../auth/signup";
import { signinRoute } from "../auth/signin";
import { refreshRoute } from "../auth/refresh";
import { logoutRoute } from "../auth/logout";

export const authRouter = Router();

authRouter.use(signupRoute);
authRouter.use(signinRoute);
authRouter.use(refreshRoute);
authRouter.use(logoutRoute);

