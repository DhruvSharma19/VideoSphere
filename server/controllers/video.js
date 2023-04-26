import User from "../models/User.js";
import Video from "../models/Video.js";
import {createError} from "../error.js"

export const addVideo=async (req,res,next) => {
    const newVideo=new Video({userId:req.user.id, ...req.body});
    try{
        const savedVideo= await newVideo.save()
        res.status(200).json(savedVideo); 
    }catch(err){
        next(err)
    }
};



export const updateVideo= async (req,res,next) => {
    try{
        const video=await Video.findById(req.params.id)

        if(!video) return next(createError(404,"Video not found"))

        if(req.user.id === video.userId){
            const updatedVideo=await Video.findByIdAndUpate(req.params.id,{
                $set:req.body,
            },
            {
                new:true
            }
            );
            res.status(200).json(updatedVideo)
        }
        else{
            return next(createError(403,"You can create Only your video!"));

        }

    }catch(err){
        next(err)
    }
    
};



export const deleteVideo=async(req,res,next) => {
    try{
        const video=await Video.findById(req.params.id)

        if(!video) return next(createError(404,"Video not found"))

        if(req.user.id === video.userId){
            await Video.findByIdAndDelete(req.params.id);
            res.status(200).json("The video has been deleted")
        }
        else{
            return next(createError(403,"You can delete Only your video!"));

        }

    }catch(err){
        next(err)
    }
    
};



export const getVideo=async(req,res,next) => {
    try{
        const video = await Video.findById(req.params.id)
        if(!video) return createError(404,"Video Not Found")
        res.status(200).json(video)

    }catch(err){
        next(err)
    }
    
};




export const addView=async(req,res,next) => {
    try{
        await Video.findByIdAndUpdate(req.params.id,{
            $inc:{views:1}
        })
        res.status(200).json("The view has been increased")
    }catch(err){
        next(err)
    }
    
};




export const random=async(req,res,next) => {
    try{
        const videos = await Video.aggregate([{$sample:{size:40}}])
        res.status(200).json(videos)

    }catch(err){
        next(err)
    }
    
};


export const music=async(req,res,next) => {
    try{
        const videos = await Video.find({tags:{$in:["music"]}});
        const extraVideos=await Video.find({title:{$regex:"music",$options:"i"},});

        
        res.status(200).json([...videos,...extraVideos]);

    }catch(err){
        next(err)
    }
    
};

export const sport=async(req,res,next) => {
    try{
        const videos = await Video.find({tags:{$in:["sport","sports"]}});
        const extraVideos=await Video.find({title:{$regex:"sport",$options:"i"},});

        
        res.status(200).json([...videos,...extraVideos]);

    }catch(err){
        next(err)
    }
    
};

export const news=async(req,res,next) => {
    try{
        const videos = await Video.find({tags:{$in:["news"]}});
        const extraVideos=await Video.find({title:{$regex:"news",$options:"i"},});

        
        res.status(200).json([...videos,...extraVideos]);

    }catch(err){
        next(err)
    }
    
};

export const movies=async(req,res,next) => {
    try{
        const videos = await Video.find({tags:{$in:["movies,movie"]}});
        const extraVideos=await Video.find({title:{$regex:"movies",$options:"i"},});

        
        res.status(200).json([...videos,...extraVideos]);

    }catch(err){
        next(err)
    }
    
};




export const trend=async(req,res,next) => {
    try{
        const videos = await Video.find().sort({views:-1})
        res.status(200).json(videos)

    }catch(err){
        next(err)
    }
    
};

// Important
export const sub=async(req,res,next) => {
    try{
        const user = await User.findById(req.user.id)
        const subscribedChannels=user.subscribedUsers;

        const list= await Promise.all(
            subscribedChannels.map(async(channel)=>{
                return await Video.find({userid:channel});
            })
        );
        res.status(200).json(list.flat().sort((a,b)=>b.createdAt-a.createdAt))

    }catch(err){
        next(err)
    }
    
};


export const getByTag=async(req,res,next) => {
    const tags=req.query.tags.split(",");
    try{
        const videos = await Video.find({tags:{$in:tags}}).limit(20);
        res.status(200).json(videos)

    }catch(err){
        next(err)
    }
    
}; 


export const search=async(req,res,next) => {
    const query=req.query.q
    try{
        const videos = await Video.find({title:{$regex:query,$options:"i"},}).limit(40);
        res.status(200).json(videos)

    }catch(err){
        next(err)
    } 
    
};


export const myVideo=async(req,res,next)=>{
    try{ 
        const videos = await Video.find({userId:req.params.id});
        res.status(200).json(videos)
    }
    catch(err){
        next(err)
    }   
}  