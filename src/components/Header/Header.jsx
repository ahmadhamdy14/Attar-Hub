import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import "./Header.css";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, userData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">attarHub</div>

      <nav className="nav">

        {/* 🌐 Always visible */}
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>

        {/* 👤 Guest (not logged in) */}
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {/* 🔐 Logged in users */}
        {user && (
          <>
            {/* 👑 Admin only */}
            {userData?.role === "admin" && (
              <Link to="/admin">Admin</Link>
            )}

            <span style={{ marginLeft: "15px" }}>
              👋 Hi {userData?.firstName || "User"}
            </span>

            <button onClick={handleLogout} className="theme-btn">
              Logout
            </button>
          </>
        )}

        {/* 🌙 Theme button */}
        <button onClick={toggleTheme} className="theme-btn">
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

      </nav>
    </header>
  );
};

export default Header;