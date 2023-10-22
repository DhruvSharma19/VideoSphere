import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoutes from "./routes/users.js"
import videoRoutes from "./routes/videos.js"
import commentRoutes from "./routes/comments.js"
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser"
import cors from "cors"

 

const app=express();
app.use(
    cors({
        origin:["https://main--loquacious-pixie-1bfcbb.netlify.app","https://loquacious-pixie-1bfcbb.netlify.app"]
    })
)
app.use(express.json())
dotenv.config();

const connect=async()=>{ 
    await mongoose.connect(process.env.MONGO).then(()=>{
        console.log("connected to db"); 
    }).catch((err)=>{
        throw err; 
    });
}
 

 
app.use(cookieParser())
app.use("/api/auth",authRoutes); 
app.use("/api/users",userRoutes); 
app.use("/api/videos",videoRoutes);
app.use("/api/comments",commentRoutes);

//Application - level Error handling middleware  
app.use((err,req,res,next)=>{
    const status=err.status || 500;
  
    const message=err.message || "Something went wrong!";
    
    return res.status(status).json({
        success:false,
        status,
        message,
    });
});
 


app.listen(8800,()=>{
    connect();
    console.log("Connected to server")
})


