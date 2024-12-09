import React, { useState } from "react";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa";
import "./AddBannerForm.css";

function AddCourseCategoryForm() {
  const [course, setCourse] = useState({
    name: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false); // Manage loading state
  const [showForm, setShowForm] = useState(true);
  const [fileName, setFileName] = useState("No file chosen");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      setCourse((prev) => ({ ...prev, image: file }));
    } else {
      setFileName("No file chosen");
      setCourse((prev) => ({ ...prev, image: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!course.image) {
      alert("Image is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", course.name);
    formData.append("image", course.image);

    try {
      const response = await axios.post(
        "https://kidgage-dashboar-newui.onrender.com/api/course-category/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Course category added:", response.data);

      // Display success message
      setSuccessMessage("Added new course category");

      // Reset form
      setCourse({ name: "", image: null });
      setFileName("No file chosen");
      setIsLoading(false); // Stop loading after fetch
    } catch (error) {
      console.error("Error adding course category:", error);
      setIsLoading(false); // Stop loading after fetch
      window.location.reload();
    }
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="add-course-form-container">
      <div className="add-course-form-header" onClick={toggleFormVisibility}>
        <h2>Add New Course Category</h2>
        <FaChevronDown className={`dropdown-icon ${showForm ? "open" : ""}`} />
      </div>
      {showForm && (
        <form className="add-course-form" onSubmit={handleSubmit}>
          <div className="form-group add-course-label-group">
            <label htmlFor="name">Course Category</label>
            <label htmlFor="file-upload">
              Image{" "}
              <span style={{ fontSize: ".8rem", color: "grey" }}>
                [ size: 540 X 360 ]
              </span>
            </label>
          </div>
          <div className="form-group add-course-group">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter Course Category"
              value={course.name}
              onChange={handleChange}
            />
            <input
              type="file"
              id="file-upload"
              name="image"
              onChange={handleFileChange}
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

export default AddCourseCategoryForm;
