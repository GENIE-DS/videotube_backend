import 'dotenv/config'
import { app } from './app.js';
import connectDB from "./db/index.js";
connectDB()
.then(()=>{

    app.on("er", (error) =>{
        console.log("Errrrror : ", error);
        throw error;
    })

    app.listen(process.env.PORT || 8000, ()=>{
        console.log(` 🔥🔥🔥 Yeahhhh!! Server is running at port : ${process.env.PORT} 🔥🔥🔥`)
    })
})
.catch((errr)=>{
        console.log("MongoDB connection failed !!!!", errr)
})








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
