import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyDTzmYJ2irh5JW10gdC-An8ruZJ8vaRvGA",
  authDomain: "video-41e7c.firebaseapp.com",
  projectId: "video-41e7c",
  storageBucket: "video-41e7c.appspot.com",
  messagingSenderId: "745917788217",
  appId: "1:745917788217:web:9972c5f36d060415079de8"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth()
export const provider=new GoogleAuthProvider();

export default app;





