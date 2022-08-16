import { IconButton } from "@material-ui/core";
import { motion } from "framer-motion";

import CameraAltIcon from "@material-ui/icons/CameraAlt";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import "./index.css";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { TbLogout } from "react-icons/tb";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { IoMdVideocam } from "react-icons/io";

function Header({ activeTab = "CHATS", updateActiveTab }) {
  const navigate = useNavigate();
  const userName = Cookies.get("userName");

  const [showMenu, setShowMenu] = useState(false);

  const activeChatTabClassName = activeTab === "CHATS" ? "active-tab" : "";
  const activeStatusTabClassName = activeTab === "STATUS" ? "active-tab" : "";
  const activeCallTabClassName = activeTab === "CALLS" ? "active-tab" : "";

  const onClickLogout = () => {
    Cookies.remove("jwtToken");
    Cookies.remove("userId");
    Cookies.remove("userName");
    navigate("/login", { replace: true });
  };

  const renderRightTopMenu = () => (
    <motion.div
      animate={showMenu ? "open" : "closed"}
      variants={{
        open: { opacity: 1, y: 0 },
        closed: { opacity: 1, y: "-100%" },
      }}
      transition={{ duration: 1 }}
      className="right_top_menu"
      onClick={() => setShowMenu(false)}
    >
      <p>Hello, {userName}</p>
      <p>Linked devices</p>
      <p>New broadcast</p>
      <p>Settings</p>
      <button onClick={onClickLogout}>LOGOUT</button>
    </motion.div>
  );

  return (
    <div className="header">
      {renderRightTopMenu()}

      <div className="header__top">
        <p>WhatsApp</p>
        <div className="header__topRight">
          <IconButton onClick={() => navigate("/video-call")}>
            <IoMdVideocam className="icon-button" />
          </IconButton>

          <IconButton onClick={() => setShowMenu(true)}>
            <MoreVertOutlinedIcon className="icon-button" />
          </IconButton>
        </div>
      </div>

      <div className="header__tabs">
        <CameraAltIcon onClick={() => navigate("/video-call")} />

        <button
          onClick={() => updateActiveTab("CHATS")}
          type="button"
          className={`header__tabsButton ${activeChatTabClassName}`}
        >
          CHATS
        </button>
        <button
          onClick={() => updateActiveTab("STATUS")}
          type="button"
          className={`header__tabsButton ${activeStatusTabClassName}`}
        >
          STATUS
        </button>
        <button
          onClick={() => updateActiveTab("CALLS")}
          type="button"
          className={`header__tabsButton ${activeCallTabClassName}`}
        >
          CALLS
        </button>
      </div>
    </div>
  );
}

export default Header;
