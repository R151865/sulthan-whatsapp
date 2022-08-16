import { Avatar, IconButton } from "@material-ui/core";
import Popup from "reactjs-popup";
import { useState } from "react";
import { format } from "date-fns";
import { FaVideo } from "react-icons/fa";

import "./index.css";

function CallItem({ callData }) {
  const { callBy, callTo, timestamp, isSuccess } = callData;

  return (
    <li className="call-item">
      <Avatar />
      <div className="call-list__info">
        <h3>
          {callBy} to {callTo}
        </h3>
        <p>{format(new Date(timestamp), "EEE, MMMM do, yyyy  hh:mm a")}</p>

        <IconButton>
          <FaVideo size={18} color={isSuccess ? "green" : "red"} />
        </IconButton>
      </div>
    </li>
  );
}

export default CallItem;
