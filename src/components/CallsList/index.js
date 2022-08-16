import CallItem from "../CallItem";
import { useState, useEffect } from "react";
import "./index.css";

import Cookies from "js-cookie";

import LoadingView from "../LoadingView";
import NoConnectionView from "../NoConnectionView";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  loading: "LOADING",
};

function CallsList() {
  const jwtToken = Cookies.get("jwtToken");

  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [callsList, setCallsList] = useState([]);

  useEffect(() => {
    fetchCallsListAPI();
  }, []);

  const fetchCallsListAPI = async () => {
    setApiStatus(apiStatusConstants.loading);

    const url = "https://whatsapp-backend-sb.herokuapp.com/calls";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok === true) {
      const data = await response.json();
      data.reverse();
      setCallsList(data);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const getCallsListSuccessView = () => {
    return (
      <ul className="calls-list__list">
        {callsList.map((each) => (
          <CallItem key={each.callId} callData={each} />
        ))}
      </ul>
    );
  };

  const renderBasedOnApiStatus = () => {
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return <LoadingView />;
      case apiStatusConstants.failure:
        return <NoConnectionView retryAgain={fetchCallsListAPI} />;
      case apiStatusConstants.success:
        return getCallsListSuccessView();
      default:
        return null;
    }
  };

  return <div className="calls-list">{renderBasedOnApiStatus()}</div>;
}

export default CallsList;
