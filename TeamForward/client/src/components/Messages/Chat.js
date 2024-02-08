import React,{useState,useEffect, useRef} from 'react'
import axios from 'axios'
import {io} from 'socket.io-client'
import { useParams } from 'react-router-dom';
import { useReactiveVar } from "@apollo/client";
import { profilePictureState, userState } from "../../GlobalState";
import NavMenu from '../NavMenu/NavMenu';
import useChatScroll from './UseChatScroll';
import ImageIcon from '../ImageIcon';
import Messages from './Messages';


const Chat = ({socket}) => {
  const user = useReactiveVar(userState);
  const {chatId} = useParams()
  const [message,setMessage] = useState('')
  const [messageList,setMessageList] = useState([])
  const [otherUser,setOtherUser] = useState({})
  const chatWindowRef = useRef(null);

  useEffect(()=>{
    chatWindowRef.current?.scrollIntoView()
  },[messageList])
 
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BE_URL}/messaging/chatRoom/${chatId}/allMessages`)
    .then((res)=>{
    
      // console.log("grabbed messages from db:",res.data[0].messages)
      // console.log("other user:", res.data[0].otherUser)
      setMessageList(res.data[0].messages)
      setOtherUser(res.data[0].otherUser)
    }).catch((err)=>{
      console.log(err)
    })
  },[])

  useEffect(()=>{
    socket.on("message",(data)=>{
      const newFrom = otherUser._id == data.from ? otherUser.firstName : data.from
      const updatedMessage = {...data, from: newFrom };

      setMessageList((prevMessageList) => [...prevMessageList, updatedMessage]);

    })
    // return () => socket.disconnect(true);
  },[socket])

  useEffect(()=>{
    // on component load user joins private room based on chatRoomId
    socket.emit('join',chatId)
  },[]);

  useEffect(()=>{
    for(let message of messageList){
      if(message.unread === true){
        axios.put(`${process.env.REACT_APP_BE_URL}/messaging/message/${message._id}/update`)
          .then((res)=>{
          }).catch((err)=> console.log(`your message could not be updated to read`));
      }
    }
  }, [messageList]);

  const submitMessage = (e) => {
    e.preventDefault()
    if(!message) {
      console.log("no message")
      return
    }
    // emits message to server which is sent to shared private room
    socket.emit("clientMessage",{
      chatRoomId: chatId,
      from: user._id,
      to: otherUser._id,
      message,
      unread:false
    })
    setMessage("")
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex block sm:items-center justify-between">
        <NavMenu />
      </div>
      <div className="flex flex-col space-y-4 p-3 sm:w-1/3 sm:mx-auto overflow-y-auto h-full scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        <div className=" text-center border-b pb-3">
          <h1 className="text-4xl font-medium text-gray-700">
            {`${otherUser.firstName} ${otherUser.lastName}`}
          </h1>
        </div>
          {
            messageList.map((message)=>{
              return (
                <div>
                  <Messages
                    message = {message}
                    otherUser = {otherUser}
                  />
                </div>
              )
            })
          }
          <div ref={chatWindowRef} />
      </div>
      
      <div className="flex-shrink-0 flex p-4 border-t sm:w-1/2 mx-auto bg-white">
        <div className="relative flex-grow">
          <form onSubmit={submitMessage} className="flex" >
            <input
              type="text"
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
              className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Type your message..."
            />
            <button className="text-white ml-4 py-2 px-4 uppercase rounded bg-green-900 hover:bg-green-900 shadow hover:shadow-lg h-10  font-medium transition transform hover:-translate-y-0.5">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat
