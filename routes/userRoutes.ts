import { Router } from "express";
import { AuthController } from "../controller/authcontroller";
import { ValidationMiddleware } from "../middlewares/validationMiddleware";
import { UserCreationValidation, LoginUserSchema } from "../schema/userSchema";
import { authMiddleware, checkRole } from "../middlewares/authMiddleware";


const userRouter = Router();
const controller = new AuthController();

userRouter.post('/users', ValidationMiddleware({ type: 'body', schema: UserCreationValidation }), controller.createUser.bind(controller));
userRouter.post('/login', ValidationMiddleware({ type: 'body', schema: LoginUserSchema }), controller.login.bind(controller));
userRouter.get('/users', authMiddleware, checkRole(['admin']), controller.getAllUsers.bind(controller));

export { userRouter }