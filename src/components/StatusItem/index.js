import { Avatar } from "@material-ui/core";
import Popup from "reactjs-popup";
import ReactPlayer from "react-player";
import { VscChromeClose } from "react-icons/vsc";
import { AiFillDelete } from "react-icons/ai";
import Cookies from "js-cookie";

import { motion } from "framer-motion";
import { useState } from "react";
import distanceInWordsToNow from "date-fns/formatDistanceToNow";

import "./index.css";

function StatusItem({ statusData }) {
  const jwtToken = Cookies.get("jwtToken");
  const userId = Cookies.get("userId");

  const {
    statusId,
    videoUrl,
    imageUrl,
    statusMessage,
    userName,
    timestamp,
    isVideo,
  } = statusData;

  const [openVideo, setOpenVideo] = useState(false);

  const onClickRemoveButton = () => {
    removeStatusBackendAPI();
  };

  const removeStatusBackendAPI = async () => {
    const url = `https://whatsapp-backend-sb.herokuapp.com/status/${statusId}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    await fetch(url, options);
  };

  const getFormattedDatetime = (timestamp) => {
    return distanceInWordsToNow(new Date(timestamp));
  };

  const onClickVideoCloseButton = () => {
    setOpenVideo(false);
  };

  const renderMediaView = () => (
    <Popup
      onClose={() => setOpenVideo(false)}
      open={openVideo}
      className="popup-content"
      modal
    >
      {(close) => (
        <div className="popup-body">
          <button onClick={onClickVideoCloseButton} className="close-button">
            <VscChromeClose size={35} />
          </button>
          {isVideo ? (
            <div className="react-wrapper">
              <ReactPlayer
                playing={openVideo}
                width="100%"
                height="100%"
                className="react-player"
                url={videoUrl}
              />
            </div>
          ) : (
            <img className="status-imag" alt="stat" src={imageUrl} />
          )}

          <p className="status-message">{statusMessage}</p>
        </div>
      )}
    </Popup>
  );
  const renderStatusView = () => (
    <li className="status-item">
      <motion.div
        whileTap={{ scale: 1.1 }}
        className="status-item__body"
        onClick={() => setOpenVideo(true)}
      >
        <Avatar />
        <div className="status-item__info">
          <h3>{userName}</h3>

          <p>{getFormattedDatetime(timestamp)} ago...</p>
        </div>
      </motion.div>

      {userId === statusData.userId && (
        <motion.button
          onClick={onClickRemoveButton}
          whileTap={{ scale: 1.2 }}
          className="status-item-remove"
          type="button"
        >
          <AiFillDelete size={20} />
        </motion.button>
      )}

      {renderMediaView()}
    </li>
  );

  return renderStatusView();
}

export default StatusItem;
