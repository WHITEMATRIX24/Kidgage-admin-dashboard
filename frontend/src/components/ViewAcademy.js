import React, { useEffect, useState } from "react";
import "./AddCourseForm.css";
import "./ViewForm.css";
import { FaChevronDown, FaPlus, FaTimes } from "react-icons/fa";
import axios from "axios";
import AddAcademyForm from "./AddAcademyForm"; // Import AddAcademyForm component
import EditAcademyForm from "./EditAcademy"; // Import EditAcademyForm component

const ViewAcademy = ({ handleSubmit }) => {
  const [showForm, setShowForm] = useState(true);
  const [showAForm, setShowAForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedAcademy, setSelectedAcademy] = useState(null); // State for the academy being edited
  const [loading, setLoading] = useState(true);
  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  useEffect(() => {
    // Fetch users from the backend
    setLoading(true);
    axios
      .get("https://kidgage-dashboar-newui.onrender.com/api/users/all") // Make sure this matches the actual API route
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
        setLoading(false);
      });
  }, []);

  const handleAddAcademyClick = () => {
    setShowAForm(true); // Show the Add Academy form
    setShowForm(false); // Hide the academies list
  };

  const handleCloseForm = () => {
    setShowAForm(false); // Close the Add Academy form when clicking the close button or after submission
    setShowForm(true); // Show the academies list again
  };

  const handleEditAcademyClick = (academy) => {
    console.log(academy); // Log the academy object to check if it has the 'email' field
    setSelectedAcademy(academy); // Set the selected academy for editing
    setShowForm(false); // Hide the academies list when editing
  };

  const handleCloseEditForm = () => {
    setSelectedAcademy(null); // Close the Edit Academy form
    setShowForm(true); // Show the academies list again
  };

  return (
    <div style={{ minHeight: "400px" }} className="add-course-form-container">
      {!showAForm && (
        <>
          <div
            className="add-course-form-header"
            onClick={toggleFormVisibility}
          >
            <h2>Academies</h2>
            <FaChevronDown
              className={`dropdown-icon ${showForm ? "open" : ""}`}
            />
          </div>
          {loading ? (
            <div
              style={{ marginTop: "15%", marginBottom: "15%" }}
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
              {showForm && (
                <form className="add-course-form">
                  <h2>Total academies registered: {users.length}</h2>
                  <div className="users-container">
                    {users.map((user) => (
                      <div
                        className="user-card"
                        key={user.username}
                        onClick={() => handleEditAcademyClick(user)}
                      >
                        <img
                          src={`data:image/jpeg;base64,${user.logo}`}
                          alt={`${user.username}'s logo`}
                          className="user-logo"
                        />
                        <p className="user-name">{user.username}</p>
                        {/* <p className="user-name">{user.email}</p> */}

                        <div className="vbutton-container">
                          {/* Optionally, add buttons for editing/deleting here */}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddAcademyClick}
                      className="add-img-button"
                      title="Add Academy"
                      style={{
                        background: "transparent",
                        border: "1px solid #ccc",
                      }}
                    >
                      <FaPlus style={{ fontSize: "64px", color: "#387CB8" }} />
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </>
      )}
      {/* Show AddAcademyForm when showAForm is true */}
      {showAForm && (
        <div className="add-academy-form-container">
          <div className="form-header">
            <h3>Add New Academy</h3>
            <button className="close-form-button" onClick={handleCloseForm}>
              <FaTimes style={{ fontSize: "24px", color: "red" }} />
            </button>
          </div>
          <AddAcademyForm handleSubmit={handleCloseForm} />{" "}
          {/* Pass handleCloseForm to close form after submission */}
        </div>
      )}
      {/* Show EditAcademyForm when an academy is selected */}
      {selectedAcademy && (
        <div className="edit-academy-form-container">
          <div className="form-header">
            <h3>Edit/Remove Academy</h3>
            <button className="close-form-button" onClick={handleCloseEditForm}>
              <FaTimes style={{ fontSize: "24px", color: "red" }} />
            </button>
          </div>
          <EditAcademyForm
            academy={selectedAcademy} // Pass selected academy to edit
            id={selectedAcademy._id} // Pass email of the selected academy
            handleSubmit={handleCloseEditForm} // Close form after submission
          />
        </div>
      )}
    </div>
  );
};

export default ViewAcademy;
