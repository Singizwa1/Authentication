import { Request, Response, NextFunction } from 'express';
import { ResponseService } from '../utils/response';
import { tokenBlacklist } from "../utils/tokenBlacklist";
import { IUserController } from '../types/userInterface';
import { generateToken } from '../utils/helper';
import { Database } from '../database/db';

Database;
export class UserController implements IUserController {
  
  public async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    next();
  }

  public async googleAuthCallback(req: Request, res: Response): Promise<void> {
    
    res.redirect('/dashboard');
  }

  public async authFailure(req: Request, res: Response){
    return ResponseService({
      status: 400,
      success: false,
      message: "Google Authentication Failed",
      res
    });
  }

  public async authSuccess(req: Request, res: Response){
  try {
    if (!req.user) {
      return ResponseService({
        status: 401,
        success: false,
        message: "Authentication failed - No user data",
        res
      });
    }

    const user: any = req.user;

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role || 'user' 
    });

    return ResponseService({
      status: 200,
      success: true,
      message: "Google Authentication Successful",
      data: {
        token: token,
        user: {
  
          name: user.name,
          email: user.email,
      
        
        }
      },
      res
    });

  } catch (error) {
    console.error('Auth success error:', error);
    
    return ResponseService({
      status: 500,
      success: false,
      message: "Failed to generate authentication token",
    
      res
    });
  }
}

  public async logout(req: Request, res: Response){
    try {
      
      if (req.sessionID) {
        
        tokenBlacklist.addToken(req.sessionID, 4 * 60 * 60 * 1000);
      }

      
      req.logout((err) => {
        if (err) {
          console.error('Logout error:', err);
          return ResponseService({
            status: 500,
            success: false,
            message: "Logout process failed",
            res
          });
        }
        
        
        req.session?.destroy((destroyErr) => {
          if (destroyErr) {
            console.error('Session destroy error:', destroyErr);
            return ResponseService({
              status: 500,
              success: false,
              message: "Session destruction failed",
              res
            });
          }
          
        
    
          return ResponseService({
            status: 200,
            success: true,
            message: "Logout Successful",
            res
          });
        });
      });
    } catch (error) {
      console.error
      return ResponseService({
        status: 500,
        success: false,
        message: "Logout failed",
   
        res
      });
    }
  }

  public async getProfile(req: Request, res: Response){
    try {
      if (req.user) {
        return ResponseService({
          status: 200,
          success: true,
          message: "Profile fetched successfully",
          data: {
            user: req.user
          },
          res
        });
      } else {
        return ResponseService({
          status: 401,
          success: false,
          message: "Not authenticated",
          res
        });
      }
    } catch (error) {
      console.error
      return ResponseService({
        status: 500,
        success: false,
        message: "Error fetching profile",
        
        res
      });
    }
  }

  public async getAuthStatus(req: Request, res: Response){
    return ResponseService({
      status: 200,
      success: true,
      message: "Authentication status",
      data: {
        authenticated: !!req.user,
        user: req.user || null,
        sessionId: req.sessionID || null
      },
      res
    });
  }
}