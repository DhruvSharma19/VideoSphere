import React from "react";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  SignUpStart,
  SignUpSuccess,
  SignUpFailure,
} from "../redux/userSlice";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh-56px);
  color: ${({ theme }) => theme.text};
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
  background-color: ${(theme) => theme.bgLighter};
  border: none;
  overflow-y: scroll;
  animation: fadein 0.3s;
  ::-webkit-scrollbar {
    width: 5px;
  }
`;

const Wrapper = styled.div`
  border: none;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 50vw;
  background-color: ${({ theme }) => theme.bgLighter};
  padding: 20px;
  box-sizing: border-box;

  gap: 30px;
  border-radius: 10px;
  background-color: ${(theme) => theme.bgLighter};
`;

const Title = styled.div`
  font-size: 24px;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: black;
  border-radius: 10px;
  background-color: white;
  padding: 20px;
  font-size: 20px;
  transition: all 0.2s ease;
  box-sizing: border-box;

  :hover {
    :hover {
      box-shadow: -11px 10px 0px 1px rgba(0, 0, 0, 1);
      transform: scale(1.1);
    }
  }
`;

const Button = styled.div`
  border-radius: 10px;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 500;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  width: 100%;
  text-align: center;
  background-color: blue;
  color: white;
  font-weight: bold;
  font-size: 18px;
  box-sizing: border-box;

  &:hover {
    background-color: lightgrey;
    color: black;
  }
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
  width: 100%;
  justify-content: space-between;

  div {
    flex: 1;
  }
`;

const Links = styled.div`
  width: 100%;
  margin-left: 50px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
`;

const Link = styled.div`
  margin-left: 30px;
  cursor: pointer;
`;

const Signin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    dispatch(loginStart());
    try {
      const res = await axios.post(
        "https://youtube-yg41.onrender.com/api/auth/signin",
        { name, password }
      );
      dispatch(loginSuccess({ ...res.data.others, jwt: res.data.jwt }));
      navigate("/random");
    } catch (err) {
      dispatch(loginFailure());
    }
  };

  const signinWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post("https://youtube-yg41.onrender.com/api/auth/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            dispatch(loginSuccess({ ...res.data.others, jwt: res.data.jwt }));
            navigate("/random");
          });
      })
      .catch((error) => {
        dispatch(loginFailure());
      });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    dispatch(SignUpStart());
    try {
      const res = await axios.post(
        "https://youtube-yg41.onrender.com/api/auth/signup",
        { name, email, password }
      );
      dispatch(SignUpSuccess({ ...res.data.others, jwt: res.data.jwt }));
      navigate("/random");
    } catch (err) {
      dispatch(SignUpFailure());
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign In</Title>
        <Input
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleLogin}>Sign in</Button>
        <Title>or</Title>
        <Button onClick={signinWithGoogle}>Signin with Google</Button>
        <Title>or</Title>
        <Input
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
        />
        <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleSignUp}>Sign Up</Button>
        <More>
          <div>English(USA)</div>

          <Links>
            <Link>Help</Link>
            <Link>Privacy</Link>
            <Link>Terms</Link>
          </Links>
        </More>
      </Wrapper>
    </Container>
  );
};

export default Signin;
