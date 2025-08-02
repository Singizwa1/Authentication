import { Router } from "express";
import { AuthController } from "../controller/authcontroller";
import { ValidationMiddleware } from "../middlewares/validationMiddleware";
import { UserCreationValidation, LoginUserSchema } from "../schema/userSchema";
import { authMiddleware, checkRole } from "../middlewares/authMiddleware";

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and management
 * 
 * components:
 *   schemas:
 *     UserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - gender
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error or user already exists
 * 
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Admin access required
 * 
 * /api/v1/login:
 *   post:
 *     summary: Login to the system
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */

const userRouter = Router();
const controller = new AuthController();

userRouter.post('/users', ValidationMiddleware({ type: 'body', schema: UserCreationValidation }), controller.createUser.bind(controller));
userRouter.post('/login', ValidationMiddleware({ type: 'body', schema: LoginUserSchema }), controller.login.bind(controller));
userRouter.get('/users', authMiddleware, checkRole(['admin']), controller.getAllUsers.bind(controller));

export { userRouter }