import { Router } from "express";
import Authrouter from "./authRoutes";
import { userRouter } from "./userRoutes";

export const router = Router();

router.use('/auth', Authrouter); 

router.use('/api/v1',userRouter)