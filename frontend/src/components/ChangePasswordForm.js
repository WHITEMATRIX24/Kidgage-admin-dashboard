import React, { useState } from "react";
import axios from "axios";
import "./dashboard.css";

const ChangePasswordForm = ({ adminId }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://kidgage-dashboar-newui.onrender.com/api/admin/change-password/${adminId}`,
        {
          currentPassword,
          newPassword,
        }
      );
      setSuccessMessage(response.data.message);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error changing password"
      );
      setSuccessMessage("");
    }
  };

  return (
    <form className="change-password-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Current Password</label>
        <input
          placeholder="current password"
          type="password"
          className="form-input"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">New Password</label>
        <input
          placeholder="new password"
          type="password"
          className="form-input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="submit-button">
        Change Password
      </button>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </form>
  );
};

export default ChangePasswordForm;
