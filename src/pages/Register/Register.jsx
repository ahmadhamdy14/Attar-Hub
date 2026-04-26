import "./Register.css";
import hero from "../../assets/1.jpeg";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// 🔥 Firebase
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";



const Register = () => {
  const navigate = useNavigate();

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
      newErrors.firstName = value ? "" : "First name is required";

    if (name === "lastName")
      newErrors.lastName = value ? "" : "Last name is required";

    if (name === "email") {
      if (!value) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value))
        newErrors.email = "Invalid email format";
      else newErrors.email = "";
    }

    if (newErrors.general) {
      delete newErrors.general;
    }

    if (name === "phone")
      newErrors.phone = value ? "" : "Phone is required";

    if (name === "password") {
      if (!value) newErrors.password = "Password is required";
      else if (value.length < 8)
        newErrors.password = "Minimum 8 characters";
      else newErrors.password = "";
    }

    if (name === "confirmPassword") {
      if (!value)
        newErrors.confirmPassword = "Confirm password is required";
      else if (value !== updatedForm.password)
        newErrors.confirmPassword = "Passwords do not match";
      else newErrors.confirmPassword = "";
    }

    if (name === "gender")
      newErrors.gender = value ? "" : "Select gender";

    setErrors(newErrors);
  };

  const validate = () => {
    let newErrors = {};

    if (!form.firstName) newErrors.firstName = "Required";
    if (!form.lastName) newErrors.lastName = "Required";

    if (!form.email) newErrors.email = "Required";

    if (!form.phone) newErrors.phone = "Required";

    if (!form.password || form.password.length < 8)
      newErrors.password = "Min 8 characters";

    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords not match";

    if (!form.gender) newErrors.gender = "Select gender";

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
      toast.success("Registered Successfully 🎉");
      navigate("/login");

    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Try logging in! 👋");
        setErrors((prev) => ({ ...prev, general: "This email is already registered. Try logging in!" }));
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak. Please use a stronger password. 🔐");
        setErrors((prev) => ({ ...prev, general: "Password is too weak. Please use a stronger password." }));
      } else {
        toast.error("Registration failed. Please try again. 🚨");
        setErrors((prev) => ({ ...prev, general: "Registration failed. Please try again." }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">

      <div
        className="register-left"
        style={{ backgroundImage: `url(${hero})` }}
      />

      <div className="register-right">

        <h2>Create Account</h2>

        <p className="sub-text">
          Already have account? <Link to="/login">Login</Link>
        </p>

        {/* FIRST NAME */}
        <div className="input-box">
          <label>First Name</label>
          <div className="input-with-icon">
            <FaUser className="icon" />
            <input name="firstName" onChange={handleChange} />
          </div>
          <span className="error">{errors.firstName}</span>
        </div>

        {/* LAST NAME */}
        <div className="input-box">
          <label>Last Name</label>
          <div className="input-with-icon">
            <FaUser className="icon" />
            <input name="lastName" onChange={handleChange} />
          </div>
          <span className="error">{errors.lastName}</span>
        </div>

        {/* EMAIL */}
        <div className="input-box">
          <label>Email</label>
          <div className="input-with-icon">
            <FaEnvelope className="icon" />
            <input name="email" onChange={handleChange} />
          </div>
          <span className="error">{errors.email}</span>
        </div>

        {/* PHONE */}
        <div className="input-box">
          <label>Phone</label>
          <div className="input-with-icon">
            <FaPhone className="icon" />
            <input name="phone" onChange={handleChange} />
          </div>
          <span className="error">{errors.phone}</span>
        </div>

        {/* PASSWORD */}
        <div className="input-box">
          <label>Password</label>
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
          <label>Confirm Password</label>
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
          <label>Gender</label>

          <div className="gender-box">
            <label>
              <input type="radio" name="gender" value="male" onChange={handleChange} />
              Male
            </label>

            <label>
              <input type="radio" name="gender" value="female" onChange={handleChange} />
              Female
            </label>
          </div>

          <span className="error">{errors.gender}</span>
        </div>

        {/* BUTTON */}
        <button className="register-btn" onClick={handleSubmit}>
          {loading ? "Loading..." : "Register"}
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