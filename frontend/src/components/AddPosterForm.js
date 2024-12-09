import React, { useState } from "react";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa";
import "./AddCourseForm.css";

function AddPosterForm() {
  const [course, setCourse] = useState({
    name: "",
    description: "",
    location: "",
    link: "",
    startDate: "",
    endDate: "",
  });

  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Manage loading state
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [characterCount, setCharacterCount] = useState(0); // New state for character count

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName("No file chosen");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));

    if (name === "description") {
      setCharacterCount(value.length); // Update character count for description
    } else if (name === "name") {
      validateName(value); // Validate name on change
    }
  };

  const validateName = (name) => {
    let isValid = true;
    let errors = {};
    if (name.length < 10 || name.length > 20) {
      isValid = false;
      errors.name = "Poster title must be between 10 and 20 characters";
    }
    setErrors((prevErrors) => ({ ...prevErrors, ...errors }));
    return isValid;
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (course.description.length < 400 || course.description.length > 500) {
      isValid = false;
      errors.description = "Description must be between 400 and 500 characters";
    }

    if (!file) {
      isValid = false;
      errors.file = "Image is required";
    }

    const isNameValid = validateName(course.name); // Validate name
    if (!isNameValid) {
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", course.name);
    formData.append("description", course.description);
    formData.append("location", course.location);
    formData.append("link", course.link);
    formData.append("startDate", course.startDate);
    formData.append("endDate", course.endDate);
    formData.append("image", file);

    try {
      const response = await axios.post(
        "https://kidgage-dashboar-newui.onrender.com/api/posters/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Poster added:", response.data);

      setSuccessMessage("Poster added successfully");
      setCourse({
        name: "",
        description: "",
        location: "",
        link: "",
        startDate: "",
        endDate: "",
      });
      setFile(null);
      setFileName("No file chosen");
      setErrors({});
      setCharacterCount(0); // Reset character count
      setIsLoading(false); // Stop loading after fetch
      window.location.reload();
    } catch (error) {
      console.error("Error adding poster:", error);
      setIsLoading(false); // Stop loading after fetch
    }
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="add-course-form-container">
      <div className="add-course-form-header" onClick={toggleFormVisibility}>
        <h2>Add Poster</h2>
        <FaChevronDown className={`dropdown-icon ${showForm ? "open" : ""}`} />
      </div>
      {showForm && (
        <form className="add-course-form" onSubmit={handleSubmit}>
          <div className="form-group add-upload-label-group">
            <label htmlFor="name">Title</label>
            <label htmlFor="file-upload">
              Image
              <span style={{ fontSize: ".8rem", color: "grey" }}>
                [ size: 1080 X 1080 ]
              </span>
            </label>
          </div>
          <div className="form-group add-course-group">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter Poster Title"
              value={course.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
            <input
              type="file"
              id="file-upload"
              name="image"
              onChange={handleFileChange}
            />
            {errors.file && <p className="error-message">{errors.file}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter Poster Description"
              value={course.description}
              onChange={handleChange}
            />
            {errors.description && (
              <p className="error-message">{errors.description}</p>
            )}
            <p className="character-count">Characters: {characterCount}</p>{" "}
            {/* Display character count */}
          </div>
          <div className="form-group">
            <label htmlFor="link">Link to Register</label>
            <input
              type="text"
              id="link"
              name="link"
              placeholder="Enter link to register"
              value={course.link}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Enter Event Location"
              value={course.location}
              onChange={handleChange}
            />
          </div>
          <div className="form-group add-course-label-group">
            <label htmlFor="startDate">Start Date</label>
            <label htmlFor="endDate">End Date</label>
          </div>
          <div className="form-group add-course-group">
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={course.startDate}
              onChange={handleChange}
            />
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={course.endDate}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Submit</button>
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
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

export default AddPosterForm;
