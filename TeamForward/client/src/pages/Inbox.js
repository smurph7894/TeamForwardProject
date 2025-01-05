import InboxList from "../components/Messages/InboxList";
import { useReactiveVar } from "@apollo/client";
import { profilePictureState, userState } from "../GlobalState";
import { useEffect, useState } from "react";
import axios from "axios";
import Search from "../components/Messages/Search";
import { useNavigate } from "react-router-dom";
import NavMenu from "../components/NavMenu/NavMenu";

const Inbox = () => {
  const user = useReactiveVar(userState);
  const profilePicture = useReactiveVar(profilePictureState);
  const id = user._id;
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BE_URL}/messaging/inbox`)
      .then((res) => {
        // console.log("returned chats");
        setChats(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BE_URL}/messaging/user/message/unreadCount`)
    .then((res)=>{
        setUnreadCount(res.data);
    }).catch((err)=>{
        console.log(err);
    });
}, []);

  return (
    <div>
      <div className="">
          <section className="mb-25 ">
            {/* <nav className="navbar navbar-expand-lg shadow-md  bg-gradient-to-r from-green-900 via-[#76a11e] to-[white] relative flex items-center w-full justify-between"> */}
            {/* <nav className="navbar navbar-expand-lg shadow-md bg-[#76a11e] relative flex items-center w-full justify-between"> */}
            <nav className="navbar navbar-expand-lg shadow-md bg-white relative flex items-center w-full">
              <div className="px-6 w-full flex flex-wrap items-center justify-between">
                <div>
                  <div className="ml-4">
                    <NavMenu />
                  </div>
                </div>
                <div className="flex items-center justify-center h-28 w-64">
                {/* <div className="flex items-center justify-center h-28 w-64 bg-[#76a11e]"> */}
                {/* <div className="flex items-center justify-center h-28 w-64 bg-green-900 shadow-lg"> */}
                  {/* <img src={profilePicture} alt="coverImage" className="object-cover w-20 h-20 rounded-full"></img> */}
                  <h1 className="font-bold text-green-900 text-xl">TEAM FORWARD</h1>
                </div>
              </div>
            </nav>
          </section>
      </div>
      <div className="bg-gray-50 ">

      <section className=" justify-center antialiased bg-gray-50 text-gray-600 min-h-screen p-4">
        <div className="h-full">
          <div className="relative max-w-screen-sm mx-auto bg-white shadow-lg rounded-lg ">
            <header className="pt-6 pb-4 px-5 border-b border-gray-200">
              <div className="flex space-y-8 items-center mb-3 flex-col">
                <div className="flex items-center">
                  <a className="inline-flex items-start mr-3" href="#0">
                    <img
                      className="object-cover w-20 h-20 rounded-full"
                      src={profilePicture}
                      width="48"
                      height="48"
                      alt="user profile picture"
                    />
                  </a>
                  <div className="pr-1">
                    <a
                      className="inline-flex text-gray-800 hover:text-gray-900"
                      href="#0"
                    >
                      <h2 className="text-xl leading-snug font-bold">
                        {`${user.firstName} ${user.lastName}`}
                      </h2>
                    </a>
                  </div>
                </div>
              </div>
            <div className="text-blue-800 text-sm font-bold">Unread Messages: {unreadCount}</div>
            </header>
            <div className="py-3 px-5">
              <h3 className="text-xs font-semibold uppercase text-gray-400 mb-1">
                Chats
              </h3>
              <div className="divide-y divide-gray-200">
                {chats.map((chat) => {
                  return <InboxList chatRoom={chat.ChatRoomInfo} otherUser={chat.userObject} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

  </div>


    
  );
};
export default Inbox;
