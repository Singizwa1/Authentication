import { Request, Response, NextFunction } from "express";
import { ResponseService } from "../utils/response";
import jwt, { JwtPayload } from "jsonwebtoken";
import { secretKey } from "../utils/helper";

type UserPayload = {
  id: string;
  email: string;
};

interface JwtPayloadExtra extends JwtPayload {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const AuthMiddleware= (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return ResponseService({
        res,
        message: "Unauthorized Access",
        status: 401,
      });
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey) as JwtPayloadExtra;

    req.user = { id: decoded.id, email: decoded.email };
    return next();

  } catch (error) {
    return ResponseService({
      res,
      message: "Please login again",
      status: 401,
    });
  }
};
