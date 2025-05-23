import React, { useEffect, useState } from "react";
import "./course.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Appbar from "../../components/common/appbar/Appbar";
import AddCourseForm from "../../components/AddCourseForm";
import CourseDeleteModal from "../../components/courseDeleteModal/courseDeleteModal"; // Import the modal
import EditCourseForm1 from "../../components/EditCourseForm1";
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import CourseExceedModal from "../../components/courseExceedModal/CourseExceedModal";

const CoursePage = (searchdata) => {
  const [courseData, setCourseData] = useState([]);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [activeTab, setActiveTab] = useState("Programs Offered");
  const [imageIndexes, setImageIndexes] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCourseExceedModal, setShowCourseExceedModal] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState(null);
  const [courseId, setCourseId] = useState(null); // Store the course id
  const [searchKey, setSearchKey] = useState("")
  const [deleteStatus, setDeleteStatus] = useState([]);
  // const [isActive, setIsActive] = useState(null);
  // console.log(searchKey);

  const fetchProviderAndCourses = async () => {
    setError(null);

    const userId = sessionStorage.getItem("userid");
    if (!userId) {
      setError("No user ID found in session storage.");
      return;
    }

    try {
      const providerResponse = await axios.get(
        `https://admin.kidgage.com/api/users/user/${userId}`
      );
      setProvider(providerResponse.data);

      const coursesResponse = await axios.get(
        `https://admin.kidgage.com/api/courses/by-providers?search=${searchKey}`,
        {
          params: { providerIds: [userId] },
        }
      );
      setCourseData(coursesResponse.data);

      const initialIndexes = {};
      coursesResponse.data.forEach((course) => {
        initialIndexes[course._id] = 0;
      });
      setImageIndexes(initialIndexes);
    } catch (error) {
      console.log(`Error fetching courses: ${error}`);
      setError("Error fetching courses");
    }
  };

  const handleClick = (id) => {
    setActiveTab("Edit Course");
    setCourseId(id); // Set the selected course id
  };

  // const deleteCourse = async (id) => {
  //   try {
  //     const res = await axios.delete(
  //       `https://admin.kidgage.com/api/courses/delete/${id}`
  //     );
  //     if (res.status === 200) {
  //       setCourseData((prevData) =>
  //         prevData.filter((course) => course._id !== id)
  //       );
  //       alert("Course deleted successfully");
  //     } else {
  //       alert(res.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting course:", error);
  //     alert("Failed to delete course");
  //   }
  // };

  const handleDeleteClick = (id) => {
    setDeleteCourseId(id);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    fetchProviderAndCourses();
  }, [searchKey, deleteStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes((prevIndexes) => {
        const newIndexes = { ...prevIndexes };
        courseData.forEach((course) => {
          const imageCount = course.images.length;
          newIndexes[course._id] = (prevIndexes[course._id] + 1) % imageCount;
        });
        return newIndexes;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [courseData, deleteStatus]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date
      .toLocaleDateString("en-GB") // 'en-GB' will return 'dd/mm/yyyy'
      .replace(/\//g, "-"); // Replace slashes with dashes
    return formattedDate;
  };

  useEffect(() => {
    // Check if provider exists and then compare courseData length with provider.noOfCourses
    if (
      provider &&
      activeTab === "Add Course" &&
      courseData.length >= provider.noOfCourses
    ) {
      setShowCourseExceedModal(true);
    }
  }, [activeTab, courseData.length, provider]);

  const handleStatusToggle = async (activeStatus, id) => {
    try {
      console.log(activeStatus);

      const currentStatus = activeStatus === "true" || activeStatus === true;
      const updatedStatus = currentStatus ? "false" : "true"; // Toggle the status 
      console.log(updatedStatus);

      const res = await axios.put(
        `https://admin.kidgage.com/api/courses/update-active-status/${id}`,
        {
          active: updatedStatus, // Send the updated status
        }
      );
      if (res.status != 200) {
        alert("toggle action not successfull");
      }
      fetchProviderAndCourses();
      // Optimistically update the UI
      // setIsActive(updatedStatus === "true");
    } catch (error) {
      console.error("Error updating course status:", error);
      // Revert the state if the API request fails
      // setIsActive(activeStatus === "true");
    }
  };

  const handleChildData = (data) => {
    setSearchKey(data); // Set the received data to state
  };

  return (
    <div className="coursepage-container">
      {
        !searchdata ||
          (Array.isArray(searchdata) && searchdata.length === 0) ||
          (typeof searchdata === 'object' && Object.keys(searchdata).length === 0)
          ? <Appbar sendDataToParent={handleChildData} />
          : null
      }
      <h3 className="coursepage-content-heading">Courses</h3>
      <div className="coursepage-content-container">
        <div className="coursepage-content-header">
          {/* Tab Button for Programs Offered */}
          <button
            className={`course_tab-button ${activeTab === "Programs Offered" ? "active" : ""
              }`}
            onClick={() => setActiveTab("Programs Offered")}
          >
            Programs Offered
          </button>

          {/* Tab Button for Add Course */}
          <button
            className={`add_course_btn ${activeTab === "Add Course" ? "active" : ""
              }`}
            onClick={() => setActiveTab("Add Course")}
          >
            <FontAwesomeIcon icon={faPlus} style={{ color: "#fcfcfc" }} /> Add
            Course
          </button>
        </div>

        {/* Conditional Rendering based on activeTab */}
        {activeTab === "Programs Offered" ? (
          <table className="course-table-details">
            <thead className="table-head">
              <tr>
                <th>Banner Image</th>
                <th>Name</th>
                <th>Duration</th>
                <th>Mode of Classes</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan="6">{error}</td>
                </tr>
              ) : (
                courseData.map((course) => {
                  const courseDurations = course.courseDuration;
                  // Extract startDate and endDate for rendering in the table
                  const durationsFormatted = courseDurations.map((duration) => {
                    const startDate = new Date(duration.startDate);
                    const endDate = new Date(duration.endDate);

                    // Helper function to format the date in a readable way
                    const formatDate = (date) => {
                      return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      });
                    };

                    return `${formatDate(startDate)} to ${formatDate(endDate)}`;
                  }).join(', ');  // Join durations if multiple durations are present
                  const durationsAndUnit = courseDurations.map((duration) => {
                    const durationDisplay = duration.duration;
                    const durationUnit = duration.durationUnit;
                    return `${durationDisplay} ${durationUnit}`;
                  }).join(', ');  // Join durations if multiple durations are present

                  return (
                    <tr key={course._id}>
                      <td>
                        <div className="banner-img">
                          <img
                            src={course.images[imageIndexes[course._id]]}
                            alt="Banner Img"
                          />
                        </div>
                      </td>
                      <td>{course.name}</td>
                      <td className="duration_dates">
                        {durationsAndUnit}</td>
                      <td className="duration_dates">
                        {durationsFormatted}
                      </td>
                      <td>{course.courseType}</td>
                      <td>
                        <div className="course-icons">
                          <FontAwesomeIcon
                            icon={course.active ? faEye : faEyeSlash}
                            style={{ color: "#000205", cursor: "pointer" }}
                            onClick={() =>
                              handleStatusToggle(course.active, course._id)
                            }
                          />

                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            style={{ color: "#000205", cursor: "pointer" }}
                            key={course._id}
                            onClick={() => handleClick(course._id)}
                          />

                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{ color: "#000000", cursor: "pointer" }}
                            onClick={() => handleDeleteClick(course._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        ) : activeTab === "Add Course" ? (
          courseData.length < (provider ? provider.noOfCourses : 0) ? (
            <AddCourseForm providerId={provider ? provider._id : null} />
          ) : (
            showCourseExceedModal && (
              <div>
                <CourseExceedModal
                  isShow={showCourseExceedModal}
                  closeHandler={() => setShowCourseExceedModal(false)}
                />
              </div>
            )
          )
        ) : activeTab === "Edit Course" && courseId ? (
          <EditCourseForm1 courseId={courseId} />
        ) : null}
      </div>

      {/* Render the delete modal */}
      {showDeleteModal && (
        <CourseDeleteModal
          isShow={showDeleteModal}
          closeHandler={() => setShowDeleteModal(false)}
          courseDeleteId={deleteCourseId}
          setDeleteStatus={setDeleteStatus}
        // onConfirmDelete={() => {
        //   deleteCourse(deleteCourseId);
        //   setShowDeleteModal(false);
        // }}
        />
      )}
    </div>
  );
};

export default CoursePage;
