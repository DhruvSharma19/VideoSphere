import mongoose from "mongoose"


const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true, 
        unique:true,
    },
    password:{
        type:String, 
    },
    img:{
        type:String,
        default:null,
    },
    banner:{
        type:String,
        default:null,
    },
    subscribers:{
        type:Number,
        default:0,
    },
    subscribedUsers:{
        type:[String],
    },
    fromGoogle:{
        type:Boolean,
        default:false,
    }
},{timestamps:true});

export default mongoose.model("User",UserSchema);