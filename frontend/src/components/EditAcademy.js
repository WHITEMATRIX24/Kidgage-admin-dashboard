import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddCourseForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faEnvelope,
  faPhone,
  faUser,
  faBriefcase,
  faMapMarkerAlt,
  faGlobe,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const EditAcademyForm = ({ id }) => {
  const [user, setUser] = useState({
    academyImg: null, // Store the file object
    logo: null,
    crFile: null, // Store the file object
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showMainForm, setShowMainForm] = useState(true);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Manage loading state
  const [formData, setFormData] = useState({
    licenseNo: "",
    academyImgFile: null, // Store the file object
    logoFile: null, // Store the file object
  });
  const cities = [
    "Doha",
    "Al Wakrah",
    "Al Khor",
    "Al Rayyan",
    "Al Shamal",
    "Al Shahaniya",
    "Al Daayen",
    "Umm Salal",
    "Dukhan",
    "Mesaieed",
  ];
  const [charCount, setCharCount] = useState(0);
  const handleDelete = () => {
    setShowConfirmPopup(true);
  };
  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`https://kidgage-dashboar-newui.onrender.com/api/users/academy/${user._id}`);
      setUser(null);
      setFormData({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        logo: [],
        crFile: [],
        idCard: [],
        licenseNo: "",
        academyImg: [],
        description: "",
        academyType: "",
        location: "",
      });
      setShowConfirmPopup(false);
      setError("");
      setIsLoading(false);
      alert("Academy deleted successfully!");
      setIsLoading(false); // Stop loading after fetch
      window.location.reload();
    } catch (error) {
      console.error("Error deleting academy:", error);
      setError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
      setSuccess("");
      setShowConfirmPopup(false);
      setIsLoading(false); // Stop loading after fetch
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmPopup(false);
  };
  const charLimit = 500;
  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      const userId = id;
      if (!userId) {
        setError("No admin ID found in session storage.");
        return;
      }

      try {
        const response = await fetch(
          `https://kidgage-dashboar-newui.onrender.com/api/users/user/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }
        const userData = await response.json();
        setUser(userData);

        // Show the form if the verification status is 'accepted'
        if (userData.verificationStatus === "accepted") {
          setShowForm(true);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "description") {
      setCharCount(value.length);
    }
    if (files) {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: files[0], // Store the first file selected
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userId = id;

    // Create a new FormData object to send both text fields and file uploads
    const formDataToSend = new FormData();

    formDataToSend.append("licenseNo", user.licenseNo);
    formDataToSend.append("email", user.email);
    formDataToSend.append("phoneNumber", user.phoneNumber);
    formDataToSend.append("fullName", user.fullName);
    formDataToSend.append("designation", user.designation);
    formDataToSend.append("website", user.website);
    formDataToSend.append("instaId", user.instaId);
    formDataToSend.append("location", user.location);
    formDataToSend.append("description", user.description);

    if (user.academyImg instanceof File) {
      formDataToSend.append("academyImg", user.academyImg); // Append Academy Image file
    }

    // Check if 'logo' is a valid file and append it
    if (user.logo instanceof File) {
      formDataToSend.append("logo", user.logo); // Append Logo file
    }
    if (user.crFile instanceof File) {
      formDataToSend.append("crFile", user.crFile); // Append Logo file
    }

    try {
      const response = await fetch(
        `https://kidgage-dashboar-newui.onrender.com/api/users/edits/${userId}`,
        {
          method: "POST",
          body: formDataToSend, // Use FormData for file uploads
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user details.");
      }
      setIsLoading(false);
      alert("Profile updated successfully!");
      setShowEditForm(false);
      setShowMainForm(true); // Hide form after successful update
      setIsLoading(false); // Stop loading after fetch
      window.location.reload();
    } catch (error) {
      setError(error.message);
      setSuccess("");
      setIsLoading(false); // Stop loading after fetch
    }
  };

  const downloadFile = () => {
    const base64String = user.crFile; // Assuming this is the Base64 string
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${base64String}`; // Change mime type if needed
    link.download = "CRFile.pdf"; // Provide a default name
    link.click();
  };
  const handlebuttonclick = () => {
    setShowEditForm(true);
    setShowMainForm(false);
  };
  return (
    <div className="">
      {showMainForm && (
        <div className="add-course-form">
          {loading ? (
            <div style={{ marginTop: "15%" }} className="loader-container">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : (
            <>
              <div
                className="user-detail"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <h3 style={{ marginBottom: "0", color: "#387CB8" }}>
                  {user.username}
                </h3>
                {user.crFile && (
                  <button
                    type="button"
                    onClick={downloadFile}
                    style={{ borderRadius: "20px", width: "150px" }}
                  >
                    Download CR File
                  </button>
                )}
              </div>
              <img
                style={{ width: "50%", height: "100%" }}
                src={`data:image/jpeg;base64,${user.academyImg}`}
                alt={`${user.username}'s logo`}
                className="use-logo"
              />
              <p> {user.description}</p>
              <p>
                <FontAwesomeIcon
                  style={{ marginRight: "10px" }}
                  icon={faEnvelope}
                />{" "}
                {user.email}
              </p>
              <p>
                <FontAwesomeIcon
                  style={{ marginRight: "10px" }}
                  icon={faPhone}
                />{" "}
                {user.phoneNumber}
              </p>
              <p>
                <FontAwesomeIcon
                  style={{ marginRight: "10px" }}
                  icon={faUser}
                />{" "}
                {user.fullName}
              </p>
              <p>
                <FontAwesomeIcon
                  style={{ marginRight: "10px" }}
                  icon={faBriefcase}
                />{" "}
                {user.designation}
              </p>
              <p>
                <FontAwesomeIcon
                  style={{ marginRight: "10px" }}
                  icon={faMapMarkerAlt}
                />{" "}
                {user.location}
              </p>
              <p>
                <FontAwesomeIcon
                  style={{ marginRight: "10px" }}
                  icon={faGlobe}
                />{" "}
                {user.website || "N/A"}
              </p>
              <p>
                <FontAwesomeIcon
                  style={{ marginRight: "10px" }}
                  icon={faInstagram}
                />{" "}
                {user.instaId || "N/A"}
              </p>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "10px" }}
              >
                <button
                  style={{ width: "100px", borderRadius: "5px" }}
                  onClick={handlebuttonclick}
                >
                  <FontAwesomeIcon
                    style={{ marginRight: "0px" }}
                    icon={faEdit}
                  />
                  edit
                </button>
                <button
                  style={{ width: "100px", borderRadius: "5px" }}
                  className="delete-course-button"
                  onClick={handleDelete}
                >
                  <FontAwesomeIcon
                    style={{ marginRight: "0px" }}
                    icon={faTrash}
                  />{" "}
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}
      {showEditForm && (
        <div className="">
          <div className="">
            <form className="add-course-form" onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="username"
                value={user.username}
                placeholder="Academy Name"
                required
                disabled
              />
              <div>
                <label className="sign-in-label">Academy Bio</label>
                <textarea
                  name="description"
                  value={user.description}
                  onChange={handleChange}
                  placeholder="Ex. You may include a brief introduction containing activities, classes you provide, age category etc.."
                  rows="4"
                  cols="50"
                  style={{ marginBottom: "0px" }}
                  maxLength={charLimit}
                  required
                />
                <p
                  style={{
                    fontSize: "smaller",
                    marginBottom: "20px",
                    marginLeft: "10px",
                    color: "darkblue",
                  }}
                >
                  {charCount}/{charLimit} characters
                </p>
              </div>
              <div>
                <label>License No:</label>
                <input
                  type="text"
                  name="licenseNo"
                  value={user.licenseNo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div
                className="phone-number-container"
                style={{ position: "relative", width: "100%" }}
              >
                <span
                  className="country-code"
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "21px",
                    transform: "translateY(-50%)",
                    fontSize: "small",
                    color: "#555",
                  }}
                >
                  +974
                </span>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={user.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone number"
                  required
                  style={{ paddingLeft: "50px" }}
                />
              </div>
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={user.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={user.designation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Add Location</label>
                <select
                  name="location"
                  value={user.location}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select your city
                  </option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  value={user.website}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Instagram ID</label>
                <input
                  type="text"
                  name="instaId"
                  value={user.instaId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>
                  Academy Image
                  <span style={{ fontSize: ".8rem", color: "grey" }}>
                    [ size: 870 X 580 ]
                  </span>
                  :
                </label>
                <input
                  type="file"
                  name="academyImg"
                  onChange={handleChange} // Handle file input change
                  accept=".png, .jpg"
                />
              </div>
              <div>
                <label>
                  Logo
                  <span style={{ fontSize: ".8rem", color: "grey" }}>
                    [ size: 240 X 240 ]
                  </span>
                  :
                </label>
                <input
                  type="file"
                  name="logo"
                  onChange={handleChange} // Handle file input change
                  accept=".png, .jpg"
                />
              </div>
              <div>
                <label>
                  Company Registration(PDF)
                  <span style={{ fontSize: ".8rem", color: "grey" }}>
                    [max. size: 1MB ]
                  </span>
                  :
                </label>
                <input
                  type="file"
                  name="crFile"
                  onChange={handleChange} // Handle file input change
                  accept=".pdf"
                />
              </div>
              <button type="submit">Save</button>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="msuccess-message">{success}</p>}
            </form>
          </div>
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
        <div className="confirm-popup-overlay">
          <div className="confirm-popup">
            <div className="confirm-popup-content">
              <p>
                Deleting an academy causes deletion of all activities listed
                under that academy.Are you sure you want to delete this academy?
              </p>
              <button onClick={handleConfirmDelete}>Yes</button>
              <button onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAcademyForm;
