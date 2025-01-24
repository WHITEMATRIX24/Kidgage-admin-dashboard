import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronDown, FaEdit, FaTrash } from "react-icons/fa";
import "./EditBannerForm.css";

const EditAdvertisementForm = () => {
  const [showForm, setShowForm] = useState(true);
  const [advertisements, setAdvertisements] = useState([]);
  const [editingAdvertisement, setEditingAdvertisement] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAdvertisementId, setDeletingAdvertisementId] = useState(null);
  const [desktopFileName, setDesktopFileName] = useState("No file chosen");
  const [mobileFileName, setMobileFileName] = useState("No file chosen");
  const [loading, setLoading] = useState(false);
  const [space, setSpace] = useState(null); // Default space value
  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5001/api/advertisement"
      );
      setAdvertisements(response.data);
      if (response.data.length > 0) {
        setSpace(response.data[0].space); // Set space based on the fetched data
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      setLoading(false);
    }
  };

  const handleFileChange = (e, type) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setEditingAdvertisement((prev) => ({ ...prev, [type]: file }));
      type === "desktopImage"
        ? setDesktopFileName(file.name)
        : setMobileFileName(file.name);
    } else {
      type === "desktopImage"
        ? setDesktopFileName("No file chosen")
        : setMobileFileName("No file chosen");
    }
  };

  const handleEdit = (advertisement) => {
    setEditingAdvertisement(advertisement);
    setDesktopFileName("No file chosen");
    setMobileFileName("No file chosen");
  };

  const handleDelete = (advertisementId) => {
    setDeletingAdvertisementId(advertisementId);
    setShowDeleteModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingAdvertisement((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", editingAdvertisement.title);
      if (desktopFileName !== "No file chosen") {
        formData.append("desktopImage", editingAdvertisement.desktopImage);
      }
      if (mobileFileName !== "No file chosen") {
        formData.append("mobileImage", editingAdvertisement.mobileImage);
      }

      await axios.put(
        `http://localhost:5001/api/advertisement/${editingAdvertisement._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchAdvertisements();
      setEditingAdvertisement(null);
      setDesktopFileName("No file chosen");
      setMobileFileName("No file chosen");
      setIsLoading(false);
      alert("Succesfully edited!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating advertisement:", error);
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(
        `http://localhost:5001/api/advertisement/${deletingAdvertisementId}`
      );
      fetchAdvertisements();
      setShowDeleteModal(false);
      setDeletingAdvertisementId(null);
      setIsLoading(false);
      alert("Succesfully deleted!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      setIsLoading(false);
    }
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="add-course-form-container">
      <div className="add-course-form-header" onClick={toggleFormVisibility}>
        <h2>Edit/Remove Advertisement</h2>
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
              {editingAdvertisement ? (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={editingAdvertisement.title}
                      onChange={handleChange}
                      placeholder="Enter Advertisement Title"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="desktop-file-upload">
                      Desktop Image{" "}
                      <span style={{ fontSize: ".8rem", color: "grey" }}>
                        {editingAdvertisement.space === 2
                          ? "[ size: 336 X 297 ]"
                          : "[ size: 342 X 634 ]"}
                      </span>
                    </label>
                    <input
                      type="file"
                      id="desktop-file-upload"
                      onChange={(e) => handleFileChange(e, "desktopImage")}
                    />
                    <span>{desktopFileName}</span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="mobile-file-upload">
                      Mobile Image
                      <span style={{ fontSize: ".8rem", color: "grey" }}>
                        {editingAdvertisement.space === 2
                          ? "[ size: 634 X 342 ]"
                          : "[ size: 634 X 342 ]"}
                      </span>
                    </label>
                    <input
                      type="file"
                      id="mobile-file-upload"
                      onChange={(e) => handleFileChange(e, "mobileImage")}
                    />
                    <span>{mobileFileName}</span>
                  </div>
                  <button type="submit">Submit</button>
                </form>
              ) : (
                <div className="poster-list">
                  {advertisements.map((ad) => (
                    <div key={ad._id} className="poster-box">
                      <div className="poster-img-cont">
                        <img
                          src={`data:image/jpeg;base64,${ad.mobileImage}`}
                          alt={ad.title}
                        />
                        <img
                          src={`data:image/jpeg;base64,${ad.desktopImage}`}
                          alt={ad.title}
                        />
                      </div>
                      <div className="poster-info">
                        <div className="poster-info-text">
                          <h3>{ad.title}</h3>
                        </div>
                        <div className="button-container">
                          <button
                            className="edit-banner-button"
                            onClick={() => handleEdit(ad)}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="delete-banner-button"
                            onClick={() => handleDelete(ad._id)}
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
          <p>Are you sure you want to delete this advertisement?</p>
          <button onClick={confirmDelete}>Confirm</button>
          <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default EditAdvertisementForm;
