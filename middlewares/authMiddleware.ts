import { Request, Response, NextFunction } from "express";
import { ResponseService } from "../utils/response";
import { secretKey } from "../utils/helper";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken"

interface jwtExtendPayload extends JwtPayload {
    id: string;
    email: string;
    role: string;  
}

// Define custom User type that extends both Passport User and our payload
declare global {
    namespace Express {
        // This will merge with the existing User interface from Passport
        interface User extends jwtExtendPayload {}
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return ResponseService({
                data: null,
                status: 401,
                success: false,
                message: "Authentication token is missing",
                res
            });
        }

        const user = jwt.verify(token as string, secretKey) as jwtExtendPayload;
        if (!user) {
            return ResponseService({
                data: null,
                status: 401,
                success: false,
                message: "Invalid authentication token",
                res
            });
        }

        req.user = user;
        next();
        
    } catch (error) {
        //console.error('Authentication error:', error);
        const { message, stack } = error as Error;
        ResponseService({
            data: { message, stack },
            status: 500,
            success: false,
            res
        });
        
    }
}

export const checkRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;

            if (!user || !user.role) {
                return ResponseService({
                    data: null,
                    status: 403,
                    success: false,
                    message: "User role not found in token",
                    res
                });
            }

            if (!allowedRoles.includes(user.role)) {
                return ResponseService({
                    data: null,
                    status: 403,
                    success: false,
                    message: "You do not have permission to perform this action",
                    res
                });
            }
            
            next();
        } catch (error) {
            const { message, stack } = error as Error;
            ResponseService({
                data: { message, stack },
                status: 500,
                success: false,
                res
            });
        }
    };
};