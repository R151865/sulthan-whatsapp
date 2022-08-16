import "./index.css";
import { useState } from "react";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { TailSpin } from "react-loader-spinner";
import { GrClose } from "react-icons/gr";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  loading: "LOADING",
};

export default function CreateStatus({ onClickMyStatusClose }) {
  const jwtToken = Cookies.get("jwtToken");

  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState("");
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const [cloudinaryFile, setCloudinaryFile] = useState("");
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const onClickCloseButton = () => {
    onClickMyStatusClose();
  };

  const onChangeCheckBox = () => {
    setChecked(!checked);
    setFile("");
  };

  const onChangeFile = (e) => {
    setCloudinaryFile(e);
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  const isValidFormData = () => {
    if (checked === false) {
      if (file === "") {
        setErr("Upload image");
        return false;
      }
    }

    if (checked === true) {
      if (url === "") {
        setErr("Provide video URL");
        return false;
      }
    }

    setErr("");
    return true;
  };

  const uploadCloudinaryImages = async () => {
    setApiStatus(apiStatusConstants.loading);

    const file = cloudinaryFile.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "awqrygqn");

    const url = "https://api.cloudinary.com/v1_1/drgclgorx/image/upload";
    const options = {
      method: "POST",
      body: formData,
    };
    const response = await fetch(url, options);

    if (response.ok === true) {
      const data = await response.json();
      if (data.secure_url !== "") {
        return data.secure_url;
      }
    }

    return "";
  };

  const postStatusToBackendAPI = async (imageUrl) => {
    setApiStatus(apiStatusConstants.loading);

    const statusData = {
      videoUrl: url,
      imageUrl: imageUrl,
      isVideo: checked,
      statusMessage: message,
    };

    const backendURL = "https://whatsapp-backend-sb.herokuapp.com/status";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(statusData),
    };
    const response = await fetch(backendURL, options);
    if (response.ok === true) {
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const onClickCreateStatusButton = async () => {
    isValidFormData();

    let imageUrl = "";
    if (checked === false) {
      imageUrl = await uploadCloudinaryImages();
    }

    postStatusToBackendAPI(imageUrl);
  };

  const loadingView = () => {
    return (
      <div className="create-status-loading">
        <TailSpin color="#00BFFF" height={50} width={50} />
      </div>
    );
  };
  const successView = () => {
    return (
      <div className="success-view">
        <motion.button
          onClick={onClickCloseButton}
          whileTap={{ scale: 1.2 }}
          type="button"
        >
          <GrClose size={30} />
        </motion.button>
        <img
          alt="sucecss view"
          src="https://sellcodes.com/assets/images/Purchase_Success.png"
        />
      </div>
    );
  };

  const failureView = () => {
    return (
      <div className="failure-view">
        <motion.button
          onClick={onClickCloseButton}
          whileTap={{ scale: 1.2 }}
          type="button"
        >
          <GrClose size={30} />
        </motion.button>
        <img
          alt="failure"
          src="https://png.pngtree.com/png-vector/20220615/ourmid/pngtree-lost-wireless-connection-or-disconnected-cable-png-image_5085752.png"
        />
      </div>
    );
  };

  const initialView = () => {
    return (
      <>
        <motion.button
          onClick={onClickCloseButton}
          className="close-button-status-creation"
          whileTap={{ scale: 1.2 }}
          type="button"
        >
          <GrClose size={30} />
        </motion.button>

        <div className="check-box-div">
          <label>Video status ?</label>
          <input type="checkbox" onChange={onChangeCheckBox} />
        </div>

        {checked ? (
          <div className="input-div">
            <label>Video URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="input"
              placeholder="Enter Video URL"
            />
          </div>
        ) : (
          <div className="input-div">
            <label>Upload your image</label>
            <input type="file" multiple onChange={onChangeFile} />
          </div>
        )}

        {file.length > 0 && (
          <img className="status-image" alt="status" src={file} />
        )}

        <div className="input-div">
          <label>Status message</label>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Your message"
          />
        </div>

        <motion.button
          whileTap={{ scale: 1.2 }}
          onClick={onClickCreateStatusButton}
          className="create-status-button"
          type="button"
        >
          Create status
        </motion.button>
        {err !== "" && <p className="create-status-err">{err}</p>}
      </>
    );
  };

  const renderViewsBasedOnAPIStatus = () => {
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return loadingView();
      case apiStatusConstants.success:
        return successView();
      case apiStatusConstants.failure:
        return failureView();
      case apiStatusConstants.initial:
        return initialView();
      default:
        return null;
    }
  };

  return (
    <div className="crete-status-body">{renderViewsBasedOnAPIStatus()}</div>
  );
}
