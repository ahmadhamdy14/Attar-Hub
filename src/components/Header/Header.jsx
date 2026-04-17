import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import "./Header.css";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, userData } = useContext(AuthContext);
  const { cartCount, clearCart } = useContext(CartContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);

    clearCart(); // 🧨 أهم سطر

    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo">attarHub</div>

      <nav className="nav">
        <Link to="/products">Products</Link>

        

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            {userData?.role === "admin" && (
              <Link to="/admin">Admin</Link>
            )}
            {/* 🛒 CART */}
            <Link to="/cart" className="cart-link">
              🛒
              {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
            <span style={{ marginLeft: "15px" }}>
              👋 Hi {userData?.firstName || "User"}
            </span>

            <button onClick={handleLogout} className="theme-btn">
              Logout
            </button>
          </>
        )}

        <button onClick={toggleTheme} className="theme-btn">
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </nav>
    </header>
  );
};

export default Header;