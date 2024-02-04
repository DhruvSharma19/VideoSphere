import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import Signin from "./pages/Signin";
import { useSelector } from "react-redux";
import Search from "./pages/Search";
import Profile from "./pages/Profile";


const Container = styled.div`
  display:flex; 
  background-color: ${({ theme }) => theme.bg};
  flex-wrap:wrap;
  
  
`;


const Main = styled.div`
  flex:5.6; 
  
  
`;


const Wrapper = styled.div`


`;


function App() {
  const [darkMode, setDarkMode] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  return (

    //Adding Theme Provider

    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>


      <Container>
        {/* Adding Routes */}
        <BrowserRouter>
          {/* Left Bar Component */}
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />


          <Main>

            {/* Adding Navbar Component */}
            <Navbar />

            <Wrapper>

              {/* Need to Add Routes */}
              <Routes>

                <Route path="/">

                  <Route index element={<Home type="random" />} />
                  <Route path="random" element={<Home type="random" />} />
                  <Route path="trends" element={<Home type="trend" />} />
                  <Route path="music" element={<Home type="music" />} />
                  <Route path="sports" element={<Home type="sports" />} />
                  <Route path="news" element={<Home type="news" />} />
                  <Route path="movies" element={<Home type="movies" />} />
                  <Route path="search" element={<Search />} />
                  <Route path="subscriptions" element={<Home type="sub" />} />
                  <Route index element={<Home />} />
                  <Route path="signin" element={<Signin />}>
                    <Route path="signin" element={currentUser ? <Home /> : <Signin />} />
                  </Route>
                  <Route path="profile" >
                    <Route path=":id" element={<Profile />} />
                  </Route>
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                </Route>
              </Routes>

            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
