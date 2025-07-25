import{Request,Response,NextFunction } from "express";
import { tokenBlacklist } from "../utils/tokenBlacklist";
import { ResponseService } from "../utils/response";


export const isTokenBlacklisted = (req: Request, res: Response, next: NextFunction) => {
  if (req.sessionID && tokenBlacklist.isTokenBlacklisted(req.sessionID)) {
    
    req.session?.destroy(() => {});
      return ResponseService({
            status: 401,
            success: false,
            message: "Session have been Invalided",
            res
          });
   
  }
  
  next();
};