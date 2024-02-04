import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import axios from "axios";
import { useSelector } from "react-redux";

const Container = styled.div`
  width: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: ${(props) => (props.type === "sm" ? "row" : "column")};
  gap: 10px;
  background-color: ${({ theme }) => theme.bg};
  padding: 10px;
  box-sizing: border-box;
  border-radius: 15px;
  transition: all 0.2s ease;
  border: 0.5px ${({ theme }) => theme.text};
  align-items: center;
  height: 100%;
  animation: fadein 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.bgLighter};
  }

  @media (max-width: 480px) {
    width: calc(100vw - 40px);
  }
`;

const Img = styled.img`
  width: ${(props) => (props.type === "sm" ? "50%" : "100%")};
  height: ${(props) => (props.type === "sm" ? "100%" : "60%")};
  background-color: #999;
  border-radius: 10px;
  transition: all 1s ease;
  overflow: hidden;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: ${(props) => (props.type === "sm" ? "50%" : "100%")};
  height: ${(props) => (props.type === "sm" ? "100%" : "40%")};
`;

const ChannelImg = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Texts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-wrap: wrap;
`;
const Title = styled.h1`
  font-size: ${(props) => (props.type === "sm" ? "12px" : "18px")};
  letter-spacing: 1px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;
const Major = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
`;

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({});

  const handleView = async () => {
    try {
      await axios.put(
        "https://youtube-yg41.onrender.com/api/videos/view/" + video._id
      );
    } catch (err) {
      console.log(err);
    }
  };

  const fetchChannel = async () => {
    try {
      const res = await axios.get(
        `https://youtube-yg41.onrender.com/api/users/find/${video.userId}`
      );
      setChannel(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChannel();
  }, [video.userId]);

  return (
    <Link
      to={`/video/${video._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Container type={type} onClick={handleView}>
        <Img src={video.imgUrl} type={type} />
        <Details type={type}>
          <Texts>
            <Title>{video.title.slice(0, 40) + "..."}</Title>
            <Major>
              <ChannelImg
                type={type}
                src={channel.img || "/images/profile.svg"}
              />
              <Link
                to={`/profile/${channel._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ChannelName>{channel.name}</ChannelName>
              </Link>
            </Major>
            <Info>
              {video.views} views * {format(video.createdAt)}
            </Info>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
};

export default Card;
