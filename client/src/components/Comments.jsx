import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Comment from "./Comment";
import { useDispatch } from "react-redux";
import { addComment, fetchSuccess } from "../redux/commentSlice";

const Container = styled.div`
  width: 100%;
  animation: fadein 0.3s;
`;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  font-size: 16px;
  width: 100%;
`;

const Button = styled.button`
  background-color: blue;
  border: none;
  border-radius: 10px;
  padding: 6px 15px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;

const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentComment } = useSelector((state) => state.comment);
  const [text, setText] = useState();
  const dispatch = useDispatch();

  const handleComment = async () => {
    try {
      const res = await axios.post("/comments/", {
        userId: currentUser._id,
        videoId: videoId,
        desc: text,
      });
      dispatch(addComment(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/comments/${videoId}`);
      dispatch(fetchSuccess(res.data));
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    fetchComments();
  }, [videoId]);

  return (
    <Container>
      {currentUser && (
        <NewComment>
          <Avatar src={currentUser.img || "/images/profile.svg"} />
          <Input
            placeholder="Add a comment..."
            onChange={(e) => setText(e.target.value)}
          />
          <Button on onClick={handleComment}>
            Comment
          </Button>
        </NewComment>
      )}
      {currentComment?.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </Container>
  );
};

export default Comments;
