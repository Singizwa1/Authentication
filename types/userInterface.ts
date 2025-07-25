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





