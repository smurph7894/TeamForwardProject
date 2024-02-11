import { useState } from "react";
import Profile from "../components/ProfilePage/Profile";
import { userState } from "../GlobalState";
import log from "../helpers/logging";
import { useReactiveVar } from "@apollo/client";



const MyProfile = ({}) => {

  const user = useReactiveVar(userState);
  

  const [profileData, setProfileData] = useState({
    _id: user?._id || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    bio: user?.bio || "",
    zipCode: user?.zipCode || "",
    profession: user?.profession || "",
    zipCode: user?.zipCode || "",
    radius: user?.radius || "",
    zipCode: user?.zipCode || "",
    s3ProfilePhotoKey: user?.s3ProfilePhotoKey || "",
    interests: user?.interests || "",
    activities: user?.activities || "",
  });

  return (
    <Profile 
    profileData={profileData}
    setProfileData={setProfileData}
    />
  );
};

export default MyProfile;
