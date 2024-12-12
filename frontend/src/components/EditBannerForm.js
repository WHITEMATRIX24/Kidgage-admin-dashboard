import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronDown, FaEdit, FaTrash } from "react-icons/fa";
import "./EditBannerForm.css";

const EditBannerForm = () => {
  const [showForm, setShowForm] = useState(true);
  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBannerId, setDeletingBannerId] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/banners");
      setBanners(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setEditingBanner((prev) => ({ ...prev, image: e.target.files[0] }));
    } else {
      setFileName("No file chosen");
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
  };

  const handleDelete = (bannerId) => {
    setDeletingBannerId(bannerId);
    setShowDeleteModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingBanner((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editingBanner.title);
      formData.append("bookingLink", editingBanner.bookingLink);
      if (fileName !== "No file chosen") {
        formData.append("image", editingBanner.image);
      }

      await axios.put(
        `http://localhost:5001/api/banners/${editingBanner._id}`,
        formData
      );
      fetchBanners();
      setEditingBanner(null);
      setFileName("No file chosen");
      setIsLoading(false);
      alert("Succesfully edited!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating banner:", error);
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(
        `http://localhost:5001/api/banners/${deletingBannerId}`
      );
      fetchBanners();
      setShowDeleteModal(false);
      setDeletingBannerId(null);
      setIsLoading(false);
      alert("Succesfully deleted!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting banner:", error);
      setIsLoading(false);
    }
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="add-course-form-container">
      <div className="add-course-form-header" onClick={toggleFormVisibility}>
        <h2>Edit/Remove Banner</h2>
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
              {editingBanner ? (
                <form onSubmit={handleSubmit}>
                  <div
                    style={{ gap: "50%" }}
                    className="form-group add-course-label-group"
                  >
                    <label htmlFor="title">Title</label>
                    <label htmlFor="file-upload">
                      Image
                      <span style={{ fontSize: ".8rem", color: "grey" }}>
                        [ size: 1045 X 275 ]
                      </span>
                    </label>
                  </div>
                  <div className="form-group add-course-group">
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={editingBanner.title}
                      onChange={handleChange}
                      placeholder="Enter Banner Title"
                    />
                    <input
                      type="file"
                      id="file-upload"
                      name="file-upload"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bookingLink">Booking Link</label>
                    <input
                      type="text"
                      id="bookingLink"
                      name="bookingLink"
                      value={editingBanner.bookingLink}
                      onChange={handleChange}
                      placeholder="Enter Booking Link"
                    />
                  </div>
                  <button type="submit">Submit</button>
                </form>
              ) : (
                <div className="poster-list">
                  {banners.map((banner) => (
                    <div key={banner._id} className="poster-box">
                      <img src={banner.imageUrl} alt={banner.title} />
                      <div className="poster-info">
                        <div className="poster-info-text">
                          <h3>{banner.title}</h3>
                          <p>{banner.bookingLink}</p>
                        </div>
                        <div className="button-container">
                          <button
                            className="edit-banner-button"
                            onClick={() => handleEdit(banner)}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="delete-banner-button"
                            onClick={() => handleDelete(banner._id)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
      {showDeleteModal && (
        <div className="confirm-popup">
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete this banner?</p>
          <button onClick={confirmDelete}>Confirm</button>
          <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default EditBannerForm;
