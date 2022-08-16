import Cookies from "js-cookie";

import ChatItem from "../ChatItem";
import NoConnectionView from "../NoConnectionView";
import LoadingView from "../LoadingView";

import { useEffect, useState } from "react";

import "./index.css";

const apiStatusConstants = {
  failure: "FAILURE",
  success: "SUCCESS",
  loading: "LOADING",
  initial: "INITIAL",
};

function ChatsList() {
  const [rooms, setRooms] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setApiStatus(apiStatusConstants.loading);
    const jwtToken = Cookies.get("jwtToken");
    const url = "https://whatsapp-backend-sb.herokuapp.com/";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok === true) {
      const convertedRooms = data.map((each) => ({
        roomId: each._id,
        roomName: each.room_name,
        roomProfile: each.room_profile,
      }));

      setRooms(convertedRooms);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const renderChatsListSuccessView = () => (
    <ul className="chatslist__list">
      {rooms.map((each) => (
        <ChatItem key={each.roomId} roomData={each} />
      ))}
    </ul>
  );

  const renderViewsBasedOnApiStatus = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderChatsListSuccessView();
      case apiStatusConstants.failure:
        return <NoConnectionView retryAgain={fetchRooms} />;
      case apiStatusConstants.loading:
        return <LoadingView />;
      default:
        return null;
    }
  };

  return <div className="chatslist">{renderViewsBasedOnApiStatus()}</div>;
}

export default ChatsList;
