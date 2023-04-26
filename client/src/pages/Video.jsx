import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
import Recommendation from "../components/Recommendation";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: calc(100vh - 56px);
  overflow-y:scroll;
  animation: fadein 0.3s;
  ::-webkit-scrollbar{
    width:5px;
  }

  @media (max-width:768px){
    flex-direction:column;
  }
`;

const Content = styled.div`
  flex: 5;
  padding: 20px;
  

  box-sizing: border-box;
  display:flex;
  flex-direction:column;
  flex-wrap:wrap;
  overflow:hidden;
  align-items:center;
`;
const VideoWrapper = styled.div`
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0px 0px 35px -1px ${({ theme }) => theme.bgLighter};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width:100%;


  @media (max-width: 468px) {
    width: 80vw;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
  width:100%;

  @media (max-width: 468px) {
    font-size: 20px;
  }
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  flex-wrap: wrap;
  gap: 10px;
  width:100%;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.text};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
  flex-wrap: wrap;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.bg};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  width:100%;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-size: 22px;
  font-weight: 500;
  cursor: pointer;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 14px;
`;

const Description = styled.p`
  font-size: 18px;

  @media (max-width: 468px) {
    display: none;
  }
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 20px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);

  const [channel, setChannel] = useState({});
  const path = useLocation().pathname.split("/")[2];

  const dispatch = useDispatch();


  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${path}`);
        const channelRes = await axios.get(
          `/users/find/${videoRes.data.userId}`
        );

        setChannel(channelRes.data);

        dispatch(fetchSuccess(videoRes.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    
  }, [path, dispatch]);

  const handleLike = async () => {
    await axios.put(`/users/like/${currentVideo._id}`);
    dispatch(like(currentUser._id));
  };
  const handleDislike = async () => {
    await axios.put(`/users/dislike/${currentVideo._id}`);
    dispatch(dislike(currentUser._id));
  };

  const handleSub = async () => {
    currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(`/users/unsub/${channel._id}`)
      : await axios.put(`/users/sub/${channel._id}`);
    dispatch(subscription(channel._id));
  };

  //TO DO: DELETE VIDEO FUNCTIONALITY
  if (currentVideo) {
    return (
      <Container>
        <Content>
          <VideoWrapper>
            <VideoFrame src={currentVideo.videoUrl || "/images/thumbnail.svg"} controls />
          </VideoWrapper>
          <Title>{currentVideo.title}</Title>
          <Details>
            <Info>
              {currentVideo.views} views • {format(currentVideo.createdAt)}
            </Info>
            <Buttons>
              <Button onClick={handleLike}>
                {currentVideo.likes?.includes(currentUser?._id) ? (
                  <ThumbUpIcon />
                ) : (
                  <ThumbUpOutlinedIcon />
                )}{" "}
                {currentVideo.likes?.length}
              </Button>
              <Button onClick={handleDislike}>
                {currentVideo.dislikes?.includes(currentUser?._id) ? (
                  <ThumbDownIcon />
                ) : (
                  <ThumbDownOffAltOutlinedIcon />
                )}{" "}
                Dislike
              </Button>
              <Button>
                <ReplyOutlinedIcon /> Share
              </Button>
              <Button>
                <AddTaskOutlinedIcon /> Save
              </Button>
            </Buttons>
          </Details>
          <Hr />
          <Channel>
            <ChannelInfo>
              <Image src={channel.img || "/images/profile.svg"} />
              <ChannelDetail>
              <Link to={`/profile/${channel._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                 <ChannelName>{channel.name}</ChannelName>
              </Link>
                <ChannelCounter>
                  {channel.subscribers} subscribers
                </ChannelCounter>
                <Description>{currentVideo.desc}</Description>
              </ChannelDetail>
            </ChannelInfo>
            <Subscribe onClick={handleSub} style={{backgroundColor:currentUser?.subscribedUsers?.includes(channel?._id) ? "white" : "red",color:currentUser?.subscribedUsers?.includes(channel?._id) ? "red" : "white"}}>
              {currentUser?.subscribedUsers?.includes(channel._id)
                ? "SUBSCRIBED"
                : "SUBSCRIBE"}
            </Subscribe>
          </Channel>
          <Hr />
          <Comments videoId={currentVideo._id} />
        </Content>
        <Recommendation tags={currentVideo.tags} />
      </Container>
    );
  }
};

export default Video;
