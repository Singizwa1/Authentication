import { Router } from "express";
// import Authrouter from "./authRoutes";
import { userRouter } from "./userRoutes";
import { blogRouter } from "./blogRoutes";
import { commentLikeRouter } from "./commentLikeRoutes";

export const router = Router();

// router.use('/auth', Authrouter); 

router.use('/api/v1', userRouter);
router.use('/api/v1', blogRouter);
router.use('/api/v1', commentLikeRouter);