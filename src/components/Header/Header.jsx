import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import "./Header.css";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, userData } = useContext(AuthContext);
  const { cartCount, clearCart } = useContext(CartContext);
  const { favoritesCount } = useContext(FavoritesContext);

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
        <div className="logo-container">
          <Link to="/">
            <img src="/favicon2.png" alt="Logo" className="logo-icon" />
          </Link>
          <Link to="/" className="logo" style={{ fontSize: "20px", fontWeight: "bold" }}>Attar Hub</Link>
        </div>
        {/* HAMBURGER */}
        <div style={{ display: "flex", alignItems: "center", position: "relative", gap: "15px" }}>
          {user && (
            <>
              <Link to="/favorites" className="cart-link" onClick={() => setOpen(false)}>
                ❤️
                {favoritesCount > 0 && (
                  <span className="cart-badge">{favoritesCount}</span>
                )}
              </Link>
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
            products
          </Link>
          {!user && (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                login
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                register
              </Link>
            </>
          )}
          {user && (
            <>
              <Link to="/my-orders" onClick={() => setOpen(false)}>
                my orders 📦
              </Link>
              {userData?.role === "admin" && (
                <>
                  <Link to="/admin" onClick={() => setOpen(false)}>
                    admin
                  </Link>
                  <Link to="/admin/orders" onClick={() => setOpen(false)}>
                    orders
                  </Link>
                </>
              )}
              <span className="user-name">
                👋 Hi {userData?.firstName || "User"}
              </span>

              <button onClick={handleLogout} className="theme-btn">
                logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
export default Header;