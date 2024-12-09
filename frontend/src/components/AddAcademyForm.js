/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import "./AddCourseForm.css";
import axios from "axios";

const AddAcademyForm = ({ handleNavigation }) => {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Manage loading state
  const logoInputRef = useRef(null); // Ref for logo input
  const crFileInputRef = useRef(null); // Ref for CR file input
  const academyImgInputRef = useRef(null); // Ref for academy image input
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
  const initialFormState = {
    username: "",
    email: "",
    phoneNumber: "",
    fullName: "",
    designation: "",
    website: "",
    instaId: "",
    logo: [],
    crFile: [],
    licenseNo: "",
    academyImg: [],
    description: "",
    location: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [fileError, setFileError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "description") {
      setCharCount(value.length);
    }

    if (files) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: Array.from(files),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleFileChange = (e) => {
    const { name, value, files } = e.target;

    // Handle file upload and check file size
    if (files) {
      const file = files[0];
      if (file && file.size > 1024 * 1024) {
        // 1MB in bytes
        setFileError(`The file size of ${file.name} exceeds 1MB.`);
        setFormData((prevState) => ({
          ...prevState,
          [name]: [],
        }));
      } else {
        setFileError(""); // Clear error if file size is valid
        setFormData((prevState) => ({
          ...prevState,
          [name]: Array.from(files),
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("button clicked!");
    setError("");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((file) => {
          data.append(key, file);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        "https://kidgage-dashboar-newui.onrender.com/api/users/signup",
        data
      );
      alert("Academy added Successfully!");
      setFormData({ ...initialFormState }); // Reset form fields
      if (logoInputRef.current) logoInputRef.current.value = "";
      if (crFileInputRef.current) crFileInputRef.current.value = "";
      if (academyImgInputRef.current) academyImgInputRef.current.value = "";
      setIsLoading(false); // Stop loading after fetch
      window.location.reload();
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
      setSuccess("");
      setIsLoading(false); // Stop loading after fetch
    }
  };
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(""); // Clear the success message after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer on component unmount or re-render
    }
  }, [success]);
  // eslint-disable-next-line no-unused-vars
  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="">
      {/* <div className="add-course-form-header" onClick={toggleFormVisibility}>
            <h2>Add Academy</h2>
            <FaChevronDown className={`dropdown-icon ${showForm ? 'open' : ''}`} />
        </div> */}
      <form className="add-course-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Academy Name"
          required
        />
        <label className="sign-in-label">Academy Bio</label>
        <textarea
          name="description"
          value={formData.description}
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
        <div className="add-upload-label-group">
          <label className="sign-in-label" htmlFor="crFile">
            Email ID
          </label>
          <label className="sign-in-label" htmlFor="academyImg">
            Phone
          </label>
        </div>
        <div
          className="side-by-side"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail ID"
            required
          />
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
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone number"
              required
              style={{ paddingLeft: "50px" }}
            />
          </div>
        </div>
        <div className="add-upload-label-group">
          <label className="sign-in-label" htmlFor="crFile">
            Full Name
          </label>
          <label className="sign-in-label" htmlFor="academyImg">
            Designation
          </label>
        </div>
        <div
          className="side-by-side"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Designation"
            required
          />
        </div>
        <div className="add-upload-label-group" style={{ gap: "25%" }}>
          <label className="sign-in-label" htmlFor="logo">
            Academy Logo{" "}
            <span style={{ fontSize: ".8rem", color: "grey" }}>
              [ size: 240 X 240 ]
            </span>
          </label>
          <label className="sign-in-label" htmlFor="crFile">
            License No.
          </label>
        </div>
        <div
          className="side-by-side"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <input
            type="file"
            name="logo"
            ref={logoInputRef} // Attach ref
            onChange={handleChange}
            accept=".png, .jpg, .jpeg"
            required
          />
          <input
            type="text"
            name="licenseNo"
            value={formData.licenseNo}
            onChange={handleChange}
            placeholder="License number"
            required
          />
        </div>
        <div className="add-upload-label-group">
          <label className="sign-in-label" htmlFor="crFile">
            CR
          </label>
          <label className="sign-in-label" htmlFor="academyImg">
            Academy Image
            <span style={{ fontSize: ".8rem", color: "grey" }}>
              [ size: 870 X 580 ]
            </span>
            :
          </label>
        </div>
        {fileError && <p className="error-message">{fileError}</p>}
        <div
          className="side-by-side"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <input
            type="file"
            name="crFile"
            ref={crFileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden-input"
            required
          />
          <input
            type="file"
            name="academyImg"
            ref={academyImgInputRef} // Attach ref
            onChange={handleChange}
            accept=".png, .jpg, .jpeg"
            required
          />
        </div>
        <div className="add-upload-label-group">
          <label className="sign-in-label" htmlFor="crFile">
            Website
          </label>
          <label className="sign-in-label" htmlFor="academyImg">
            Instagram ID
          </label>
        </div>
        <div
          className="side-by-side"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Enter website link"
          />
          <input
            type="text"
            name="instaId"
            value={formData.instaId}
            onChange={handleChange}
            placeholder="Enter Instagram ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Add Location</label>
          <select
            name="location"
            value={formData.location}
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
        <button type="submit">Create Academy</button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="msuccess-message">{success}</p>}
      </form>
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

export default AddAcademyForm;
