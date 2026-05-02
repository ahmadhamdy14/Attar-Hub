import "./Register.css";
import hero from "../../assets/1.jpeg";
import hero2 from "../../assets/2.jpeg";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
// 🔥 Firebase
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";



const Register = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    let newErrors = { ...errors };

    if (name === "firstName")
      newErrors.firstName = value ? "" : "first name required";

    if (name === "lastName")
      newErrors.lastName = value ? "" : "last name required";

    if (name === "email") {
      if (!value) newErrors.email = "email required";
      else if (!/\S+@\S+\.\S+/.test(value))
        newErrors.email = "wrong email";
      else newErrors.email = "";
    }

    if (newErrors.general) {
      delete newErrors.general;
    }

    if (name === "phone")
      newErrors.phone = value ? "" : "phone number required";

    if (name === "password") {
      if (!value) newErrors.password = "password required";
      else if (value.length < 8)
        newErrors.password = "password less than 8 letters";
      else newErrors.password = "";
    }

    if (name === "confirmPassword") {
      if (!value)
        newErrors.confirmPassword = "password required";
      else if (value !== updatedForm.password)
        newErrors.confirmPassword = "passwords not equal";
      else newErrors.confirmPassword = "";
    }

    if (name === "gender")
      newErrors.gender = value ? "" : "gender required";

    setErrors(newErrors);
  };

  const validate = () => {
    let newErrors = {};

    if (!form.firstName) newErrors.firstName = "first name required";
    if (!form.lastName) newErrors.lastName = "last name required";

    if (!form.email) newErrors.email = "email required";

    if (!form.phone) newErrors.phone = "phone number required";

    if (!form.password || form.password.length < 8)
      newErrors.password = "password required";

    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "passwords not equal";

    if (!form.gender) newErrors.gender = "gender required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      // 🔐 Create Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        gender: form.gender,
        email: form.email,
        uid: user.uid,
        role: "user",
        createdAt: new Date(),
      });

      await signOut(auth);
      toast.success("created account successfully🎉");
      navigate("/login");

    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("this email is already registered . ");
        setErrors((prev) => ({ ...prev, general: "this email is already registered ." }));
      } else if (error.code === "auth/weak-password") {
        toast.error("password less than 8 letters");
        setErrors((prev) => ({ ...prev, general: "password less than 8 letters" }));
      } else {
        toast.error("failed to register. try again ");
        setErrors((prev) => ({ ...prev, general: "failed to register. try again" }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">

      <div
        className="register-left"
        style={{ backgroundImage: `url(${theme === "light" ? hero : hero2})` }}
      />

      <div className="register-right">

        <h2>create new account</h2>

        <p className="sub-text">
          already have an account? <Link to="/login" className="link">login</Link>
        </p>

        {/* FIRST NAME */}
        <div className="input-box">
          <label>first name</label>
          <div className="input-with-icon">
            <FaUser className="icon" />
            <input name="firstName" onChange={handleChange} />
          </div>
          <span className="error">{errors.firstName}</span>
        </div>

        {/* LAST NAME */}
        <div className="input-box">
          <label>last name</label>
          <div className="input-with-icon">
            <FaUser className="icon" />
            <input name="lastName" onChange={handleChange} />
          </div>
          <span className="error">{errors.lastName}</span>
        </div>

        {/* EMAIL */}
        <div className="input-box">
          <label>email</label>
          <div className="input-with-icon">
            <FaEnvelope className="icon" />
            <input name="email" onChange={handleChange} />
          </div>
          <span className="error">{errors.email}</span>
        </div>

        {/* PHONE */}
        <div className="input-box">
          <label>phone number</label>
          <div className="input-with-icon">
            <FaPhone className="icon" />
            <input name="phone" onChange={handleChange} />
          </div>
          <span className="error">{errors.phone}</span>
        </div>

        {/* PASSWORD */}
        <div className="input-box">
          <label>password</label>
          <div className="input-with-icon">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <span className="error">{errors.password}</span>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="input-box">
          <label>confirm password</label>
          <div className="input-with-icon">
            <FaLock className="icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              onChange={handleChange}
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <span className="error">{errors.confirmPassword}</span>
        </div>

        {/* GENDER */}
        <div className="input-box">
          <label>gender</label>

          <div className="gender-box">
            <label>
              <input type="radio" name="gender" value="male" onChange={handleChange} />
              male
            </label>

            <label>
              <input type="radio" name="gender" value="female" onChange={handleChange} />
              female
            </label>
          </div>

          <span className="error">{errors.gender}</span>
        </div>

        {/* BUTTON */}
        <button className="register-btn" onClick={handleSubmit}>
          {loading ? "loading..." : "create account"}
        </button>

        {errors.general && (
          <p className="error" style={{ textAlign: "center", marginTop: "10px", fontSize: "14px", fontWeight: "bold" }}>
            {errors.general}
          </p>
        )}

      </div>
    </div>
  );
};

export default Register;