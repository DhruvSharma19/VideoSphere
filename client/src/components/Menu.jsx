import {
  Explore,
  Home,
  LibraryAdd,
  LibraryMusic,
  Sports,
  Subscriptions,
  History,
  Movie,
  Newspaper,
  LiveTv,
  Settings,
  Report,
  Help,
  LightMode,
  AccountCircleOutlined,
} from "@mui/icons-material";
import {auth} from "../firebase";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from "firebase/auth";
import { logout } from "../redux/userSlice";




const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  position: sticky;
  top: 0;
  overflow-y: scroll;
  animation: fadein 0.3s;

  @media (max-width:768px){
    display:none;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  } 
  &::-webkit-scrollbar-thumb {
    background-color: rgb(179, 179, 179);
  }

  overflow-x: hidden;
`;

const Wrapper = styled.div`
  padding: 18px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  
`;

const Logo = styled.div` 
  display: flex;
  align-items: center;
  font-size: 25px;
  gap: 8px;
  font-weight: bold;
  margin-bottom: 25px;
  cursor: pointer;

 
`;

const Img = styled.img`
  height: 25px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding:10px;
  box-sizing: border-box;
  font-size: 20px;
  transition: 0.1s all;
  border-radius: 20px;

  &:hover {
    background-color: ${({ theme }) => theme.textSoft};
  }
`;

const Hr = styled.div`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Login = styled.div``;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 300;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: blue;
    color: ${({ theme }) => theme.text};
  }
`;

const Title = styled.h2`
  font-size: 14px;
  font-weight: 300;
  color: #aaaaaa;
  margin-bottom: 20px;
`;

const Menu = ({ darkMode, setDarkMode }) => {
  const { currentUser } = useSelector((state) => state.user);

  const dispatch=useDispatch();
  const navigate=useNavigate();


  const handleAuth=async()=>{
    try{
      if (currentUser.fromGoogle) {
        signOut(auth)
          .then(() => {
            dispatch(logout());
            navigate("/home/random")
           
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        dispatch(logout());
        navigate("/random")
       
      }
    }
    catch(err){
      console.log(err);
    }
  }
  
  return (
    
    <Container>
      <Wrapper>
        <Link to="random" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo>
            <Img src={"/images/logo.png"}></Img>
            YouTube
          </Logo>
        </Link>
        <Link to="random" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <Home style={{color:"orange"}} />
            Home
          </Item>
        </Link>
        <Link to="trends" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <Explore style={{color:"red"}}/>
            Explore
          </Item>
        </Link>
        <Link
          to="subscriptions"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <Subscriptions style={{color:"green"}}/>
            Subscriptions
          </Item>
        </Link>

        <Hr />
        {!currentUser && (
          <>
            <Login>
              Sign in to like videos, comment, and subscribe
              <Link to="signin" style={{ textDecoration: "none" }}>
                <Button>
                  <AccountCircleOutlined /> SIGN IN
                </Button>
              </Link>
            </Login>
            <Hr />
          </>
        )}
        <Link to="music" style={{ textDecoration: "none", color: "inherit" }}>
        <Item>
          <LibraryMusic style={{color:"darkblue"}}/>
          Music
        </Item>
        </Link>
        <Link to="sports" style={{ textDecoration: "none", color: "inherit" }}>
        <Item>
          <Sports style={{color:"blueviolet"}}/>
          Sports
        </Item>
        </Link>
        <Link to="movies" style={{ textDecoration: "none", color: "inherit" }}>

        
        <Item>
          <Movie style={{color:"purple"}}/>
          Movies
        </Item>
        </Link>
        <Link to="news" style={{ textDecoration: "none", color: "inherit" }}>

        <Item>
          <Newspaper style={{color:"lightblue"}}/>
          News
        </Item>
        </Link>
        <Hr />
        <Item>
          <Settings style={{color:"darkgreen"}}/>
          Settings
        </Item>
        <Item onClick={handleAuth} >
          <LogoutIcon style={{color:"aqua"}}/>
          LogOut
        </Item>
        <Item>
          <Report style={{color:"pink"}}/>
          Report
        </Item>
        <Item>
          <Help style={{color:"orange"}}/>
          Help
        </Item>
        <Item onClick={() => setDarkMode(!darkMode)}>
          <LightMode />
          {darkMode ? "Light" : "Dark"} Mode
        </Item>
      </Wrapper>
    </Container>
  );
};

export default Menu;
