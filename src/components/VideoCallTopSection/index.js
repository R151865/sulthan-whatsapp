import "./index.css";
import { RiVideoAddFill } from "react-icons/ri";

import { useState, useEffect } from "react";
import Popup from "reactjs-popup";

import { FaVideo, FaVideoSlash } from "react-icons/fa";
import Pusher from "pusher-js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const URL = "https://whatsapp-backend-sb.herokuapp.com/";

function VideoCallTopSection({ connectWithBothUserAndOtherVideoCalls }) {
  const userId = Cookies.get("userId");
  const jwtToken = Cookies.get("jwtToken");
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [videoRespPopup, setVideoRespPopup] = useState(false);
  const [pusherVideoPermissionObj, setPusherVidePermissionObj] = useState({});
  const [selectValue, setSelectValue] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [originalUsersList, setOriginalUsersList] = useState([]);

  useState(() => {
    var pusher = new Pusher("b56383faa5c5cb36c00f", {
      cluster: "ap2",
    });

    var channel = pusher.subscribe("video-call");
    channel.bind("response", (data) => {
      if (data.isAccepted == true) {
        connectWithBothUserAndOtherVideoCalls(data.userId, data.myId);
      } else {
        setVideoRespPopup(true);
      }
    });
  }, []);

  useState(() => {
    var pusher = new Pusher("b56383faa5c5cb36c00f", {
      cluster: "ap2",
    });

    var channel = pusher.subscribe("video-call");
    channel.bind("asking-permission", (data) => {
      const pusherAskingPermissionObject = {
        userId: data.userId,
        name: data.name,
        myId: data.myId,
        myName: data.myName,
      };

      setPusherVidePermissionObj(pusherAskingPermissionObject);
      if (data.myId === userId) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    });
  }, []);

  useEffect(() => {
    fetchUsersAPI();
  }, []);

  const onChangeSelectValue = (e) => {
    setSelectValue(e.target.value);
    askingVideoCallPermissionAPI(e.target.value);
  };

  const askingVideoCallPermissionAPI = async (selectedId) => {
    const userIndex = originalUsersList.findIndex(
      (each) => each.userId === userId
    );
    const userObject = originalUsersList[userIndex];

    const myIndex = originalUsersList.findIndex(
      (each) => each.userId === selectedId
    );
    const myObject = originalUsersList[myIndex];

    const url = URL + "video-call/" + "asking-permission";
    const body = {
      userId: userObject.userId,
      name: userObject.name,
      myId: myObject.userId,
      myName: myObject.name,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, options);
    const data = await response.json();
  };

  const fetchUsersAPI = async () => {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(`${URL}users`, options);

    if (response.ok === true) {
      const data = await response.json();
      const filterUsersList = data.filter((each) => each.userId !== userId);
      setUsersList(filterUsersList);
      setOriginalUsersList(data);
    }
  };

  const videoCallAnswerOrRejectAPI = async (isAccepted) => {
    const url = URL + "video-call/" + "response";
    const body = {
      ...pusherVideoPermissionObj,
      isAccepted,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, options);
    await response.json();
  };

  const onClickAccept = () => {
    videoCallAnswerOrRejectAPI(true);
    setOpen(false);
    navigate("/video-call");
  };

  const onClickReject = () => {
    videoCallAnswerOrRejectAPI(false);
    setOpen(false);
  };

  const getVideoCallResponsePopup = () => {
    const { myName } = pusherVideoPermissionObj;
    return (
      <Popup
        open={videoRespPopup}
        modal
        position="center center"
        className="popup-content"
      >
        <div className="video-call-response">
          <h1>Video call to {myName} declined </h1>

          <button onClick={() => setVideoRespPopup(false)}>Close</button>
        </div>
      </Popup>
    );
  };

  const getPopup = () => {
    const { name } = pusherVideoPermissionObj;
    return (
      <Popup
        open={open}
        modal
        position="center center"
        className="popup-content"
      >
        <div className="video-accept-popup">
          <h1>{name} is making video call to you </h1>
          <img
            className="video-accept-popup-image"
            alt="video call popup"
            src="https://gogeticon.net/files/2599819/0f8a13197738a8cc76c3bfa841b40dad.png"
          />

          <div className="popup-buttons">
            <button className="accept-button" onClick={onClickReject}>
              <FaVideoSlash size={25} color="red" />
            </button>
            <button className="accept-button" onClick={onClickAccept}>
              <FaVideo size={25} color="green" />
            </button>
          </div>
        </div>
      </Popup>
    );
  };

  return (
    <div className="video_call_top">
      <div className="video_call_top__info">
        <RiVideoAddFill size={20} color="green" />
        <select value={selectValue} onChange={onChangeSelectValue}>
          {usersList.map((each) => (
            <option key={each.userId} value={each.userId}>
              {each.name}
            </option>
          ))}
        </select>
        {getPopup()}
        {getVideoCallResponsePopup()}
      </div>
    </div>
  );
}

export default VideoCallTopSection;
