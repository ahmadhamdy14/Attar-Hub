import "./Login.css";
import hero from "../../assets/1.jpeg";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// 🔥 Firebase
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // =========================
  // VALIDATION
  // =========================
  const validate = () => {
    if (!form.email || !form.password) {
      setError("All fields are required");
      return false;
    }
    return true;
  };

  // =========================
  // LOGIN (🔥 FIREBASE)
  // =========================
  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      toast.success("Login Success 🎉");
      // 🔥 redirect
      navigate("/");

    } catch (err) {
      if (err.code === "auth/invalid-credential") {
      toast.error("Invalid email or password");      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

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
          You can{" "}
          <Link to="/register" className="link">
            Register here !
          </Link>
        </p>

        {/* EMAIL */}
        <div className="input-box">
          <label>Email</label>
          <div className="input-with-icon">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="input-box">
          <label>Password</label>
          <div className="input-with-icon">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* ERROR */}
        {error && <p className="error">{error}</p>}

        {/* OPTIONS */}
        <div className="options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot Password?</a>
        </div>
        {/* BUTTON */}
        <button className="login-btn" onClick={handleLogin}>
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;