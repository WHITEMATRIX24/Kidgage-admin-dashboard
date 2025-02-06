import React, { useState } from "react";
import "./courseDeleteModal.css";
import axios from "axios";




const CourseDeleteModal = ({ isShow, closeHandler, courseDeleteId, setDeleteStatus }) => {
  const [isLoading, setIsLoading] = useState(false);

  // course delete handler
  // const deleteCourseHandler = async () => {
  //   if (courseDeleteId) {
  //     setIsLoading(true);
  //     try {
  //       const res = await axios.delete(
  //         `https://admin.kidgage.com/api/courses/delete/${courseDeleteId}`
  //       );

  //       if (res.status === 200 || res.status === 204) { // Handle both 200 and 204 status codes
  //         alert("Successfully deleted course");
  //         setDeleteStatus(res.data); // Assuming res.data has the updated status or course info
  //         // closeHandler(); // Close the modal
  //       } else {
  //         // Log response data to debug further
  //         console.log("Response data:", res.data);
  //         alert(res.data.message || "Failed to delete course");
  //       }
  //     } catch (error) {
  //       // Log error details to understand what might be going wrong
  //       console.error("Error deleting course:", error);
  //       alert("An error occurred while deleting the course. Please try again.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };


  const deleteCourseHandler = async () => {
    if (courseDeleteId) {
      setIsLoading(true);
      try {
        const res = await axios.delete(
          `https://admin.kidgage.com/api/courses/delete/${courseDeleteId}`
        );

        if (res.status === 200) {
          alert("successfully delete couses");
          setDeleteStatus(res.data)
          closeHandler()
          return;
        }
        alert(res.data.message);
      } catch (error) {
        console.log(`error in deleting category error: ${error}`);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div
      className={`course-deletemodal-wrapper ${isShow ? "course-deletemodal-show" : "course-deletemodal-hide"}`}
    >
      <div className="course-deletemodal-container">
        <h2>Delete this course</h2>
        <p>Are you sure you want to delete this course?</p>
        <div className="course-deletemodal-btn-container">
          <button
            onClick={closeHandler}
            disabled={isLoading}
            className="course-deletemodal-btn-cancel"
          >
            Cancel
          </button>
          <button
            onClick={deleteCourseHandler}
            disabled={isLoading}
            className="course-deletemodal-btn-delete"
          >
            {isLoading ? "Please wait..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDeleteModal;




