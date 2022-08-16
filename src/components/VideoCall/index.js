import "./index.css";
import { Peer } from "peerjs";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { MdVideocamOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import Pusher from "pusher-js";

import VideoCallTopSection from "../VideoCallTopSection";

function VideoCall() {
  const navigate = useNavigate();
  const userId = Cookies.get("userId");

  const [changeVideoPostion, setChangeVideoPosition] = useState(false);
  const [localStream, setLocalStream] = useState("");

  const peerInstance = useRef(null);
  const myVideoRef = useRef(null);
  const otherVideoRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [peerId, setPeerId] = useState("");

  const onChangeInputValue = () => {
    makeCall(inputValue);
  };

  useEffect(() => {
    startVideoCall();
  }, []);

  const getMyMedia = () => {
    return (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia
    );
  };

  const startVideoCall = async () => {
    const peer = new Peer(userId);
    peer.on("open", (id) => {
      setPeerId(id);
    });

    const userMedia = getMyMedia();
    userMedia({ video: true, audio: true }, (myStream) => {
      setLocalStream(myStream);
      myVideoRef.current.srcObject = myStream;
      myVideoRef.current.onloadedmetadata = function (e) {
        myVideoRef.current.play();
      };
    });

    peer.on("call", (call) => {
      userMedia({ video: true, audio: true }, (myStream) => {
        myVideoRef.current.srcObject = myStream;
        myVideoRef.current.play();

        call.answer(myStream);
        call.on("stream", (otherStream) => {
          otherVideoRef.current.srcObject = otherStream;
          otherVideoRef.current.play();

          setChangeVideoPosition(true);
        });
      });
    });

    peerInstance.current = peer;
  };

  const makeCall = (otherId) => {
    const myMedia = getMyMedia();
    myMedia({ video: true, audio: true }, (myStream) => {
      myVideoRef.current.srcObject = myStream;
      myVideoRef.current.onloadedmetadata = function (e) {
        myVideoRef.current.play();
      };

      //   62d004f547072ef3a950b5ff
      const call = peerInstance.current.call(otherId, myStream);
      call.on("stream", (otherStream) => {
        otherVideoRef.current.srcObject = otherStream;
        otherVideoRef.current.onloadedmetadata = function (e) {
          otherVideoRef.current.play();
        };
        // otherVideoRef.current.play();
        setChangeVideoPosition(true);
      });
    });
  };

  const getVideosPostionsBasedOnStateValue = () => {
    return (
      <>
        <video ref={otherVideoRef} className="new-video-style" />
        <video ref={myVideoRef} className="new-video-style" />
      </>
    );
  };

  const onClickCloseVideoCall = () => {
    // const userMedia = getMyMedia();
    // userMedia({ video: true, audio: true }, (myStream) => {
    //   const localStream = myStream;
    //   localStream.getTracks()[0].stop();
    //   myVideoRef.current.pause();
    //   myVideoRef.current.src = "";

    //   //     myVideoRef.current.srcObject = myStream;
    //   //   myVideoRef.current.onloadedmetadata = function (e) {
    //   //     myVideoRef.current.stop();
    //   //   };
    // });

    const userMedia = getMyMedia();
    // userMedia({ video: true, audio: true }, (myStream) => {
    //   const localStream = myStream;
    //   const tracks = localStream.getTracks();
    //   tracks[0].stop();
    //   tracks[1].stop();
    // });

    localStream.getTracks()[0].stop();
    myVideoRef.current.pause();
    myVideoRef.current.src = "";
    // navigate("/");
    window.location.replace("https://sulthan-whatsapp-cba7a.web.app/");
  };

  const connectWithBothUserAndOtherVideoCalls = (userId, otherId) => {
    // startVideoCall();
    makeCall(otherId);
    setChangeVideoPosition(true);
  };

  return (
    <div className="video-call">
      <div className="video-call-body">
        <VideoCallTopSection
          connectWithBothUserAndOtherVideoCalls={
            connectWithBothUserAndOtherVideoCalls
          }
        />

        <div className="video-call-section">
          <video ref={otherVideoRef} className="new-video-style" />
          <video ref={myVideoRef} className="new-video-style" />
        </div>

        <div className="video-call-control-section">
          <button className="video-stop-button" onClick={onClickCloseVideoCall}>
            <MdVideocamOff size={25} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoCall;

// 62d004f547072ef3a950b5ff
// madhava
