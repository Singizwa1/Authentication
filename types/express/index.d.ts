import { JwtPayload } from 'jsonwebtoken';

export interface UserPayload extends JwtPayload {
  _id: string;
  email: string;

}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
