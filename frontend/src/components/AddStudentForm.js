import React, { useState } from "react";
import { FaChevronDown, FaSearch, FaPlus, FaTimes } from "react-icons/fa";
import "./AddCourseForm.css"; // Reuse the same CSS file for styling
import axios from "axios";

function AddStudentForm() {
  const initialStudentState = {
    parent: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    levelOfExpertise: "beginner",
    interests: [],
    newInterest: "", // Temporary field to handle new interest input
  };

  const [student, setStudent] = useState(initialStudentState);
  const [isLoading, setIsLoading] = useState(false); // Manage loading state
  const [showForm, setShowForm] = useState(true);
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (e) => {
    setStudent((prev) => ({ ...prev, newInterest: e.target.value }));
  };

  const addInterest = () => {
    if (
      student.newInterest &&
      !student.interests.includes(student.newInterest)
    ) {
      setStudent((prev) => ({
        ...prev,
        interests: [...prev.interests, student.newInterest],
        newInterest: "", // Clear input field after adding
      }));
    }
  };

  const removeInterest = (interest) => {
    setStudent((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!searchResult) {
      setError("Parent not found");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post(
        "https://kidgage-dashboar-newui.onrender.com/api/student/add",
        {
          parent: searchResult._id,
          firstName: student.firstName,
          lastName: student.lastName,
          dob: student.dob,
          gender: student.gender,
          levelOfExpertise: student.levelOfExpertise,
          interests: student.interests,
        }
      );

      console.log("Student added:", response.data);
      setStudent(initialStudentState); // Clear the form
      setSuccess("Student added successfully!");
      setError(""); // Clear any previous error
      setIsLoading(false); // Stop loading after fetch
      window.location.reload();
    } catch (error) {
      console.error("Error adding student:", error);
      setError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
      setSuccess(""); // Clear any previous success message
      setIsLoading(false); // Stop loading after fetch
    }
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "https://kidgage-dashboar-newui.onrender.com/api/personal/search",
        {
          params: { query: student.parent },
        }
      );
      setSearchResult(response.data);
      setError(""); // Clear any previous error
    } catch (error) {
      console.error("Error searching parent:", error);
      setSearchResult(null);
      setError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
    }
  };

  return (
    <div className="add-course-form-container">
      <div className="add-course-form-header" onClick={toggleFormVisibility}>
        <h2>Add Student</h2>
        <FaChevronDown className={`dropdown-icon ${showForm ? "open" : ""}`} />
      </div>
      {showForm && (
        <form className="add-course-form" onSubmit={handleSubmit}>
          <div className="form-group search-provider-group">
            <label htmlFor="parent">Parent</label>
            <input
              type="text"
              id="parent"
              name="parent"
              value={student.parent}
              onChange={handleChange}
              placeholder="Search parent by email or phone..."
            />
            <button
              type="button"
              className="search-provider-button"
              onClick={handleSearch}
            >
              <FaSearch />
            </button>
          </div>
          {searchResult && (
            <div className="parent-details">
              <p>
                <strong>Username:</strong> {searchResult.username}
              </p>
              <p>
                <strong>ID:</strong> {searchResult._id}
              </p>
            </div>
          )}
          <div className="form-group add-course-label-group">
            <label htmlFor="firstName"></label>
            <label htmlFor="lastName"></label>
          </div>
          <div className="form-group add-course-group">
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={student.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              value={student.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="side-by-side">
            <input
              type="date"
              id="dob"
              name="dob"
              value={student.dob}
              onChange={handleChange}
            />
            <select
              id="gender"
              name="gender"
              value={student.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="levelOfExpertise">Level of Expertise</label>
            <select
              id="levelOfExpertise"
              name="levelOfExpertise"
              value={student.levelOfExpertise}
              onChange={handleChange}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div className="side-by-side2">
            <div className="interest-input-group">
              <input
                type="text"
                id="newInterest"
                name="newInterest"
                value={student.newInterest}
                onChange={handleInterestChange}
                placeholder="Add new interest"
              />
              <button
                type="button"
                className="add-interest-btn"
                onClick={addInterest}
              >
                <FaPlus />
              </button>
            </div>
            <div className="interest-box">
              <label>Interests</label>
              {student.interests.map((interest) => (
                <div key={interest} className="interest-item">
                  <span>{interest}</span>
                  <button
                    type="button"
                    className="remove-interest-btn"
                    onClick={() => removeInterest(interest)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button type="submit">Submit</button>
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

export default AddStudentForm;
