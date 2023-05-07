import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import SearchCard from "../components/SearchCard";

const Container = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  gap: 20px;
  height: calc(100vh - 56px);
  overflow-y: scroll;
  box-sizing: border-box;
  padding: 5px;
  animation: fadein 0.3s;

  ::-webkit-scrollbar {
    width: 5px;
  }
`;

const Search = () => {
  const [videos, setVideos] = useState([]);
  const query = useLocation().search;

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`https://youtube-yg41.onrender.com/api/videos/search${query}`);
      setVideos(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchVideos();
  }, [query]);

  return (
    <Container>
      {videos.map((video) => (
        <SearchCard key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Search;
