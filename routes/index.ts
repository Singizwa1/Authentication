import { Router } from "express";
import Authrouter from "./authRoutes";

export const router = Router();

router.use('/auth', Authrouter); 