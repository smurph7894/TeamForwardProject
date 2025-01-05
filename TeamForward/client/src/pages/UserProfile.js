import React from 'react'
import Profile from '../components/ProfilePage/Profile'
import { useLocation } from 'react-router-dom';
import NavMenu from "../components/NavMenu/NavMenu";

const UserProfile = () => {

  const {state} = useLocation();

  return (

    <div className="flex flex-col">
      <div className="lg:absolute">
        <NavMenu/>
      </div>
      <div className="m-0">
        <Profile 
        profileData={state}/>
      </div>
    </div>
  )
}

export default UserProfile
