import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";

import "./index.css";

function ChatItem({ roomData }) {
  return (
    <Link className="link-item" to={`/rooms/${roomData.roomId}/messages`}>
      <li className="chats-item">
        <Avatar className="chats-item__profile" />
        <div className="chats-item__info">
          <h3>
            {roomData.roomName}
            <span className="chats-item__timestamp">10:21pm</span>
          </h3>
          <p>The last message....</p>
        </div>
      </li>
    </Link>
  );
}

export default ChatItem;
