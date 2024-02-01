import { makeVar } from "@apollo/client";

export const userState = makeVar();

export const profilePictureState = makeVar();

export const setProfilePictureState = (blobData) => {
    const blobUrl = URL.createObjectURL(blobData);
    profilePictureState(blobUrl);
};