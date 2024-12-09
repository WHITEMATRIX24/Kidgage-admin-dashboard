import React, { useState } from "react";
import "./courseDeleteModal.css";
import axios from "axios";

const CourseDeleteModal = ({ isShow, closeHandler, courseDeleteId }) => {
    const [isLoading, setIsLoading] = useState(false);

    // course delete handler
    const deleteCourseHandler = async () => {
        if (courseDeleteId) {
            setIsLoading(true);
            try {
                const res = await axios.delete(
                    `https://kidgage-dashboar-newui.onrender.com/api/course-category/delete/${courseDeleteId}`
                );

                if (res.status === 200) {
                    alert("Successfully deleted course");
                    return;
                }
                alert(res.data.message);
            } catch (error) {
                console.log(`Error in deleting course: ${error}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div
            className={`course-deletemodal-wrapper ${isShow ? "course-deletemodal-show" : "course-deletemodal-hide"
                }`}
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
                        {isLoading ? "Please wait" : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseDeleteModal;
