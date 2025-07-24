import { Request, Response, NextFunction } from 'express';
import { ResponseService } from '../utils/response';
import { tokenBlacklist } from '../utils/tokenBlacklist';

export class UserController implements IUserController {
  
  public async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    next();
  }

  public async googleAuthCallback(req: Request, res: Response): Promise<void> {
    // This is handled by Passport, but you can customize the redirect
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

  public async authSuccess(req: Request, res: Response) {
    return ResponseService({
      status: 200,
      success: true,
      message: "Google Authentication Successful",
      data: {
        user: req.user
      },
      res
    });
  }

  public async logout(req: Request, res: Response){
    try {
      // Add current session ID to blacklist
      if (req.sessionID) {
        // Blacklist for 4 hours (match your session expiration)
        tokenBlacklist.addToken(req.sessionID, 4 * 60 * 60 * 1000);
      }

      // Logout with Passport
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
        
        // Destroy session completely
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
          
          // Clear the session cookie
          res.clearCookie('connect.sid'); // Adjust if you use different session name
          
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