import express from "express";
import { addVideo, addView, deleteVideo, getByTag, getVideo, movies, music, myVideo, news, random, search, sport, sub, trend, updateVideo } from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router=express.Router();

//Create a video

router.post("/",verifyToken, addVideo ); 

router.put("/:id",verifyToken, updateVideo );

router.delete("/:id",verifyToken, deleteVideo );

 

router.get("/find/:id", getVideo );


router.put("/view/:id", addView );

router.get("/trend", trend );


router.get("/random", random );
router.get("/music", music );
router.get("/sport", sport );
router.get("/movie", movies );
router.get("/movie", news );


router.get("/sub",verifyToken, sub );

router.get("/tags", getByTag );
 
router.get("/search", search );

router.get("/profile/:id" , myVideo);

 



export default router;