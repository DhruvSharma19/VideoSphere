import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux"

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: fadein 0.3s;
`;

const Wrapper = styled.div`
  width: 50vw;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
  border-radius: 20px;

  img {
    width: 70px;
    height: 70px;
    cursor: pointer;
  }

  @media (max-width: 480px) {
    width: 80vw;
  }
`;
const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;
const Title = styled.h1`
  text-align: center;
  font-weight: bold;
  @media (max-width: 480px) {
    font-size: 30px;
  }
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.text};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
  border-radius: 20px;
  padding: 10px;
  box-sizing: border-box;
  font-size: 20px;
  display: none;

  &:hover {
    cursor: pointer;
  }
`;

const Media = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.text};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
  border-radius: 20px;
  padding: 10px;
  box-sizing: border-box;
  font-size: 20px;

  &:hover {
    cursor: pointer;
  }
`;
const Desc = styled.textarea`
  width: 100%;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 10px;
  font-size: 20px;
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
`;

const Button = styled.button`
  border-radius: 8px;
  border: none;
  padding: 10px 20px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
  width: 100%;

  &:hover {
    background-color: blue;
    color: ${({ theme }) => theme.text};
  }
`;
const Label = styled.label`
  font-size: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const Upload = ({ setOpen }) => {
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const {currentUser}=useSelector((state)=>state.user);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

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
        urlType === "imgUrl"
          ? setImgPerc(Math.round(progress))
          : setVideoPerc(Math.round(progress));
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
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };

  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);

  useEffect(() => {
    img && uploadFile(img, "imgUrl");
  }, [img]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://youtube-yg41.onrender.com/api/videos", { ...inputs, tags },{headers:{Authorization:"Bearer "+currentUser.jwt}});
      setOpen(false);
      res.status === 200 && navigate(`/video/${res.data._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Upload a New Video</Title>
        <Label htmlFor="video">
          Video:
          <img src="/images/image.svg" alt="" />
        </Label>
        {videoPerc > 0 ? (
          "Uploading:" + videoPerc
        ) : (
          <Input
            type="file"
            accept="video/*"
            id="video"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        )}
        <Media
          type="text"
          placeholder="Title"
          name="title"
          onChange={handleChange}
        />
        <Desc
          placeholder="Description"
          name="desc"
          rows={8}
          onChange={handleChange}
        />

        <Media
          type="text"
          placeholder="Separate the tags with commas."
          onChange={handleTags}
        />
        <Label htmlFor="image">
          Image:
          <img src="/images/image.svg" alt="" />
        </Label>
        {imgPerc > 0 ? (
          "Uploading:" + imgPerc + "%"
        ) : (
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          />
        )}
        <Button onClick={handleUpload}>Upload</Button>
      </Wrapper>
    </Container>
  );
};

export default Upload;
