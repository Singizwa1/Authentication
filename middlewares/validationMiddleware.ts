import { NextFunction,Request,Response } from "express";
import { ObjectSchema } from  "joi";
import { ResponseService } from "../utils/response";

interface ValidationOptions<T>{
    type: 'body' | 'params' | 'query';
    schema: ObjectSchema<T>
    refType?: 'joi' | 'zod';

}

export const ValidationMiddleware= <T>({type,schema,refType}:ValidationOptions<T>) =>(req:Request,res:Response,next:NextFunction)=>{
    
 try {
        const validationQueries = req[type]
      
        const { error } = schema.validate(validationQueries)
        if (error) {
        return ResponseService({
          data: error.details || error.message,
          status: 400,
          success: false,
          res,
        });
        }
        next();

    } catch (error) {
        console.log(error)
    }
}
