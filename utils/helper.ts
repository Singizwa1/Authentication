
import jwt from "jsonwebtoken" ;
import bcrypt from "bcryptjs"
import { config } from "dotenv";

config()

interface JwtPayload{
  id:string,
  email:string
}

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
}

export const comparePassword =async(password:string,hash:string):Promise<boolean>=>{
  return await bcrypt.compare(password,hash);
}
 export const secretKey = process.env.JWT_SECRET || "SecretKey";

export const generateToken = ({id,email}:{id:string;email:string}):string=>{
 const payload: JwtPayload = {id,email};
   return jwt.sign(payload, secretKey, { expiresIn: '5h' });
};
