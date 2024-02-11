import { useState,  } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";
import { userState, profilePictureState, setProfilePictureState } from "../GlobalState";
import log from "../helpers/logging";
import ProfileForm from "../components/UpdateProfilePage/ProfileForm";
import NavMenu from "../components/NavMenu/NavMenu";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const user = useReactiveVar(userState);
  const profilePicture = useReactiveVar(profilePictureState);
  const [imgFile, setImgFile] = useState();
  const [profileImg, setProfileImg] = useState(profilePicture || null);

  console.log("updateProfile UserState", user)
  const [formInfo, setFormInfo] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    profession: user.profession,
    zipCode: user.zipCode,
    radius: user.radius,
    s3ProfilePhotoKey: user.s3ProfilePhotoKey,
    interests: {
      Networking: user.interests.networking,
      Mentorship: user.interests.mentorship,
      Chingu: user.interests.chingu,
    },
    activities: {
      VirtualCoffee: user.activities.virtualCoffee,
      Hiking: user.activities.hiking,
      Running: user.activities.running,
    },
  });

  const handleFormInfoChange = (key, value) => {
    setFormInfo({ ...formInfo, [key]: value });
  };

  const handleInterests = (key, value) => {
    setFormInfo({
      ...formInfo,
      interests: {
        ...formInfo.interests,
        [key]: value,
      },
    });
  };

  const handleActivities = (key, value) => {
    setFormInfo({
      ...formInfo,
      activities: {
        ...formInfo.activities,
        [key]: value,
      },
    });
  };

  const uploadProfilePicture = async(imgFile) => {
    if(!user.s3ProfilePhotoKey && imgFile){
      const photoData = new FormData();
      photoData.append('photo', imgFile);

      try{
        const response = await axios
          .post(`${process.env.REACT_APP_BE_URL}/user/${user._id}/photo`, photoData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
          })
        userState({
          ...user,
          s3ProfilePhotoKey: response.data.photoKey,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      const photoData = new FormData();
      photoData.append('photo', imgFile);

      try {
        const response = await axios
          .put(`${process.env.REACT_APP_BE_URL}/user/${user._id}/photos/${user.s3ProfilePhotoKey}/update`, photoData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
          })
        userState({
          ...user,
          s3ProfilePhotoKey: response.data.photoKey,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  const updateProfile = async (form) => {
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      bio: form.bio,
      profession: form.profession,
      zipCode: form.zipCode,
      radius: form.radius,
      interests: {
        networking: form.interests.Networking,
        mentorship: form.interests.Mentorship,
        chingu: form.interests.Chingu,
      },
      activities: {
        virtualCoffee: form.activities.VirtualCoffee,
        hiking: form.activities.Hiking,
        running: form.activities.Running,
      },
    };
    
    let photoKey;

    try{
      const response = await axios
        .put(`${process.env.REACT_APP_BE_URL}/teamForward/${user._id}`, payload);

      userState(response.data);
      photoKey = response.data.s3ProfilePhotoKey;
    } catch (error) {
        console.log(error);
    }

    try{
      const response = await axios
        .get(`${process.env.REACT_APP_BE_URL}/photos/${photoKey}/getphoto`, {responseType: 'blob'});
      setProfilePictureState(response.data);
    } catch (error) {
      console.log(error);
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await uploadProfilePicture(imgFile);
      await updateProfile(formInfo);
      navigate("/feed");
    } catch (error) {
      log(error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="lg:absolute">
        <NavMenu />
        <h1 className="font-bold inline-block">{user ? `${user.firstName} ${user.lastName}`: ""}</h1>
      </div>
      <div className="m-0">
        <ProfileForm
          formInfo={formInfo}
          setFormInfo={setFormInfo}
          handleFormInfoChange={handleFormInfoChange}
          handleInterests={handleInterests}
          handleActivities={handleActivities}
          handleSubmit={handleSubmit}
          profileImg={profileImg}
          setProfileImg={setProfileImg}
          imgFile={imgFile}
          setImgFile={setImgFile}
        />
      </div>
    </div>
  );
};

export default UpdateProfile;
