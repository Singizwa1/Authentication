import { Request, Response } from 'express';
import { ResponseService } from '../utils/response';
import { generateToken, hashPassword, comparePassword } from '../utils/helper';
import { CreateUserRequest, LoginUserRequest, UserControllerImplementation } from '../types/userInterface';
import { Database } from '../database/db';

export class AuthController implements UserControllerImplementation {

  
  public async createUser(req: CreateUserRequest, res: Response) {
    try {
      const { email, password, gender, name } = req.body;

      const userExist = await Database.User.findOne({ where: { email } });
      if (userExist) {
        return ResponseService({
          res,
          status: 400,
          message: "User already exists",
          data: null
        });
      }

      const user = await Database.User.create({
        email,
        password: await hashPassword(password),
        name,
        role: 'user',
        gender
      });

      return ResponseService({
        res,
        data: user,
        message: "User created successfully",
        status: 201,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        res,
        status: 500,
        message,
        data: stack,
        success: false
      });
    }
  }

  
  public async getAllUsers(req: Request, res: Response) {
    try {
      const users = await Database.User.findAll({ raw: true });

       ResponseService({
        res,
        data: users,
        message: "All users fetched successfully",
      });
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        res,
        data: stack,
        message,
        status: 500,
        success: false
      });
    }
  }


  public async login(req: LoginUserRequest, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await Database.User.findOne({ where: { email } });
      if (!user) {
        return ResponseService({
          res,
          status: 404,
          message: "User doesn't exist, please sign up",
          data: null
        });
      }

      const isMatching = await comparePassword(password, user.password);
      if (!isMatching) {
        return ResponseService({
          res,
          status: 401,
          message: "Invalid email or password",
          data: null
        });
      }

      const token = generateToken({ id: user.id.toString(), email: user.email, role: user.role });

      return ResponseService({
        res,
        data: { token, user },
        message: "User logged in successfully",
        status: 200,
        success: true,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        res,
        data: stack,
        message,
        status: 500,
        success: false
      });
    }
  }
}

