import { Avatar } from "@material-ui/core";
import "./index.css";
import StatusItem from "../StatusItem";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import LoadingView from "../LoadingView";
import NoConnectionView from "../NoConnectionView";
import CreateStatus from "../CreateStatus";
import Pusher from "pusher-js";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  loading: "LOADING",
};

function StatusList() {
  const [showCreateStatus, setShowCreateStatus] = useState(false);
  const [status, setStatus] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  useEffect(() => {
    var pusher = new Pusher("b56383faa5c5cb36c00f", {
      cluster: "ap2",
    });

    var channel = pusher.subscribe("status");
    channel.bind("deleted", (data) => {
      const filteredStatus = status.filter(
        (each) => each.statusId !== data.statusId
      );
      setStatus(filteredStatus);
    });
    return () => {
      channel.unsubscribe();
      channel.unbind_all();
    };
  }, [status]);

  useEffect(() => {
    var pusher = new Pusher("b56383faa5c5cb36c00f", {
      cluster: "ap2",
    });

    var channel = pusher.subscribe("status");
    channel.bind("inserted", (data) => {
      const newStatus = {
        statusId: data._id,
        videoUrl: data.video_url,
        imageUrl: data.image_url,
        statusMessage: data.status_message,
        userId: data.user_id,
        userName: data.user_name,
        timestamp: data.timestamp,
        isVideo: data.is_video,
      };

      setStatus([newStatus, ...status]);
    });
    return () => {
      channel.unsubscribe();
      channel.unbind_all();
    };
  }, [status]);

  useEffect(() => {
    fetchStatusAPI();
  }, []);

  const fetchStatusAPI = async () => {
    setApiStatus(apiStatusConstants.loading);
    const jwtToken = Cookies.get("jwtToken");
    const url = "https://whatsapp-backend-sb.herokuapp.com/status";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(url, options);

    if (response.ok === true) {
      const data = await response.json();

      const convertedData = data.map((each) => ({
        statusId: each._id,
        videoUrl: each.video_url,
        imageUrl: each.image_url,
        statusMessage: each.status_message,
        userId: each.user_id,
        userName: each.user_name,
        timestamp: each.timestamp,
        isVideo: each.is_video,
      }));
      convertedData.reverse();
      setStatus(convertedData);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const statusSuccessView = () => {
    return (
      <ul className="status-list__list">
        {status.map((each) => (
          <StatusItem key={each.statusId} statusData={each} />
        ))}
      </ul>
    );
  };

  const renderViewsBasedOnStatus = () => {
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return <LoadingView />;
      case apiStatusConstants.failure:
        return <NoConnectionView retryAgain={fetchStatusAPI} />;

      case apiStatusConstants.success:
        return statusSuccessView();

      default:
        return null;
    }
  };

  const onClickMyStatus = () => {
    setShowCreateStatus(true);
  };

  const onClickMyStatusClose = () => {
    setShowCreateStatus(false);
  };

  return (
    <div className="status-list">
      <div className="status-list__myStatus">
        <div className="status-list__avatar" onClick={onClickMyStatus}>
          <Avatar />
          <button type="button">+</button>
        </div>
        <div className="status-list__myStatusInfo">
          <h3>My Status</h3>
          <p>Tap to add status update</p>
        </div>
      </div>

      {showCreateStatus && (
        <CreateStatus onClickMyStatusClose={onClickMyStatusClose} />
      )}
      <p>Recent updates</p>

      {renderViewsBasedOnStatus()}
    </div>
  );
}

export default StatusList;
