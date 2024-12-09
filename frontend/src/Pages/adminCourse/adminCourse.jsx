import React, { useEffect, useState } from "react";
import "./adminCourse.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Appbar from "../../components/common/appbar/Appbar";
import AddCourseForm from "../../components/AddCourseForm";
import CourseDeleteModal from "../../components/courseDeleteModal/courseDeleteModal"; // Import the modal

const AdminCoursePage = () => {
    const [courseData, setCourseData] = useState([]);
    const [error, setError] = useState(null);
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [activeTab, setActiveTab] = useState("Programs Offered");
    const [imageIndexes, setImageIndexes] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteCourseId, setDeleteCourseId] = useState(null);

    const fetchProviders = async () => {
        try {
            const response = await axios.get("https://kidgage-dashboar-newui.onrender.com/api/users/accepted");
            setProviders(response.data);
        } catch (error) {
            console.error("Error fetching providers:", error);
            setError("Error fetching providers");
        }
    };

    const fetchCourses = async (providerId) => {
        try {
            const response = await axios.get(`https://kidgage-dashboar-newui.onrender.com/api/courses/by-providers`, {
                params: { providerIds: [providerId] } // Pass providerId as an array
            });
            setCourseData(response.data);
            const initialIndexes = {};
            response.data.forEach((course) => {
                initialIndexes[course._id] = 0;
            });
            setImageIndexes(initialIndexes);
        } catch (error) {
            console.error("Error fetching courses:", error);
            setError("Error fetching courses");
        }
    };


    const handleProviderChange = (event) => {
        const providerId = event.target.value;
        setSelectedProvider(providerId);
        fetchCourses(providerId);
    };

    const deleteCourse = async (id) => {
        try {
            const res = await axios.delete(`https://kidgage-dashboar-newui.onrender.com/api/courses/delete/${id}`);
            if (res.status === 200) {
                setCourseData((prevData) => prevData.filter(course => course._id !== id));
                alert("Course deleted successfully");
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            alert("Failed to delete course");
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteCourseId(id);
        setShowDeleteModal(true);
    };

    useEffect(() => {
        fetchProviders();
    }, []);

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
    }, [courseData]);

    return (
        <div className="admin-course-container">
            <Appbar />
            <h3 className="admin-course-content-h3">Courses</h3>
            <div className="admin-course-content-container">
                <div className="admin-course-content-header">
                    <div className="admin-course-tab-buttons">
                        <button
                            className={`tab-button ${activeTab === "Programs Offered" ? "active" : ""}`}
                            onClick={() => setActiveTab("Programs Offered")}
                        >
                            Programs Offered
                        </button>
                        <button
                            className={`tab-button ${activeTab === "Add Course" ? "active" : ""}`}
                            onClick={() => setActiveTab("Add Course")}
                        >
                            Add Course
                        </button>
                    </div>
                    <select
                        className="admin-course-select-provider"
                        value={selectedProvider || ""}
                        onChange={handleProviderChange}
                    >
                        <option value="" disabled>Select Provider</option>
                        {providers.map((provider) => (
                            <option key={provider._id} value={provider._id}>
                                {provider.username}
                            </option>
                        ))}
                    </select>
                </div>

                {activeTab === "Programs Offered" ? (
                    <div className="admin-course-card-container">
                        {error ? (
                            <p>{error}</p>
                        ) : (
                            courseData.map((course) => (
                                <div className="admin-course-card" key={course._id}>
                                    <img
                                        src={course.images[imageIndexes[course._id]]}
                                        alt="course-image"
                                    />
                                    <div className="admin-course-card-details">
                                        <p>{course.name}</p>
                                        <div className="admin-course-card-actions-container">
                                            <button
                                                className="admin-course-card-action-btn admin-course-card-action-delete"
                                                onClick={() => handleDeleteClick(course._id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <AddCourseForm providerId={selectedProvider} />
                )}
            </div>

            {showDeleteModal && (
                <CourseDeleteModal
                    isShow={showDeleteModal}
                    closeHandler={() => setShowDeleteModal(false)}
                    courseDeleteId={deleteCourseId}
                    onConfirmDelete={() => {
                        deleteCourse(deleteCourseId);
                        setShowDeleteModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default AdminCoursePage;
