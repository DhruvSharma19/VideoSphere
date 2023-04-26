import React, { useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Upload from "./Upload";

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bg};
  height: 56px;
  z-index:200;
  box-sizing:border-box;
  animation: fadein 0.3s;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled.div`
  width: 40%;
  height: 60%;
  
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 30px;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  border: none;
  width: 90%;
  background-color: transparent;
  outline: none;
  padding: 2px 5px;
  font-size: larger;
  color: ${({ theme }) => theme.text};
  padding:8px;
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;


  &:hover {
    background-color: blue;
    color: ${({ theme }) => theme.text};
  }
  
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; 
  font-weight: 500;
  color: ${({ theme }) => theme.text};

  span{
    cursor: pointer;
    @media (max-width:550px){
      display:none;
    }
  }
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
  object-fit: cover;
`;

const Navbar = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  return (
    <>
      <Container>
        <Wrapper>
          <Search>
            <Input
              placeholder="Search"
              onChange={(e) => setQ(e.target.value)}
            />
            <SearchOutlinedIcon style={{width:"10%",cursor:"pointer"}} onClick={()=>navigate(`/search?q=${q}`)}/>
          </Search>
          {currentUser ? (
            <User>
              <VideoCallOutlinedIcon onClick={() => setOpen(true)} style={{cursor:"pointer"}} />
              <Avatar src={currentUser.img || '/images/profile.svg'} />
              <Link to={`/profile/${currentUser._id}`} style={{ textDecoration: "none", color: "inherit"}}>
              <span>

                {currentUser.name}
              </span>
              </Link>
                
            </User>
          ) : (
            <Link to="signin" style={{ textDecoration: "none" }}>
              <Button>
                <AccountCircleOutlinedIcon />
                SIGN IN
              </Button>
            </Link>
          )}
        </Wrapper>
      </Container>
      {open && <Upload setOpen={setOpen} />}
    </>
  );
};

export default Navbar;