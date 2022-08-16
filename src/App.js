import { Route, Routes } from "react-router-dom";
// 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

import ChatBox from "./components/ChatBox";
import Home from "./components/Home";
import Login from "./components/Login";
import VideoCall from "./components/VideoCall";
import ProtectedRoutes from "./components/ProtectedRoutes";

import "./App.css";

const App = () => (
  <div className="app">
    <Routes>
      <Route exact path="/login" element={<Login />} />

      <Route
        exact
        path="/video-call"
        element={<ProtectedRoutes component={<VideoCall />} />}
      />

      <Route
        exact
        path="/"
        element={<ProtectedRoutes component={<Home />} />}
      />

      <Route
        exact
        path="/rooms/:roomId/messages"
        element={<ProtectedRoutes component={<ChatBox />} />}
      />
    </Routes>
  </div>
);

export default App;
