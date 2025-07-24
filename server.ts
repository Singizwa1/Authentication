import express from "express";
import { config } from "dotenv";
import { Database } from "./database/db";

Database
config()
const app =express();
const port=process.env.PORT||5000;
 app.get('/',(req,res)=>{
    res.send("Hello Rwanda")
 }
);

app.listen(port,()=>{
    console.log("My App is running on Heaven")
});