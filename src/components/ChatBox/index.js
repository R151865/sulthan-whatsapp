import { Avatar, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CallIcon from "@material-ui/icons/Call";
import VideocamIcon from "@material-ui/icons/Videocam";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MicIcon from "@material-ui/icons/Mic";

import { HiCurrencyRupee } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Pusher from "pusher-js";
import Cookies from "js-cookie";
import distanceInWordsToNow from "date-fns/formatDistanceToNow";
import addHours from "date-fns/addHours";
import addMinutes from "date-fns/addMinutes";
import { RiSendPlaneFill } from "react-icons/ri";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import "./index.css";

function ChatBox(props) {
  const userId = Cookies.get("userId");
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [room, setRoom] = useState({});

  useEffect(() => {
    async function FetchRoomMessages() {
      const jwtToken = Cookies.get("jwtToken");
      const url = `https://whatsapp-backend-sb.herokuapp.com/rooms/${roomId}/messages`;
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();

      const convertedMsgs = data.messages.map((each) => ({
        messageId: each._id,
        message: each.message,
        userId: each.user_id,
        userName: each.user_name,
        roomId: each.room_id,
        timestamp: each.timestamp,
      }));

      const lastSeen = convertedMsgs[convertedMsgs.length - 1].timestamp;

      const convertedRoom = {
        roomId: data.room._id,
        roomName: data.room.room_name,
        roomProfile: data.room.room_profile,
        lastSeen,
      };

      setRoom(convertedRoom);
      setMessages(convertedMsgs);
    }
    FetchRoomMessages();
  }, [roomId]);

  useEffect(() => {
    var pusher = new Pusher("b56383faa5c5cb36c00f", {
      cluster: "ap2",
    });

    var channel = pusher.subscribe("messages");
    channel.bind("inserted", function (data) {
      const newMsg = {
        messageId: data._id,
        message: data.message,
        userId: data.user_id,
        userName: data.user_name,
        roomId: data.room_id,
        timestamp: data.timestamp,
      };

      setMessages([...messages, newMsg]);
    });

    return () => {
      channel.unsubscribe();
      channel.unbind_all();
    };
  }, [messages]);

  useEffect(() => {
    var pusher = new Pusher("b56383faa5c5cb36c00f", {
      cluster: "ap2",
    });

    var channel = pusher.subscribe("messages");
    channel.bind("deleted", (data) => {
      const filteredMessages = messages.filter(
        (each) => each.messageId !== data.messageId
      );

      setMessages(filteredMessages);
    });

    return () => {
      channel.unsubscribe();
      channel.unbind_all();
    };
  }, [messages]);

  const sendMsgToBackendAPI = async () => {
    const message = input;
    setInput("");
    const jwtToken = Cookies.get("jwtToken");
    const url = `https://whatsapp-backend-sb.herokuapp.com/rooms/${roomId}/messages/new`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ message }),
    };

    const response = await fetch(url, options);
    const data = await response.json();
  };

  const onClickSendMsgButton = () => {
    sendMsgToBackendAPI();
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    sendMsgToBackendAPI();
  };

  const getFormattedDate = (timestamp) => {
    let newDate = new Date(timestamp);

    return distanceInWordsToNow(new Date(newDate));
  };

  const onClickDeleteButton = (messageId) => {
    const filteredMessages = messages.filter(
      (each) => each.messageId !== messageId
    );

    setMessages(filteredMessages);
    deleteMessageAPI(messageId);
  };

  const deleteMessageAPI = async (id) => {
    const url = `http://localhost:5000/messages/${id}`;
    const options = {
      method: "DELETE",
    };

    await fetch(url, options);
  };

  return (
    <div className="chat-box">
      <div className="chat-box__header">
        <IconButton onClick={() => navigate("/")}>
          <ArrowBackIcon />
        </IconButton>
        <Avatar />

        <div className="chat-box__headerInfo">
          <h3>{`${room.roomName}`.slice(0, 20)}</h3>
          <p>
            {room.lastSeen
              ? `${getFormattedDate(room.lastSeen)} ...ago`.slice(0, 20)
              : "last seen at..."}
          </p>
        </div>

        <div className="chat-box__headerRight">
          <IconButton onClick={() => navigate("/video-call")}>
            <VideocamIcon />
          </IconButton>

          <IconButton>
            <CallIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat-box__body">
        {messages.map((each) => (
          <p
            key={each.messageId}
            className={`chat-box__senderMessage 
            ${each.userId == userId ? "chat-box__receiverMessage" : ""}`}
          >
            <span className="chat-box__name">{each.userName}</span>
            {each.message}
            <span className="chat-box__timestamp">
              {getFormattedDate(each.timestamp)}
            </span>
            {each.userId == userId && (
              <motion.span
                whileTap={{ scale: 1.3 }}
                className="chat-box_removeMessage"
                onClick={() => onClickDeleteButton(each.messageId)}
              >
                delete
              </motion.span>
            )}
          </p>
        ))}
      </div>

      <div className="chat-box__footer">
        <div className="chat-box__search">
          <IconButton>
            <InsertEmoticonIcon />
          </IconButton>

          <form onSubmit={onSubmitForm}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="input"
              placeholder="Message..."
            />
          </form>
          <div className="chat-box__searchRightIcons">
            <div className="chat-box__searchFileButton">
              <IconButton>
                <AttachFileIcon />
              </IconButton>
            </div>

            <IconButton>
              <HiCurrencyRupee />
            </IconButton>

            <IconButton>
              <PhotoCameraIcon />
            </IconButton>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 1.1 }}
          className="button-send-button"
          onClick={onClickSendMsgButton}
        >
          <RiSendPlaneFill size={20} />
        </motion.button>
      </div>
    </div>
  );
}

export default ChatBox;
