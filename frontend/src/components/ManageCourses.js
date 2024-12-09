import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTimes } from "react-icons/fa";
import AddCourseForm from "./AddCourseForm";
import EditCourseForm from "./EditCourseForm";
const ManageCourse = () => {
  const [provider, setProvider] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [showAForm, setShowAForm] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [selectedProviderId, setSelectedProviderId] = useState(null); // State for the selected course
  const [visibleCourses, setVisibleCourses] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null); // State for the selected course

  useEffect(() => {
    const fetchProviderAndCourses = async () => {
      const userId = sessionStorage.getItem("userid"); // Fetch the user ID from session storage
      if (!userId) {
        setError("No user ID found in session storage.");
        return;
      }

      try {
        // Fetch provider data
        const providerResponse = await axios.get(
          `https://kidgage-dashboar-newui.onrender.com/api/users/user/${userId}`
        );
        console.log("Provider Response:", providerResponse.data);
        setProvider(providerResponse.data);
        // Fetch courses for the specific provider using the provider's ID
        const providerId = providerResponse.data.id; // Use the correct property for the provider ID
        const coursesResponse = await axios.get(
          `https://kidgage-dashboar-newui.onrender.com/api/courses/by-providers`,
          {
            params: {
              providerIds: [userId], // Pass the provider ID as an array
            },
          }
        );
        console.log("Courses Response:", coursesResponse.data);

        // Set courses for the specific provider
        setCourses(coursesResponse.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("Provider or courses not found.");
        } else {
          setError(`Error fetching data: ${error.message || error}`);
        }
      }
    };

    fetchProviderAndCourses();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!provider) {
    return (
      <div style={{ minHeight: "200px" }} className="add-course-form-container">
        <div className="loader-container">
          <div style={{ marginBottom: "20%" }} className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  const handleAddAcademyClick = (userId) => {
    setShowAForm(true);
    setSelectedProviderId(userId);
    setShowForm(false); // Hide the provider list when editing a course
  };
  const handleCloseForm = () => {
    setShowAForm(false);
    setShowForm(true); // Hide the provider list when editing a course
  };
  const toggleCourseVisibility = (providerId) => {
    setVisibleCourses((prevVisibleCourses) => ({
      ...prevVisibleCourses,
      [providerId]: !prevVisibleCourses[providerId],
    }));
  };
  const totalCourses = Object.values(courses).reduce(
    (acc, courseList) => acc + courseList.length,
    0
  );
  const handleEditCourseClick = (course) => {
    console.log(course);
    setSelectedCourse(course); // Set the selected course for editing
    setShowForm(false); // Hide the provider list when editing a course
  };

  const handleCloseEditForm = () => {
    setSelectedCourse(null); // Close the Edit Course form
    setShowForm(true); // Show the provider list again
  };
  return (
    <div style={{ minHeight: "400px" }} className="add-course-form-container">
      {showForm && (
        <div className="add-course-form">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "flex-start",
            }}
          >
            <div style={{ marginLeft: "10px" }}>
              <p className="users-name">{provider.username}</p>
            </div>
            <button
              type="button"
              onClick={() => handleAddAcademyClick(provider._id)}
              className="add-image-button"
              title="Add Academy"
              style={{
                color: "black",
                display: "flex",
                alignItems: "center",
                padding: " 0 5px",
                background: "transparent",
                border: "1px solid #ccc",
              }}
            >
              <p>Add a new course</p>
              <FaPlus
                style={{
                  marginLeft: "10px",
                  fontSize: "16px",
                  color: "#387CB8",
                }}
              />
            </button>
          </div>

          <div
            className="see-courses"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "flex-start",
            }}
          >
            <h4 className="no-of-course" style={{ alignSelf: "flex-start" }}>
              Courses/Activities listed:{" "}
              {courses[provider._id] ? courses[provider._id].length : 0}
            </h4>
          </div>
          {courses && courses.length > 0 ? (
            <div className="courses-container" style={{ width: "100%" }}>
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="course-card"
                  onClick={() => handleEditCourseClick(course)}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "60%",
                    }}
                  >
                    <p style={{ color: "darkblue" }}>{course.name}</p>
                    <p style={{ color: "green" }}>{course.courseType}</p>
                  </div>
                  <button>view</button>
                </div>
              ))}
            </div>
          ) : (
            <p>No courses available for this provider.</p>
          )}
        </div>
      )}
      {showAForm && (
        <div className="add-academy-form-container">
          <div className="form-header">
            <h3>Add New Course</h3>
            <button className="close-form-button" onClick={handleCloseForm}>
              <FaTimes style={{ fontSize: "24px", color: "red" }} />
            </button>
          </div>
          <AddCourseForm
            handleSubmit={handleCloseForm}
            providerId={selectedProviderId}
          />
        </div>
      )}
      {selectedCourse && (
        <div className="edit-course-form-container">
          <div className="form-header">
            <h3>Edit/ Remove Course</h3>
            <button className="close-form-button" onClick={handleCloseEditForm}>
              <FaTimes style={{ fontSize: "24px", color: "red" }} />
            </button>
          </div>
          <EditCourseForm
            course={selectedCourse} // Pass selected course to edit
            id={selectedCourse._id}
            handleSubmit={handleCloseEditForm} // Close form after submission
          />
        </div>
      )}
    </div>
  );
};
export default ManageCourse;
