import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddCourseForm.css"; // Reuse the same CSS file for styling
import { FaChevronDown, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const EditParentForm = () => {
  const [showForm, setShowForm] = useState(true);
  const [query, setQuery] = useState("");
  const [parentData, setParentData] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchError, setSearchError] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Edit mode state
  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "https://kidgage-dashboar-newui.onrender.com/api/personal/search",
        {
          params: { query },
        }
      );
      if (response.data) {
        setParentData(response.data);
        setFormData({
          username: response.data.username,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        });
        setError("");
        setSearchError("");
        setIsEditMode(false); // Reset edit mode
      } else {
        setSearchError("Parent not found.");
        setParentData(null);
      }
    } catch (error) {
      console.error("Error searching parent:", error);
      setParentData(null);
      setSearchError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
    }
  };
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 5000); // Hide success message after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [success]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (isEditMode) {
      try {
        const response = await axios.put(
          `https://kidgage-dashboar-newui.onrender.com/api/personal/parent/${parentData._id}`,
          formData
        );
        setSuccess("Parent updated successfully!");
        setError("");
        setIsEditMode(false); // Exit edit mode after updating
        setIsLoading(false);
        alert("Succesfully edited!");
        window.location.reload();
      } catch (error) {
        console.error("Error updating parent:", error);
        setError(
          error.response
            ? error.response.data.message
            : "An error occurred. Please try again later."
        );
        setSuccess("");
        setIsLoading(false);
      }
    }
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleDelete = () => {
    setShowConfirmPopup(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(
        `https://kidgage-dashboar-newui.onrender.com/api/personal/parent/${parentData._id}`
      );
      setParentData(null);
      setFormData({
        username: "",
        email: "",
        phoneNumber: "",
        firstName: "",
        lastName: "",
      });
      setShowConfirmPopup(false);
      setError("");
      alert("Parent deleted successfully!");
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting parent:", error);
      setError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
      setSuccess("");
      setShowConfirmPopup(false);
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmPopup(false);
  };

  return (
    <div className="add-course-form-container">
      <div className="add-course-form-header" onClick={toggleFormVisibility}>
        <h2>Edit/Remove a Parent</h2>
        <FaChevronDown className={`dropdown-icon ${showForm ? "open" : ""}`} />
      </div>
      {showForm && (
        <div className="add-course-form">
          {!isEditMode && (
            <div className="form-group search-provider-group">
              <label htmlFor="query">Search Parent</label>
              <input
                type="text"
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by email or phone..."
              />
              <button
                type="button"
                className="search-provider-button"
                onClick={handleSearch}
              >
                <FaSearch />
              </button>
            </div>
          )}
          {searchError && <p className="error-message">{searchError}</p>}
          {parentData && (
            <form className="add-course-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
                disabled={!isEditMode} // Disable if not in edit mode
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-mail ID"
                required
                disabled={!isEditMode} // Disable if not in edit mode
              />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone number"
                required
                disabled={!isEditMode} // Disable if not in edit mode
              />
              <div className="side-by-side">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                  disabled={!isEditMode} // Disable if not in edit mode
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                  disabled={!isEditMode} // Disable if not in edit mode
                />
              </div>
              <div className="button-container">
                {!isEditMode ? (
                  <>
                    <></>
                    <button type="button" onClick={handleEdit}>
                      <FaEdit /> Edit
                    </button>
                    <button
                      type="button"
                      className="delete-course-button"
                      onClick={handleDelete}
                    >
                      <FaTrash /> Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button type="submit">Save</button>
                  </>
                )}
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
            </form>
          )}
        </div>
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

      {showConfirmPopup && (
        <div className="confirm-popup">
          <div className="confirm-popup-content">
            <p>Are you sure you want to delete this parent?</p>
            <button onClick={handleConfirmDelete}>Yes</button>
            <button onClick={handleCancelDelete}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditParentForm;
