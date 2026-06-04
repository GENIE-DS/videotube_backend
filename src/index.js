import 'dotenv/config'

import connectDB from "./db/index.js";
connectDB();








/*
// the same code is written in /db/index.js to modularise our code

import mongoose, { connect } from "mongoose";
import { DB_NAME } from "./constants";

(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    } catch (error){
        console.error("ERROR : ", error);
        throw error
    }

})()

*/
