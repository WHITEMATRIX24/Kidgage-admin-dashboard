import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import "./AddBannerForm.css";

function AddAdvertisement() {
  const initialAdvertisementState = {
    title: "",
    desktopImage: null, // File object for the desktop image
    mobileImage: null, // File object for the mobile image
  };
  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  const [advertisement, setAdvertisement] = useState(initialAdvertisementState);
  const [showForm, setShowForm] = useState(true);
  const [desktopFileName, setDesktopFileName] = useState("No file chosen");
  const [mobileFileName, setMobileFileName] = useState("No file chosen");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e, type) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setAdvertisement((prev) => ({ ...prev, [type]: file })); // Set file object
      type === "desktopImage"
        ? setDesktopFileName(file.name)
        : setMobileFileName(file.name);
    } else {
      type === "desktopImage"
        ? setDesktopFileName("No file chosen")
        : setMobileFileName("No file chosen");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdvertisement((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Define the space constant
    const space = 1; // Set the constant value for space

    const formData = new FormData();
    formData.append("title", advertisement.title);
    formData.append("desktopImage", advertisement.desktopImage); // Append the desktop file object
    formData.append("mobileImage", advertisement.mobileImage); // Append the mobile file object
    formData.append("space", space); // Append the space constant

    try {
      const response = await axios.post(
        "https://kidgage-dashboar-newui.onrender.com/api/advertisement/addadvertisement",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
          },
        }
      );
      console.log("Advertisement added successfully", response.data);
      setAdvertisement(initialAdvertisementState);
      setDesktopFileName("No file chosen");
      setMobileFileName("No file chosen");
      setSuccess("Advertisement added successfully!");
      setError("");
      setIsLoading(false); // Stop loading after fetch
      window.location.reload();
    } catch (error) {
      console.error("Error adding Advertisement", error);
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
        <h2>Add Advertisements</h2> <p>Space 1</p>
        <FaChevronDown className={`dropdown-icon ${showForm ? "open" : ""}`} />
      </div>
      {showForm && (
        <form className="add-course-form" onSubmit={handleSubmit}>
          <div className="side-by-side">
            <div className="form-group">
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter Advertisement Title"
                value={advertisement.title}
                onChange={handleChange}
              />
            </div>
            <div className="form-group file-upload-container">
              <label htmlFor="desktop-file-upload">
                Desktop View Image
                <br />
                <span style={{ fontSize: ".8rem", color: "grey" }}>
                  [ size: 342 X 634 ]
                </span>
              </label>

              <input
                type="file"
                id="desktop-file-upload"
                onChange={(e) => handleFileChange(e, "desktopImage")}
              />
            </div>
          </div>
          <div className="form-group file-upload-container">
            <label htmlFor="mobile-file-upload">
              Mobile View Image
              <br />
              <span style={{ fontSize: ".8rem", color: "grey" }}>
                [ size: 634 X 342 ]
              </span>
            </label>
            <input
              type="file"
              id="mobile-file-upload"
              onChange={(e) => handleFileChange(e, "mobileImage")}
            />
          </div>
          <button type="submit" className="add-time-slot-btn">
            Add Advertisement
          </button>
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
}

export default AddAdvertisement;
