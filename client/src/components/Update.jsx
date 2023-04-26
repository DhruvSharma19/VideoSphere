import React, { useEffect, useState } from "react";
import app from "../firebase";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { bannerUrl, imgUrl } from "../redux/userSlice";

const Container = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
  background-color: #0000002c;
  z-index: 199;

  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadein 0.3s;
`;

const Wrapper = styled.div`
  width: 250px;
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: relative;

  & > div {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    input {
      display: none;
    }

    img {
      height: 70px;
      width: 70px;
      cursor: pointer;
    }

    span{
        font-size: 20px;

    }
  }

  button {
    width: 100%;
    font-size: 25px;
    color: white;
    font-weight: bold;
    padding: 10px 0px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    background-color: blue;
  }
`;


const Close=styled.img`
  height: 30px;
  width: 30px;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;

`;

const Update = ({setClose}) => {
  const [img, setImg] = useState(undefined);
  const [banner, setBanner] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [bannerPerc, setBannerPerc] = useState(0);
  const {currentUser}=useSelector((state)=>state.user);

  const [inputs, setInputs] = useState({});

  const dispatch = useDispatch();

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "img"
          ? setImgPerc(Math.round(progress))
          : setBannerPerc(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };




  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/users/${currentUser._id}`, { ...inputs });

      if(img){

        dispatch(imgUrl(res.data.img));
      }
      if(banner){
        dispatch(bannerUrl(res.data.banner))
      }
      setImg(undefined)
      setBanner(undefined)
      setBannerPerc(0);
      setImgPerc(0);
      setInputs({});
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    banner && uploadFile(banner, "banner");
  }, [banner]);

  useEffect(() => {
    img && uploadFile(img, "img");
  }, [img]);

  return (
    <Container>
      <Wrapper>
        <Close src="/images/close.svg" alt="" onClick={()=>setClose(0)}/>
        <h3>Update</h3>
        <div>
          <span>User Image: {imgPerc>0?imgPerc+"%":""} </span>
          <label htmlFor="image">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
            />
            <img src="/images/image.svg" alt="" />
          </label>
        </div>
        <div>
        <input
              type="file"
              id="banner"
              accept="image/*"
              onChange={(e) => setBanner(e.target.files[0])}
            />
          <span>Banner Image:{bannerPerc>0?bannerPerc +"%":""}</span>
          <label htmlFor="banner">
            <img src="/images/image.svg" alt="" />
          </label>
        </div>

        <button onClick={handleUpload}>Update</button>
      </Wrapper>
    </Container>
  );
};

export default Update;
