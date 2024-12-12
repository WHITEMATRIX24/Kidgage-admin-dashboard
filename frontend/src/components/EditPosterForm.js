import React, { useState, useEffect } from "react";
import { FaChevronDown, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import "./AddCourseForm.css"; // Reuse the same CSS file
import { faL } from "@fortawesome/free-solid-svg-icons";

const EditPosterForm = ({ onDelete }) => {
  const [posters, setPosters] = useState([]);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [fileName, setFileName] = useState("No file chosen");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({}); // For validation errors
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/posters");
      setPosters(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posters:", error);
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

  const handleEdit = (poster) => {
    setSelectedPoster(poster);
    setEditMode(true);
  };

  const handleDelete = (poster) => {
    onDelete(poster); // Trigger the delete confirmation popup in Dashboard
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedPoster((prev) => ({ ...prev, [name]: value }));

    // Validation on change
    if (name === "description") {
      validateDescription(value);
    } else if (name === "name") {
      validateName(value);
    }
  };

  const validateDescription = (description) => {
    let isValid = true;
    let errors = {};
    if (description.length < 400 || description.length > 500) {
      isValid = false;
      errors.description = "Description must be between 400 and 500 characters";
    }
    setErrors((prevErrors) => ({ ...prevErrors, ...errors }));
    return isValid;
  };

  const validateName = (name) => {
    let isValid = true;
    let errors = {};
    if (name.length < 10 || name.length > 20) {
      isValid = false;
      errors.name = "Event name must be between 10 and 20 characters";
    }
    setErrors((prevErrors) => ({ ...prevErrors, ...errors }));
    return isValid;
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const isDescriptionValid = validateDescription(selectedPoster.description);
    const isNameValid = validateName(selectedPoster.name);

    if (!isDescriptionValid || !isNameValid) return;

    const formData = new FormData();
    formData.append("name", selectedPoster.name);
    formData.append("description", selectedPoster.description);
    formData.append("location", selectedPoster.location);
    formData.append("link", selectedPoster.link);
    formData.append("startDate", selectedPoster.startDate);
    formData.append("endDate", selectedPoster.endDate);
    if (file) {
      formData.append("image", file);
    }

    try {
      await axios.put(
        `http://localhost:5001/api/posters/${selectedPoster._id}`,
        formData
      );
      setEditMode(false);
      setSelectedPoster(null);
      setFileName("No file chosen");
      setFile(null);
      fetchPosters(); // Refresh the poster list
      setIsLoading(false);
      alert("Succesfully edited!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating poster:", error);
      setIsLoading(false);
    }
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const getImageSource = (imageBase64) => {
    if (imageBase64) {
      return `data:image/jpeg;base64,${imageBase64}`; // Adjust MIME type as needed
    }
    return null;
  };

  return (
    <div className="add-course-form-container">
      <div className="add-course-form-header" onClick={toggleFormVisibility}>
        <h2>Edit/Remove Poster</h2>
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
                <div className="poster-list">
                  {posters.map((poster) => (
                    <div className="poster-box" key={poster._id}>
                      <img
                        src={getImageSource(poster.image)}
                        alt={poster.name}
                      />
                      <div className="poster-info">
                        <h3>{poster.name}</h3>
                        <p>{poster.description}</p>
                        <p>
                          {poster.startDate} - {poster.endDate}
                        </p>
                        <div className="button-container">
                          <button onClick={() => handleEdit(poster)}>
                            <FaEdit /> Edit
                          </button>
                          <button onClick={() => handleDelete(poster)}>
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div>
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedPoster?.name || ""}
                      onChange={handleChange}
                      required
                    />
                    {errors.name && (
                      <p className="error-message">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label>Description:</label>
                    <textarea
                      name="description"
                      value={selectedPoster?.description || ""}
                      onChange={handleChange}
                      required
                    />
                    {errors.description && (
                      <p className="error-message">{errors.description}</p>
                    )}
                  </div>
                  <div>
                    <label>Location:</label>
                    <input
                      type="text"
                      name="location"
                      value={selectedPoster?.location || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Link to Register:</label>
                    <input
                      type="text"
                      name="link"
                      value={selectedPoster?.link || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Start Date:</label>
                    <input
                      type="date"
                      name="startDate"
                      value={selectedPoster?.startDate || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>End Date:</label>
                    <input
                      type="date"
                      name="endDate"
                      value={selectedPoster?.endDate || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>
                      Image
                      <span style={{ fontSize: ".8rem", color: "grey" }}>
                        [ size: 1080 X 1080 ]
                      </span>
                      :
                    </label>
                    <input type="file" onChange={handleFileChange} />
                    <p>{fileName}</p>
                  </div>
                  <button type="submit">Update Poster</button>
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
    </div>
  );
};

export default EditPosterForm;
