import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddCourseForm.css"; // Reuse the same CSS file for styling
import {
  FaChevronDown,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

function EditStudentForm({ onDelete }) {
  const initialStudentState = {
    parent: "",
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    levelOfExpertise: "beginner",
    interests: [],
    newInterest: "",
  };

  const [showForm, setShowForm] = useState(true);
  const [query, setQuery] = useState("");
  const [parentData, setParentData] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "https://kidgage-dashboar-newui.onrender.com/api/personal/search",
        {
          params: { query },
        }
      );
      if (response.data) {
        setParentData(response.data);
        setSearchError("");
        fetchStudents(response.data._id);
      } else {
        setSearchError("Parent not found.");
        setParentData(null);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error searching parent:", error);
      setParentData(null);
      setStudents([]);
      setSearchError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
    }
  };

  const fetchStudents = async (parentId) => {
    try {
      const response = await axios.get(
        `https://kidgage-dashboar-newui.onrender.com/api/student/parent/${parentId}`
      );
      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        console.error("Invalid response format:", response.data);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
      setSearchError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
    }
  };

  const handleDeleteStudent = (student) => {
    onDelete(student);
  };

  const handleEditStudent = (student) => {
    if (!deleting) {
      setSelectedStudent(student);
      setEditStudent({ ...student });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInterestChange = (e) => {
    setEditStudent((prevState) => ({
      ...prevState,
      newInterest: e.target.value,
    }));
  };

  const addInterest = () => {
    if (
      editStudent.newInterest &&
      !editStudent.interests.includes(editStudent.newInterest)
    ) {
      setEditStudent((prev) => ({
        ...prev,
        interests: [...prev.interests, editStudent.newInterest],
        newInterest: "", // Clear input field after adding
      }));
    }
  };

  const removeInterest = (interest) => {
    setEditStudent((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const handleSaveStudent = async () => {
    setIsLoading(true);
    try {
      await axios.put(
        `https://kidgage-dashboar-newui.onrender.com/api/student/update/${selectedStudent?._id}`,
        editStudent
      );
      alert("Student updated successfully!");
      setError("");
      fetchStudents(parentData?._id);
      setSelectedStudent(null);
      setEditStudent(null);
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating student:", error);
      setError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
      setSuccess("");
      setIsLoading(false);
    }
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="add-course-form-container">
      <div className="add-course-form-header" onClick={toggleFormVisibility}>
        <h2>Edit/Remove a Student</h2>
        <FaChevronDown className={`dropdown-icon ${showForm ? "open" : ""}`} />
      </div>
      {showForm && (
        <div className="add-course-form">
          <label htmlFor="query">Search for students under a parent</label>
          <div className="form-group search-provider-group">
            <input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Parent's email or phone..."
            />
            <button
              type="button"
              className="search-provider-button"
              onClick={handleSearch}
            >
              <FaSearch />
            </button>
          </div>
          {searchError && <p className="error-message">{searchError}</p>}

          {students.length > 0 && (
            <div className="p-student-details">
              <h3>Students:</h3>
              <div className="p-student-cards">
                {students.map((student) => (
                  <div key={student?._id} className="p-student-card">
                    <div className="p-student-info">
                      <p>
                        <strong>Name:</strong> {student?.firstName}{" "}
                        {student?.lastName}
                      </p>
                      <p>
                        <strong>DOB:</strong> {student?.dob?.substring(0, 10)}{" "}
                      </p>
                      <p>
                        <strong>Gender:</strong> {student?.gender}{" "}
                      </p>
                      <p>
                        <strong>Level:</strong> {student?.levelOfExpertise}{" "}
                      </p>
                      <p>
                        <strong>Interests:</strong>{" "}
                        {student?.interests.join(",")}{" "}
                      </p>

                      {selectedStudent &&
                        selectedStudent._id === student?._id ? (
                        <div className="edit-fields">
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
                              value={editStudent?.firstName || ""}
                              onChange={handleChange}
                            />
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              placeholder="Last Name"
                              value={editStudent?.lastName || ""}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="side-by-side">
                            <input
                              type="date"
                              id="dob"
                              name="dob"
                              value={editStudent?.dob?.substring(0, 10) || ""}
                              onChange={handleChange}
                            />
                            <select
                              id="gender"
                              name="gender"
                              value={editStudent?.gender || ""}
                              onChange={handleChange}
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor="levelOfExpertise">
                              Level of Expertise
                            </label>
                            <select
                              id="levelOfExpertise"
                              name="levelOfExpertise"
                              value={editStudent?.levelOfExpertise || ""}
                              onChange={handleChange}
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="expert">Expert</option>
                            </select>
                          </div>
                          <div className="interests-container">
                            <div className="side-by-side2">
                              <div className="interest-input-group">
                                <input
                                  type="text"
                                  id="newInterest"
                                  name="newInterest"
                                  value={editStudent?.newInterest || ""}
                                  onChange={handleInterestChange}
                                  placeholder="Add an interest"
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
                                {editStudent?.interests.map((interest) => (
                                  <div key={interest} className="interest-item">
                                    {interest}
                                    <button
                                      className="remove-interest-btn"
                                      type="button"
                                      onClick={() => removeInterest(interest)}
                                    >
                                      <FaTimes />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="save-button"
                            onClick={handleSaveStudent}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="edit-delete-buttons">
                          <button
                            type="button"
                            className="edit-button"
                            onClick={() => handleEditStudent(student)}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            type="button"
                            className="delete-button"
                            onClick={() => handleDeleteStudent(student)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default EditStudentForm;
