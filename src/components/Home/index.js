import React, { useState } from "react";

import Header from "../Header";
import ChatsList from "../ChatsList";
import StatusList from "../StatusList";
import CallsList from "../CallsList";

import "./index.css";

function Home() {
  const [activeTab, setActiveTab] = useState("CHATS");

  const updateActiveTab = (activeTab) => {
    setActiveTab(activeTab);
    // getBackendPostCall();
  };

  const renderViewsBasedOnActiveTab = () => {
    switch (activeTab) {
      case "CHATS":
        return <ChatsList />;
      case "STATUS":
        return <StatusList />;
      case "CALLS":
        return <CallsList />;
      default:
        return null;
    }
  };

  return (
    <div className="whatsapp-home">
      <Header activeTab={activeTab} updateActiveTab={updateActiveTab} />
      {renderViewsBasedOnActiveTab()}
    </div>
  );
}

export default Home;
