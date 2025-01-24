import React, { useState } from "react";
import axios from "axios";
import "./AddCourseForm.css"; // Reuse the same CSS file for styling
import { FaChevronDown } from "react-icons/fa";

const AddParentForm = ({ handleNavigation }) => {
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Manage loading state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5001/api/personal/signup",
        formData
      );
      setSuccess("Parent added successfully!");
      setFormData({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        firstName: "",
        lastName: "",
        confirmPassword: "",
      });
      setIsLoading(false); // Stop loading after fetch
      window.location.reload();
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
      setSuccess("");
      setIsLoading(false); // Stop loading after fetch
    }
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="add-course-form-container">
      <div className="add-course-form-header" onClick={toggleFormVisibility}>
        <h2>Add Parent</h2>
        <FaChevronDown className={`dropdown-icon ${showForm ? "open" : ""}`} />
      </div>
      {showForm && (
        <form className="add-course-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail ID"
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone number"
            required
          />
          <div className="side-by-side">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              required
            />
          </div>
          <div className="side-by-side">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Default Password"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </div>
          <button type="submit">Create Parent's Account</button>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form>
      )}
      {isLoading && (
        <div
          style={{ display: "flex", flexDirection: "column" }}
          className="confirmation-overlay"
        >
          <p style={{ zIndex: "1000", color: "white" }}>
            Please wait till process is completed
          </p>
          <div className="su-loader"></div>
        </div>
      )}
    </div>
  );
};

export default AddParentForm;
