import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { format } from "timeago.js";
import { deleteComment } from "../redux/commentSlice";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
  position: relative;
  animation: fadein 0.3s;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 16px;
`;

const More = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  width: 25px;
  height: 25px;

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;

  :hover {
    background-color: gray;
  }

  img {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  div {
    display: none;
    position: absolute;
    right: 15px;
    top: 15px;
    box-sizing: border-box;
    padding: 5px;
    font-size: 15px;
    color: black;
    font-weight: bold;
    background-color: gray;
    border-radius: 10px;
  }

  :hover {
    div {
      display: flex;
    }
  }
`;

const Comment = ({ comment }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [channel, setChannel] = useState({});
  const dispatch = useDispatch();

  const handleComment = async () => {
    try {
      await axios.delete(`/comments/${comment._id}`,{headers:{Authorization:"Bearer "+currentUser.jwt}});
      dispatch(deleteComment(comment._id));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchComment = async () => {
    try {
      const res = await axios.get(`/users/find/${comment.userId}`);
      setChannel(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchComment();
  }, [comment.userId]);

  return (
    <Container>
      <Avatar src={channel?.img || "/images/profile.svg"} />
      {currentUser ? (
        <More>
          <img src="/images/more.svg" alt="" />
          <div onClick={handleComment}>Delete</div>
        </More>
      ) : (
        ""
      )}
      <Details>
        <Name>
          {channel?.name} <Date>{format(comment.createdAt)}</Date>
        </Name>
        <Text>{comment.desc}</Text>
      </Details>
    </Container>
  );
};

export default Comment;
