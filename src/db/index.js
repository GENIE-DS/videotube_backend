import mongoose, { connect } from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB= async ()=>{
    try{
        const connectioninInstance =   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB  connected !! DB Host : ${connectioninInstance.connection.host}`)
    }catch(error){
        console.error("mongoDB connection Faillled : ", error);
        process.exit(1); 
        // could also do : throw error;
    }
}


export default connectDB;