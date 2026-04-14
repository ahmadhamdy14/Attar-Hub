import "./Login.css";
import hero from "../../assets/1.jpeg";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div
        className="login-left"
        style={{ backgroundImage: `url(${hero})` }}
      />

      {/* RIGHT SIDE */}
      <div className="login-right">

        <h2>Sign in</h2>

        <p className="sub-text">
          If you don’t have an account register <br />
          You can  <Link to="/register" className="link"> Register here !</Link>
        </p>

        {/* EMAIL */}
        <div className="input-box">
          <label>Email</label>

          <div className="input-with-icon">
            <FaEnvelope className="icon" />
            <input type="email" placeholder="Enter your email" />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="input-box">
          <label>Password</label>

          <div className="input-with-icon">
            <FaLock className="icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* OPTIONS */}
        <div className="options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot Password?</a>
        </div>

        <button className="login-btn">Login</button>

        <p className="or">or continue with</p>

        <div className="socials">
          <button>f</button>
          <button></button>
          <button>G</button>
        </div>

      </div>
    </div>
  );
};

export default Login;