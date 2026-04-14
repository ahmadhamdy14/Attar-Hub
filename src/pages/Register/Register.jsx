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
import { Link } from "react-router-dom";

const Register = () => {
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

  // =========================
  // HANDLE CHANGE (LIVE VALIDATION)
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    let newErrors = { ...errors };

    // FIRST NAME
    if (name === "firstName") {
      newErrors.firstName = value ? "" : "First name is required";
    }

    // LAST NAME
    if (name === "lastName") {
      newErrors.lastName = value ? "" : "Last name is required";
    }

    // EMAIL
    if (name === "email") {
      if (!value) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value))
        newErrors.email = "Invalid email format";
      else newErrors.email = "";
    }

    // PHONE
    if (name === "phone") {
      newErrors.phone = value ? "" : "Phone is required";
    }

    // PASSWORD (min 8 chars)
    if (name === "password") {
      if (!value) newErrors.password = "Password is required";
      else if (value.length < 8)
        newErrors.password = "Password must be at least 8 characters";
      else newErrors.password = "";
    }

    // CONFIRM PASSWORD (LIVE FIX 🔥)
    if (name === "confirmPassword") {
      if (!value) newErrors.confirmPassword = "Confirm password is required";
      else if (value !== updatedForm.password)
        newErrors.confirmPassword = "Passwords do not match";
      else newErrors.confirmPassword = "";
    }

    // GENDER
    if (name === "gender") {
      newErrors.gender = value ? "" : "Please select gender";
    }

    setErrors(newErrors);
  };

  // =========================
  // VALIDATE ON SUBMIT
  // =========================
  const validate = () => {
    let newErrors = {};

    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.phone) newErrors.phone = "Phone is required";

    if (!form.password)
      newErrors.password = "Password is required";
    else if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!form.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords do not match";

    if (!form.gender) newErrors.gender = "Please select gender";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = () => {
    if (validate()) {
      console.log("Form Data:", form);
      alert("Registered Successfully 🎉");
    }
  };

  return (
    <div className="register-container">

      {/* LEFT */}
      <div
        className="register-left"
        style={{ backgroundImage: `url(${hero})` }}
      />

      {/* RIGHT */}
      <div className="register-right">

        <h2>Create Account</h2>

        <p className="sub-text">
          Already have an account? <Link to="/login">Login here</Link>
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

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
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

            <span
              className="eye-icon"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <span className="error">{errors.confirmPassword}</span>
        </div>

        {/* GENDER */}
        <div className="input-box">
          <label>Gender</label>

          <div className="gender-box">
            <label className="gender-option">
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={handleChange}
              />
              Male
            </label>

            <label className="gender-option">
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={handleChange}
              />
              Female
            </label>
          </div>

          <span className="error">{errors.gender}</span>
        </div>

        {/* BUTTON */}
        <button className="register-btn" onClick={handleSubmit}>
          Register
        </button>

      </div>
    </div>
  );
};

export default Register;