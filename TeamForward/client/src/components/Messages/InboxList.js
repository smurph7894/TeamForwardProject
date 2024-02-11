import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom'
import { useReactiveVar } from "@apollo/client";
import { profilePictureState, userState } from "../../GlobalState";
import ImageIcon from '../ImageIcon';

const InboxList = (props) => {

  const {chatRoom, otherUser} = props;
  const user = useReactiveVar(userState);
  const profilePicture = useReactiveVar(profilePictureState);
  const navigate = useNavigate();

    const selectChatRoom = () => {
      return navigate(`/chat/${chatRoom._id}`);
    };

  return (
    <button onClick={selectChatRoom} className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
        <div className="flex items-center">
          <ImageIcon
            imgClassName={'object-cover w-10 h-10 rounded-full mr-3'}
            user={otherUser}
            width="32"
            height="32"
          />
          <div>
            <h4 className="text-med font-semibold text-gray-900">{otherUser.firstName} {otherUser.lastName}</h4>
          </div>
        </div>
    </button>
  );
};
export default InboxList;
