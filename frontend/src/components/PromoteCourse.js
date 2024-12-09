import React, { useEffect, useState } from "react";
import "./AddCourseForm.css"; // Reuse the same CSS file for styling
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";

const PromoteCourse = () => {
  const [showForm, setShowForm] = useState(true);
  const [providers, setProviders] = useState([]);
  const [courses, setCourses] = useState({});
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [promoteMode, setPromoteMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [aloading, asetLoading] = useState(true);
  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://kidgage-dashboar-newui.onrender.com/api/users/all"); // Adjust the URL as needed
        setProviders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching providers:", error);
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      asetLoading(true);
      const providerIds = providers.map((provider) => provider._id);
      try {
        const response = await axios.get(
          "https://kidgage-dashboar-newui.onrender.com/api/courses/by-providers",
          {
            params: { providerIds },
          }
        );
        const coursesByProvider = response.data.reduce((acc, course) => {
          const providerId = course.providerId;
          if (!acc[providerId]) {
            acc[providerId] = [];
          }
          acc[providerId].push(course);
          return acc;
        }, {});
        setCourses(coursesByProvider);
        asetLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        asetLoading(false);
      }
    };

    if (providers.length > 0) {
      fetchCourses();
    }
  }, [providers]);

  const handlePromoteClick = (course, promote) => {
    setSelectedCourse(course);
    setPromoteMode(promote);
    setShowConfirmPopup(true);
  };

  const handleConfirmPromotion = async () => {
    if (!selectedCourse) return;

    try {
      await axios.post(
        `https://kidgage-dashboar-newui.onrender.com/api/promoted/promote/${selectedCourse._id}`,
        { promote: promoteMode }
      );
      // Refresh the courses list
      setCourses((prevCourses) => ({
        ...prevCourses,
        [selectedCourse.providerId]: prevCourses[
          selectedCourse.providerId
        ].map((course) =>
          course._id === selectedCourse._id
            ? { ...course, promoted: promoteMode }
            : course
        ),
      }));
      setShowConfirmPopup(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error("Error promoting/demoting course:", error);
    }
  };

  const handleCancelPromotion = () => {
    setShowConfirmPopup(false);
    setSelectedCourse(null);
  };

  return (
    <div className="add-course-form-container">
      <div className="add-course-form-header" onClick={toggleFormVisibility}>
        <h2>Promote A Course</h2>
        <FaChevronDown className={`dropdown-icon ${showForm ? "open" : ""}`} />
      </div>
      {showForm && (
        <div className="add-course-form">
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
              <h2>Total providers registered: {providers.length}</h2>
              {providers.map((provider) => (
                <div key={provider._id} className="provider-section">
                  <h3>{provider.username}</h3>
                  <div className="courses-item">
                    {aloading ? (
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
                      <>
                        {courses[provider._id] &&
                          courses[provider._id].length > 0 ? (
                          courses[provider._id].map((course) => (
                            <div key={course._id} className="course-item">
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  width: "60%",
                                }}
                              >
                                <span>{course.name}</span>
                              </div>
                              {course.promoted ? (
                                <button
                                  onClick={() =>
                                    handlePromoteClick(course, false)
                                  }
                                >
                                  Remove from Promoted
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handlePromoteClick(course, true)
                                  }
                                >
                                  Promote
                                </button>
                              )}
                            </div>
                          ))
                        ) : (
                          <p>No courses available under this provider.</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      {showConfirmPopup && (
        <div className="confirm-popup">
          <div className="confirm-popup-content">
            <p>
              Are you sure you want to{" "}
              {promoteMode ? "promote" : "remove promotion from"} this course?
            </p>
            <button onClick={handleConfirmPromotion}>Yes</button>
            <button onClick={handleCancelPromotion}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoteCourse;
