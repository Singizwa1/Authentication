import { Response, Request } from "express";

export interface UserInterface{
name: string,
email: string,
photo:string,
}

export interface googleAuth{
    body:UserInterface
}

