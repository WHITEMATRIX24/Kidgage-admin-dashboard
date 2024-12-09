import React, { useState } from "react";
import axios from "axios";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import "./AdminSignin.css";
import logo from "./assets/images/logo.png";

const AdminSignIn = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // For showing/hiding loader
  const [progress, setProgress] = useState(0); // To track loader progress
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // Start loader
    setProgress(10); // Set progress to 10% on form submit

    try {
      const response = await axios.post(
        "https://kidgage-dashboar-newui.onrender.com/api/admin/signin",
        formData
      );
      console.log("Sign-in successful:", response.data);
      const { _id, role, fullName, name, userId } = response.data.admin;
      setSuccess("Sign-in successful");
      setFormData({
        name: "",
        password: "",
      });
      // Store id and role in sessionStorage
      sessionStorage.setItem("adminId", _id);
      sessionStorage.setItem("adminRole", role);
      sessionStorage.setItem("Name", fullName);
      sessionStorage.setItem("email", name);
      sessionStorage.setItem("userid", userId);

      // Set progress to 100% just before navigating
      setProgress(100);

      // Delay navigation for a short time to let the loader reach 100%
      setTimeout(() => {
        setLoading(false); // Stop loader
        navigate("/dashboard", {
          state: { _id, role, fullName, name, userId },
        });
      }, 500); // Delay navigation by 500ms to allow the loader to complete
    } catch (error) {
      console.error(
        "Sign-in error:",
        error.response ? error.response.data : error.message
      );
      setError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
      setLoading(false); // Stop loader if there's an error
    }
  };

  return (
    <div className="asign-form-body">
      <div className="asignup-form">
        <div className="alogo-container">
          <img
            src={logo}
            alt="KIDGAGE"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
        </div>
        <form className="aform-sign-in" onSubmit={handleSubmit}>
          <h2>Sign-In</h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button primary type="submit">
            Sign In
          </button>

          {/* Loader */}
          {loading && (
            <div className="loader">
              <p>Signing in... {progress}%</p>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminSignIn;
