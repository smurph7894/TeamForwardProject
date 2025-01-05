import axios from "axios";
import { useEffect, useState } from "react";
import blankProfileImg from "../../src/assets/home/blank-profile.png"

const ImageIcon = (props) => {
  //...otherProps is a way to pass all the props that are not destructured in the const {user, imgClassName, ...otherProps} = props; line
    const {user, imgClassName, ...otherProps} = props;
    const [userPicture, setUserPicture] = useState("");

    useEffect(()=>{
        if(user.s3ProfilePhotoKey){
          axios
            .get(`${process.env.REACT_APP_BE_URL}/photos/${user.s3ProfilePhotoKey}/getphoto`, {responseType: 'blob'})
            .then((res) => {
              // console.log(res);
              const blobData = res.data;
              const blobUrl = URL.createObjectURL(blobData);
              setUserPicture(blobUrl);
            })
            .catch ( (err) => {
              console.log(err)
            })
        } else {
            setUserPicture(blankProfileImg);
        };
    },[]);

    return (
      <img
      className={imgClassName} 
      src={userPicture}
      alt={`${user.firstName} profile picture`}
      {...otherProps}
       />
    );
};
export default ImageIcon