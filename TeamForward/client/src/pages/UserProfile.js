import React from 'react'
import Profile from '../components/ProfilePage/Profile'
import { useLocation } from 'react-router-dom';

const UserProfile = () => {

  const {state} = useLocation();

  return (
    <div>
      <Profile 
      profileData={state}/>
    </div>
  )
}

export default UserProfile
