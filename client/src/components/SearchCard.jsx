import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";

const Container = styled.div`
  width: 100%;
  height:35vh;
  display: flex;
  flex-direction: row;
  flex-wrap:wrap;
  gap: 20px;
  box-sizing: border-box;
  padding:20px;
  background-color: ${({ theme }) => theme.bg};
  border-radius:20px;
  animation: fadein 0.3s;


    img{
        height:100%;
        width:40%;
        border-radius:20px;
        overflow:hidden;

        @media (max-width:468px){
            
            height:50%;
            width:100%;
        }

    }
 

  :hover{
    background-color: ${({ theme }) => theme.bgLighter};
  }

  
  @media (max-width:468px){
        flex-direction:row;
        gap:10px;
        height:42vh;
    }

`;

const Details = styled.div`
    display: flex;
     flex-direction: column;
    gap: 20px;
    width: 55%;
    height:100%;
    @media (max-width:468px){
        width:100%;
        height:50%;
        gap:8px;

    }
    
`;




const Title = styled.div`
    width:100%;
    color: white;
    font-size: 26px;
    width:100%;
    color: ${({ theme }) => theme.text};
    @media (max-width:468px){
        font-size:15px;

    }
`;

const Time = styled.div`
    width:100%;
    color: ${({ theme }) => theme.textSoft};
    font-size:15px;
    @media (max-width:468px){
        font-size:10px;

    }
`;

const ChannelInfo = styled.div`
    width:100%;
    
    display:flex;
    flex-direction:row;
    align-items:center;
    gap:30px;
    font-size:20px;
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  span{
    color: ${({ theme }) => theme.textSoft};
  }

  @media (max-width:468px){
        font-size:10px;

    }
`;

const Desc = styled.div`
    width:100%;
    color: ${({ theme }) => theme.textSoft};
    font-size:15px;
    @media (max-width:468px){
        font-size:10px;

    }
`;

const SearchCard = ({ video }) => {
  const [channel, setChannel] = useState({});

  const handleView = async () => {
    try {
      await axios.put("/videos/view/" + video._id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await axios.get(`/users/find/${video.userId}`);
      setChannel(res.data);
    };
    fetchChannel();
  }, [video.userId]);

  return (
    <Link
      to={`/video/${video._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Container onClick={handleView}>
        
            <img src={video.imgUrl || "/images/thumbnail.svg"} alt="" />

        <Details>
          <Title>{video.title.slice(0,40) + "..."}</Title>
          <Time>
            {video.views} views * {format(video.createdAt)}
          </Time>
          <ChannelInfo>
            <img src={channel.img || "/images/profile/svg"} alt="" />
            <Link to={`/profile/${channel._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <span>{channel.name}</span>
            </Link>
          </ChannelInfo>
          <Desc>{video.desc}</Desc>
        </Details>
      </Container>
    </Link>
  );
};

export default SearchCard;
