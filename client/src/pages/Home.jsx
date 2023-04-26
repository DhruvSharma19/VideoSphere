import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Card from '../components/Card';



const Container=styled.div`
    box-sizing:border-box;
    padding:22px 60px;
    display: grid; 
    grid-template-columns: repeat(auto-fit,minmax(400px, 1fr) );
    grid-template-rows: repeat(auto-fit,minmax(400px, 1fr) );
    animation: fadein 0.3s;
  
    ::-webkit-scrollbar{
      width:5px;
    }
    overflow-y:scroll;
    height:calc(100vh -100px);
    gap:10px;
    @media (max-width:420px){
      grid-template-columns: repeat(1,minmax(90vw, 1fr) );
      grid-template-rows: repeat(2,minmax(calc(100vh - 200px), 1fr) );
      padding:10px
  
    }

`;

 

const Home = ({type}) => {
  const[videos,setVideos]=useState([]);

  useEffect(()=>{
    const fetchVideos=async()=>{
      const res=await axios.get(`/videos/${type}`);
      setVideos(res.data)
    }
    fetchVideos()
  },[type])




  return (
    <Container>
      {videos.map(video=>(
        <Card key={video._id} video={video}  />
      ))}
    </Container>
  )
}

export default Home
