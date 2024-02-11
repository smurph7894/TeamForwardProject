import { useReactiveVar } from "@apollo/client";
import React from "react";
import { userState } from "../../GlobalState";
import ImageIcon from "../ImageIcon";
import dateformat from 'dateformat'

const Messages = (props) => {
    const user = useReactiveVar(userState);
    const {message, otherUser} = props;
    let messageSide = user._id === message.from ? "flex flex-row justify-start mb-2" :"flex flex-row justify-end mb-2";
    let bGColor = user._id === message.from ? "relative px-4 py-2 max-w-xs rounded-lg bg-slate-100" :"relative px-4 py-2 max-w-xs rounded-lg bg-green-200";
    let imageUser = user._id === message.from ? user : otherUser;

  return (
    <div key={message._id} className={messageSide}>
        <ImageIcon
        imgClassName = {'w-8 h-8 rounded-full align-middle'}
        user = {imageUser}
        />
        <div className="flex flex-col items-start">
            <div className={bGColor}>
                <div className="text-med leading-tight mb-2">
                {message.message}
                </div>
                <div className="text-xs text-gray-500">{dateformat(message.createdAt, "dddd, h:MM TT") }</div>
            </div>
        </div>
    </div>
  );
};

export default Messages;