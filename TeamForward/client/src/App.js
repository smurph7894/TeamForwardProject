import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useReactiveVar } from "@apollo/client";
import { userState, profilePictureState, setProfilePictureState } from "./GlobalState";
import log from "./helpers/logging";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import UpdateProfile from "./pages/UpdateProfile";
import MyProfile from "./pages/MyProfile"
import UserProfile from "./pages/UserProfile";
import Inbox from "./pages/Inbox"
import Chat from "./components/Messages/Chat"
import {io} from 'socket.io-client'
import blankProfileImg from "../src/assets/home/blank-profile.png"

const socket = io(process.env.REACT_APP_BE_URL)
axios.defaults.withCredentials = true;

const ProtectedRoute = ({ children }) => {
  const user = useReactiveVar(userState);
  const profilePicture = useReactiveVar(profilePictureState);

  if (!user) {
    return <Navigate to="/signin" />;
  }
  return children;
};

function App() {
  const user = useReactiveVar(userState);
  const [apiComplete, setApiComplete] = useState(user ? true : false);

  useEffect(() => {
    if (!user) {
      axios
        // .get(`${process.env.REACT_APP_BE_URL}/signin/success`)
        .get(`${process.env.REACT_APP_BE_URL}/teamForward/loggedInUser`)
        .then((res) => {
          userState(res.data);
          setApiComplete(true);
        })
        .catch((err) => {
          log(err);
          setApiComplete(true);
        });
      }

      if(user?.s3ProfilePhotoKey){
        axios
          .get(`${process.env.REACT_APP_BE_URL}/photos/${user.s3ProfilePhotoKey}/getphoto`, {responseType: 'blob'})
          .then((res) => {
            // console.log(res);
            setProfilePictureState(res.data);
          })
          .catch ( (err) => {
            console.log(err)
          })
      } else {
        profilePictureState(blankProfileImg)
      }
  }, [user]);

  if (!apiComplete) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signin"
          element={user ? <Navigate to="/feed" /> : <SignIn />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={user ? <Navigate to="/feed" /> : <Home />} />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/updateprofile"
          element={
            <ProtectedRoute>
            <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myProfile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userProfile/:id"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userProfile/:id"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute>
              <Chat socket={socket} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
