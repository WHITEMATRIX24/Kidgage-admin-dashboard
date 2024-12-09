import React, { useEffect, useState } from "react";
import "./ManageAcademy.css";
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
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const ManageAcademy = () => {
  const [user, setUser] = useState({
    academyImg: null, // Store the file object
    logo: null, // Store the file object
  });
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showMainForm, setShowMainForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Manage loading state
  const [asLoading, setAsLoading] = useState(false); // Manage loading state
  const [loading, setLoading] = useState(true);
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
  const charLimit = 500;

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      const userId = sessionStorage.getItem("userid");
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

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    // Handle file inputs separately
    if (files) {
      setFormData((prevState) => ({
        ...prevState,
        [`${name}File`]: files[0], // Save file object in state
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
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
    setAsLoading(true);
    e.preventDefault();
    const userId = sessionStorage.getItem("userid");

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

    // Check if 'academyImg' is a valid file and append it
    if (user.academyImg instanceof File) {
      formDataToSend.append("academyImg", user.academyImg); // Append Academy Image file
    }

    // Check if 'logo' is a valid file and append it
    if (user.logo instanceof File) {
      formDataToSend.append("logo", user.logo); // Append Logo file
    }

    try {
      const response = await fetch(
        `https://kidgage-dashboar-newui.onrender.com/api/users/edit/${userId}`,
        {
          method: "POST",
          body: formDataToSend, // Use FormData for file uploads
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user details.");
      }

      alert("Profile updated successfully!");
      setShowEditForm(false);
      setShowMainForm(true); // Hide form after successful update
      setAsLoading(false);
      window.location.reload();
    } catch (error) {
      setError(error.message);
      setAsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userId = sessionStorage.getItem("userid");

    // Create a new FormData object to send both text fields and file uploads
    const formDataToSend = new FormData();
    // formDataToSend.append("licenseNo", formData.licenseNo);

    if (formData.academyImgFile) {
      formDataToSend.append("academyImg", formData.academyImgFile); // Append Academy Image file
    }

    if (formData.logoFile) {
      formDataToSend.append("logo", formData.logoFile); // Append Logo file
    }

    try {
      const response = await fetch(
        `https://kidgage-dashboar-newui.onrender.com/api/users/complete/${userId}`,
        {
          method: "POST",
          body: formDataToSend, // Use FormData for file uploads
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user details.");
      }
      alert("Profile updated successfully!");
      setShowForm(false); // Hide form after successful update
      setIsLoading(false); // Stop loading after fetch
      window.location.reload();
    } catch (error) {
      setError(error.message);
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
  const handleclose = () => {
    setShowEditForm(false);
    setShowMainForm(true);
  };
  return (
    <div className="add-course-form-container">
      {showMainForm && (
        <div className="add-course-form">
          <h1>User Profile</h1>
          {loading ? (
            <div
              style={{
                minHeight: "100px",
                marginTop: "10%",
                marginBottom: "10%",
              }}
              className="loader-container"
            >
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
              <button
                style={{ width: "100px", borderRadius: "5px" }}
                onClick={handlebuttonclick}
              >
                <FontAwesomeIcon style={{ marginRight: "0px" }} icon={faEdit} />
                edit
              </button>
            </>
          )}
        </div>
      )}

      {showEditForm && (
        <div className="">
          <div className="">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <h2>Update Academy Details</h2>
              <button
                style={{
                  backgroundColor: "transparent",
                  color: "red",
                  fontSize: "large",
                  alignSelf: "flex-end",
                  border: "none",
                }}
                className="a-close-button"
                onClick={handleclose}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
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
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}
      {showForm && (
        <div className="editmodal">
          <div className="editmodal-container">
            <h3>Please Update your profile to continue</h3>
            <form onSubmit={handleSubmit}>
              {/* <div>
                <label>License No:</label>
                <input
                  type="text"
                  name="licenseNo"
                  value={formData.licenseNo}
                  onChange={handleInputChange}
                  required
                />
              </div> */}
              <div>
                <label>
                  Academy Image
                  <span style={{ fontSize: ".8rem", color: "grey" }}>
                    [ size: 1280 X 1028 ]
                  </span>
                  :
                </label>
                <input
                  type="file"
                  name="academyImg"
                  onChange={handleInputChange} // Handle file input change
                  required
                />
              </div>
              <div>
                <label>
                  Logo
                  <span style={{ fontSize: ".8rem", color: "grey" }}>
                    [ size: 80 X 80 ]
                  </span>
                  :
                </label>
                <input
                  type="file"
                  name="logo"
                  onChange={handleInputChange} // Handle file input change
                  required
                />
              </div>
              <button type="submit">Save</button>
            </form>
          </div>
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
          {asLoading && (
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
      )}
    </div>
  );
};

export default ManageAcademy;
