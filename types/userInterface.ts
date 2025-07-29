import { Response, Request,NextFunction } from "express";

export interface IUserController {
  googleAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
  googleAuthCallback(req: Request, res: Response): Promise<void>;
  authFailure(req: Request, res: Response):any;
  authSuccess(req: Request, res: Response): any;
  logout(req: Request, res: Response): any;
  getProfile(req: Request, res: Response): any;
  getAuthStatus(req: Request, res: Response): any;
}

export interface UserInterface {
    name: string,
    email: string,
    gender: 'male' | 'female' | 'other'
    password:string
}

export interface CreateUserRequest extends Request{
    body: UserInterface
}
export interface LoginUserRequest extends Request{
    body: {
        email: string,
        password:string
    }
}
export interface UserControllerImplementation {
    createUser(req: CreateUserRequest, res: Response):void
    getAllUsers(req: Request, res: Response): void
    login(req:LoginUserRequest,res:Response):void
}
