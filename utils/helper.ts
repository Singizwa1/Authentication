
import jwt from "jsonwebtoken" ;
import bcrypt from "bcryptjs"

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
}

export const comparePassword =async(password:string,hash:string):Promise<boolean>=>{
  return await bcrypt.compare(password,hash);
}
 export const secretKey = process.env.JWT_SECRET || "SecretKey";

 export const generateToken = ({_id, email, role}: { _id: string; email: string; role: string }): string => {
    return jwt.sign({ _id, email, role }, secretKey, { expiresIn: '5h' });
}