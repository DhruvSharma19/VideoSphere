import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { subscription } from "../redux/userSlice";
import Update from "../components/Update";

const Container = styled.div`
  height: calc(100vh - 56px);
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  animation: fadein 0.3s;
  ::-webkit-scrollbar {
    width: 5px;
  }
`;

const Banner = styled.div`
  width: 100%;
  overflow: hidden;
  min-height: 30vh;
  position: relative;

  & > img {
    min-height: 100%;
    width: 100%;
    overflow: hidden;
  }
`;

const ChannelInfo = styled.div`
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  position: relative;

  button {
    padding: 10px 20px;
    border: none;
    outline: none;
    font-size: 25px;
    color: black;
    background-color: white;
    border-radius: 30px;
    font-weight: bold;
    cursor: pointer;
  }
`;

const Channel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;

  img {
    height: 100px;
    width: 100px;
    border-radius: 50%;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: flex-start;
`;

const Title = styled.div`
  font-size: 25px;
  color: ${({ theme }) => theme.text};
`;

const Time = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.textSoft};
`;

const Main = styled.div`
  padding: 20px;
  gap: 20px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));

  @media (max-width: 480px) {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
`;

const Pen = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  height: 40px;
  width: 40px;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 50%;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 30px;
    width: 30px;
    border-radius: 50%;
  }
`;

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [videos, setVideos] = useState([]);
  const [channel, setChannel] = useState({});
  const path = useLocation().pathname.split("/")[2];
  const [close, setClose] = useState(0);

  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const channelRes = await axios.get(`https://youtube-yg41.onrender.com/api/users/find/${path}`);
      const videoRes = await axios.get(`https://youtube-yg41.onrender.com/api/videos/profile/${path}`);
      setVideos(videoRes.data);
      setChannel(channelRes.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, [path]);

  const handleSub = async () => {
    try {
      currentUser.subscribedUsers.includes(channel._id)
        ? await axios.put(`https://youtube-yg41.onrender.com/api/users/unsub/${channel._id}`,{headers:{Authorization:"Bearer "+currentUser.jwt}})
        : await axios.put(`https://youtube-yg41.onrender.com/api/users/sub/${channel._id}`,{headers:{Authorization:"Bearer "+currentUser.jwt}});
      dispatch(subscription(channel._id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      {close === 1 ? <Update setClose={setClose} /> : ""}
      <Banner>
        <img
          src={
            currentUser?._id === channel._id
              ? currentUser?.banner || "/images/background.svg"
              : channel?.banner || "/images/background.svg"
          }
          alt=""
        />
        {currentUser?._id === path ? (
          <Pen onClick={() => setClose(1)}>
            <img src="/images/image.svg" alt="" />
          </Pen>
        ) : (
          ""
        )}
      </Banner>
      <ChannelInfo>
        <Channel>
          <img
            src={
              currentUser?._id === channel._id
                ? currentUser?.img || "/images/Person.svg"
                : channel?.img || "/images/Person.svg"
            }
            alt=""
          />
          {currentUser?._id === path ? (
            <Pen onClick={() => setClose(1)}>
              <img src="/images/image.svg" alt="" />
            </Pen>
          ) : (
            ""
          )}
          <Info>
            <Title>{channel?.name}</Title>
            <Time>{channel?.subscribers} subscribers</Time>
          </Info>
        </Channel>
        {currentUser ? (
          <button
            onClick={handleSub}
            style={{
              backgroundColor: currentUser?.subscribedUsers?.includes(
                channel?._id
              )
                ? "white"
                : "red",
              color: currentUser?.subscribedUsers?.includes(channel?._id)
                ? "red"
                : "white",
            }}
          >
            {currentUser?.subscribedUsers?.includes(channel?._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </button>
        ) : (
          ""
        )}
      </ChannelInfo>
      <Main>
        {videos?.map((video) => (
          <Card key={video._id} video={video} />
        ))}
      </Main>
    </Container>
  );
};

export default Profile;
