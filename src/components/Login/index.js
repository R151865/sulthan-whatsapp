import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, Navigate } from "react-router-dom";

import "./index.css";

function Login() {
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const [showSignupErrorMsg, setShowSignupErrorMsg] = useState(false);
  const [signupError, setSignupError] = useState("");

  const [showLoginError, setShowLoginError] = useState(false);
  const [loginError, setLoginError] = useState("");

  const onFormSuccess = (jwtToken, userId, userName) => {
    Cookies.set("jwtToken", jwtToken, { expires: 10 });
    Cookies.set("userId", userId, { expires: 10 });
    Cookies.set("userName", userName, { expires: 10 });
    navigate("/");
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const userDetails = {
      username,
      password,
    };

    const url = "https://whatsapp-backend-sb.herokuapp.com/login";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok === true) {
      setShowLoginError(false);
      setLoginError("");
      onFormSuccess(data.jwtToken, data.userId, data.userName);
    } else {
      setShowLoginError(true);
      setLoginError(data.message);
    }
  };

  const onSubmitSignupForm = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      username: inputUsername,
      password: inputPassword,
    };

    const url = "https://whatsapp-backend-sb.herokuapp.com/users/new";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    };
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok === true) {
      setShowLogin(true);
      setShowSignupErrorMsg(false);
      setSignupError("");
    } else {
      setShowSignupErrorMsg(true);
      setSignupError(data.message);
    }
  };

  const renderLoginForm = () => (
    <form className="form__login">
      <img
        alt="whatsapp-logo"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/479px-WhatsApp.svg.png"
      />
      <div>
        <label htmlFor="inputId">USERNAME</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="inputId"
          type="input"
          placeholder="Username"
        />
      </div>
      <div>
        <label htmlFor="password">PASSWORD</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          type="password"
          placeholder="Password"
        />
      </div>
      <button
        type="submit"
        onClick={onSubmitForm}
        className="form__loginButton"
      >
        LOGIN
      </button>
      {showLoginError && <p className="form__LoginErrorMsg">{loginError}</p>}

      <p onClick={() => setShowLogin(false)} className="form__signupButton">
        Sign up
      </p>
    </form>
  );

  const renderSignUpForm = () => (
    <form onSubmit={onSubmitSignupForm} className="signup__form">
      <div>
        <label htmlFor="signUpName">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="signUpName"
          type="text"
          placeholder="Enter name"
        />
      </div>

      <div>
        <label htmlFor="signupUsername">Username</label>
        <input
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
          id="signupUsername"
          type="text"
          placeholder="Enter username"
        />
      </div>

      <div>
        <label htmlFor="signupPassword">Password</label>
        <input
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          id="signupPassword"
          type="text"
          placeholder="Enter password"
        />
      </div>

      <button className="signup__formSubmitButton" type="Submit">
        Submit
      </button>
      {showSignupErrorMsg && (
        <p className="signup__errorMessage">{signupError}</p>
      )}

      <p
        onClick={() => setShowLogin(true)}
        className="signup__formSignInButton"
      >
        Sign in
      </p>
    </form>
  );

  const jwtToken = Cookies.get("jwtToken");
  if (jwtToken !== undefined) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login">
      {showLogin ? renderLoginForm() : renderSignUpForm()}
    </div>
  );
}

export default Login;
