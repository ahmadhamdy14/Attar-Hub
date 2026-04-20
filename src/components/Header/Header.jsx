import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
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

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    clearCart();
    navigate("/login");
  };
  return (
    <header className="header">
      <nav className="nav">
        {/* LOGO */}
        <p className="logo">attarHub</p>
        {/* HAMBURGER */}
        <div style={{ display: "flex", alignItems: "center"  , position: "relative",   gap: "15px" }}>
          {user && (
            <>
          <Link to="/cart" className="cart-link" onClick={() => setOpen(false)}>
                🛒
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
          </Link>
            </>
          )}
         
          <div className="hamburger" onClick={() => setOpen(!open)}>
            ☰
          </div>
      </div>
        {/* RIGHT SIDE */}
        <div className={`nav-right ${open ? "open" : ""}`}>
          <button onClick={toggleTheme} className="theme-btn">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <Link to="/products" onClick={() => setOpen(false)}>
            Products
          </Link>
          {!user && (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          )}
          {user && (
            <>
              {userData?.role === "admin" && (
                <Link to="/admin" onClick={() => setOpen(false)}>
                  Admin
                </Link>
              )}
              <span className="user-name">
                👋 Hi {userData?.firstName || "User"}
              </span>

              <button onClick={handleLogout} className="theme-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
export default Header;