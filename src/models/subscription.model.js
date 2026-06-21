import mongoose , {Schema} from "mongoose"

const subscriptionSchema = new mongoose.Schema({
    subscriber : {
        type : mongoose.Schema.Types.ObjectId, // the little kid who is Subscribing
        ref: "User",
    },
    channel : {
        type : mongoose.Schema.Types.ObjectId, // the uncle who posts videos
        ref : "User"
    }
}, {timestamps : true});

export const Subscription = new mongoose.model("Subscription", subscriptionSchema);