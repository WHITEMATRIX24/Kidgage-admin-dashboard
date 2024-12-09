import React, { useState, useEffect } from "react";
import { FaChevronDown, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import "./AddCourseForm.css";

const EditCourseCategoryForm = () => {
  const [courses, setCourses] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [fileName, setFileName] = useState("No file chosen");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://kidgage-dashboar-newui.onrender.com/api/course-category/categories"
      );
      setCourses(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setFile(e.target.files[0]);
    } else {
      setFileName("No file chosen");
      setFile(null);
    }
  };

  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setEditMode(true);
  };

  const handleDelete = (banner) => {
    setBannerToDelete(banner);
    setShowConfirmPopup(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(
        `https://kidgage-dashboar-newui.onrender.com/api/course-category/delete/${bannerToDelete._id}`
      );
      setSelectedBanner(null);
      setEditMode(false);
      setShowConfirmPopup(false);
      setBannerToDelete(null);
      fetchCourses(); // Refresh the course list
      setIsLoading(false);
      alert("Succesfully deleted!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting course category:", error);
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmPopup(false);
    setBannerToDelete(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedBanner((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", selectedBanner.name);
    if (file) {
      formData.append("image", file);
    }

    try {
      await axios.put(
        `https://kidgage-dashboar-newui.onrender.com/api/course-category/update/${selectedBanner._id}`,
        formData
      );
      setEditMode(false);
      setSelectedBanner(null);
      setFileName("No file chosen");
      setFile(null);
      fetchCourses(); // Refresh the course list
      setIsLoading(false);
      alert("Succesfully edited!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating course category:", error);
      setIsLoading(false);
    }
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="add-course-form-container">
      <div className="add-course-form-header" onClick={toggleFormVisibility}>
        <h2>Edit/Remove Course Category</h2>
        <FaChevronDown className={`dropdown-icon ${showForm ? "open" : ""}`} />
      </div>
      {showForm && (
        <>
          {loading ? (
            <div
              style={{ marginTop: "10%", marginBottom: "10%" }}
              className="loader-container"
            >
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : (
            <div className="add-course-form">
              {!editMode ? (
                <div className="banner-list">
                  {courses.map((banner) => (
                    <div className="banner-box" key={banner._id}>
                      <img
                        src={`data:image/jpeg;base64,${banner.image}`}
                        alt={banner.name}
                      />
                      <div className="banner-info">
                        <h3>{banner.name}</h3>
                        <div className="button-container">
                          <button
                            className="edit-banner-button"
                            onClick={() => handleEdit(banner)}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="delete-banner-button"
                            onClick={() => handleDelete(banner)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div
                    style={{ gap: "50%" }}
                    className="form-group add-course-label-group"
                  >
                    <label htmlFor="name">Title</label>
                    <label htmlFor="file-upload">
                      Image
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
                      placeholder="Enter Banner Title"
                      value={selectedBanner.name}
                      onChange={handleChange}
                    />
                    <input
                      type="file"
                      id="file-upload"
                      name="file-upload"
                      onChange={handleFileChange}
                    />
                  </div>
                  <button type="submit">Submit</button>
                </form>
              )}
            </div>
          )}
        </>
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
        <>
          <div className="confirm-popup-overlay"></div>
          <div className="confirm-popup">
            <p>Are you sure you want to delete this banner?</p>
            <button onClick={handleConfirmDelete}>Confirm Delete</button>
            <button onClick={handleCancelDelete}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditCourseCategoryForm;
