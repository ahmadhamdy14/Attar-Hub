import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { ThemeContext } from "../../context/ThemeContext";
import { db, auth } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import hero from "../../assets/1.jpeg";
import hero2 from "../../assets/2.jpeg";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const { theme } = useContext(ThemeContext);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("يرجى إدخال رقم الهاتف");
      return;
    }

    setLoading(true);
    try {
      // 🔍 Look up email by phone number in Firestore
      const q = query(
        collection(db, "users"),
        where("phone", "==", phone.trim())
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        toast.error("this phone number is not registered in the system");
        return;
      }

      const email = snapshot.docs[0].data().email;

      // 📧 Send Firebase password reset email
      await sendPasswordResetEmail(auth, email);

      setSentEmail(email);
      setSent(true);
      toast.success("Password reset link has been sent successfully!");
    } catch (err) {
      console.error(err);
      toast.error("oops error please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-container">
      <div
        className="fp-left"
        style={{ backgroundImage: `url(${theme === "light" ? hero : hero2})` }}
      />

      <div className="fp-right">
        {!sent ? (
          <>
            <div className="fp-icon">🔐</div>
            <h2 className="fp-title">Forgot your password?</h2>
            <p className="fp-sub">
              Enter your phone number and we'll send a password reset link
              to your registered email address.
            </p>

            <form onSubmit={handleSubmit} className="fp-form">
              <div className="fp-input-box">
                <label>phone number</label>
                <div className="fp-input-wrap">
                  <FaPhone className="fp-icon-field" />
                  <input
                    type="tel"
                    placeholder="enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="fp-btn" disabled={loading}>
                {loading ? "sending..." : "send reset link"}
              </button>
            </form>

            <Link to="/login" className="fp-back">
              ← back to login
            </Link>
          </>
        ) : (
          <div className="fp-success">
            <FaCheckCircle className="fp-check-icon" />
            <h2>The reset link has been sent! 📬</h2>
            <p>
              The password reset link has been sent to:
            </p>
            <span className="fp-sent-email">{sentEmail}</span>
            <p className="fp-hint">
              Check your inbox or spam folder.
            </p>
            <Link to="/login" className="fp-btn" style={{ textAlign: "center", display: "block" }}>
              back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
