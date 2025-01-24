import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  FaChevronDown,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTrashAlt,
  FaPlus,
} from "react-icons/fa";
import "./AddCourseForm.css"; // Reuse the same CSS file for styling

function EditCourseForm1({ courseId }) {
  const [showForm, setShowForm] = useState(true);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aloading, asetLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    providerId: "",
    name: "",
    courseDuration: [
      {
        duration: "", // Initial empty value
        durationUnit: "days", // Default unit
        startDate: "",
        endDate: "",
      },
    ],
    description: "",
    feeAmount: "",
    feeType: "full_course",
    days: [],
    timeSlots: [{ from: "", to: "" }],
    location: [{ address: "", city: "", phoneNumber: "", link: "" }],
    courseType: "",
    images: [],
    promoted: false,
    ageGroup: { ageStart: "", ageEnd: "" },
    preferredGender: "Any",
  });

  useEffect(() => {
    if (courseId) {
      console.log("Received ID:", courseId); // Log the ID
      handleSearch(courseId); // Call handleSearch with the id
    }
  }, [courseId]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSearch = async (courseId) => {
    setLoading(true);
    console.log("Searching for course ID:", courseId); // Log the courseId
    try {
      // Fetch the course data from the server
      const response = await axios.get(`http://localhost:5001/api/courses/course/${courseId}`);

      if (response.data) {
        // Assuming response.data contains course data and courseDuration
        setCourseData(response.data);

        // If courseDuration exists, initialize it; otherwise, set a default value
        const courseDuration = response.data.courseDuration || [
          {
            duration: "",
            durationUnit: "days",
            startDate: "",
            endDate: "",
          },
        ];

        setFormData({
          providerId: response.data.providerId,
          name: response.data.name,
          duration: response.data.duration,
          durationUnit: response.data.durationUnit,
          startDate: response.data.startDate,
          endDate: response.data.endDate,
          description: response.data.description,
          feeAmount: response.data.feeAmount,
          feeType: response.data.feeType,
          days: response.data.days,
          timeSlots: response.data.timeSlots,
          location: response.data.location,
          courseType: response.data.courseType,
          images: response.data.images || [],
          promoted: response.data.promoted,
          ageGroup: response.data.ageGroup,
          preferredGender: response.data.preferredGender,
          courseDuration: courseDuration, // Ensure courseDuration is always set
        });

        setSearchError(""); // Reset search error if course found
        setError(""); // Reset any other errors
        setIsEditMode(false); // Disable editing mode

        console.log("Course images:", response.data.images);
      } else {
        setSearchError("Course not found."); // If no course found
        setCourseData(null); // Reset course data
      }
      setLoading(false); // Stop loading indicator
    } catch (error) {
      // Handle error gracefully
      console.error("Error fetching course:", error); // Log the error for debugging
      setSearchError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
      setCourseData(null); // Reset course data on error
      setLoading(false); // Stop loading indicator
    }
  };


  const [charCount, setCharCount] = useState(0);
  const charLimit = 500;

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "description") {
  //     setCharCount(value.length);
  //   }
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "description") {
      setCharCount(value.length);
    }

    if (["duration", "durationUnit", "startDate", "endDate"].includes(name)) {
      const updatedDurations = [...formData.courseDuration];
      updatedDurations[index] = {
        ...updatedDurations[index],
        [name]: value,
      };
      setFormData((prev) => ({
        ...prev,
        courseDuration: updatedDurations,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addDuration = () => {
    setFormData((prev) => ({
      ...prev,
      courseDuration: [
        ...prev.courseDuration,
        { id: Date.now(), duration: "", durationUnit: "days", startDate: "", endDate: "" },
      ],
    }));
  };

  const removeDuration = (id) => {
    const updatedDurations = formData.courseDuration.filter((duration) => duration.id !== id);
    setFormData((prev) => ({
      ...prev,
      courseDuration: updatedDurations,
    }));
  };



  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      days: checked
        ? [...prevState.days, value]
        : prevState.days.filter((day) => day !== value),
    }));
  };

  const handleTimeSlotChange = (index, e) => {
    const { name, value } = e.target;
    const timeSlots = [...formData.timeSlots];
    timeSlots[index] = { ...timeSlots[index], [name]: value };
    setFormData((prevState) => ({ ...prevState, timeSlots }));
  };

  const addTimeSlot = () => {
    setFormData((prevState) => ({
      ...prevState,
      timeSlots: [...prevState.timeSlots, { from: "", to: "" }],
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      timeSlots: prevState.timeSlots.filter((_, i) => i !== index),
    }));
  };

  console.log(formData);
  

  const handleSubmit = async (e) => {
    asetLoading(true);
    e.preventDefault();

   // Debugging: Log formData and courseData
  console.log("formData", formData);
  console.log("courseData", courseData);

    if (isEditMode) {
      // Create an object to hold the modified fields
      const modifiedData = {};

      // Check for each field to see if it's different from the original course data
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== courseData?.[key]) {
          modifiedData[key] = formData[key];
        }
      });

      // Check if there's any modified data before sending the request
      if (Object.keys(modifiedData).length === 0) {
        setError("No changes made to the course data.");
        return;
      }

      try {
        const response = await axios.put(
          `http://localhost:5001/api/courses/update/${courseData._id}`,
          modifiedData // Send only modified data
        );
        setSuccess("Course updated successfully!");
        setError("");
        setIsEditMode(false);
        asetLoading(false);
        // window.location.reload();
      } catch (error) {
        setError(
          error.response
            ? error.response.data.message
            : "An error occurred. Please try again later."
        );
        setSuccess("");
        asetLoading(false);
      }
    }
  };




  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true); // Set loading to true when the request starts
  
  //   // Create the form data object
  //   const formData = new FormData();
  
  //   // Create an object to hold the modified fields
  //   const modifiedData = {}; 
  
  //   // Track if images are updated
  //   let imagesChanged = false;
  
  //   // Loop over formData and check for changes
  //   // Check if any fields are modified
  //   Object.keys(formData).forEach((key) => {
  //     // Example condition: only track non-image fields
  //     if (key !== "images" && formData[key] !== courseData[key]) {
  //       modifiedData[key] = formData[key];
  //     }
  //   });
  
  //   // Check if there are any images and if they are changed
  //   if (formData.images && formData.images.length > 0) {
  //     // If images are updated, add them to modifiedData
  //     modifiedData.images = formData.images;
  //     imagesChanged = true; // Set flag to true if images are changed
  
  //     // Append images to formData
  //     formData.images.forEach((image) => {
  //       formData.append("images", image);
  //     });
  //   }
  
  //   // Add modified course data (excluding images) to formData
  //   formData.append("modifiedData", JSON.stringify(modifiedData));
  
  //   // Check if there's any modified data before sending the request
  //   if (Object.keys(modifiedData).length === 0 && !imagesChanged) {
  //     setError("No changes made to the course data.");
  //     setLoading(false);
  //     return;
  //   }
  
  //   try {
  //     // Send the PUT request with the form data (including images)
  //     const response = await axios.put(
  //       `http://localhost:5001/api/courses/update/${courseData._id}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  
  //     // Handle success
  //     console.log("Course updated successfully:", response.data);
  //     setSuccess("Course updated successfully!");
  //     setError("");
  //     setIsEditMode(false);
  //     setLoading(false);
  //     window.location.reload();
  //   } catch (error) {
  //     // Handle error
  //     setError(
  //       error.response
  //         ? error.response.data.message
  //         : "An error occurred. Please try again later."
  //     );
  //     setSuccess("");
  //     setLoading(false);
  //   }
  // };
  


  const handleDelete = () => {
    setShowConfirmPopup(true);
  };

  const handleConfirmDelete = async () => {
    asetLoading(true);
    try {
      await axios.delete(
        `http://localhost:5001/api/courses/delete/${courseData._id}`
      );
      setCourseData(null);
      setFormData({
        providerId: "",
        name: "",
        courseDuration: [
          {
            duration: "", // Initial empty value
            durationUnit: "days", // Default unit
            startDate: "",
            endDate: "",
          },
        ],
        description: "",
        feeAmount: "",
        feeType: "full_course",
        days: [],
        timeSlots: [{ from: "", to: "" }],
        location: [{ address: "", city: "", phoneNumber: "", link: "" }],
        courseType: "",
        images: [""],
        promoted: false,
        ageGroup: { ageStart: "", ageEnd: "" },
        preferredGender: "Any",
      });
      setShowConfirmPopup(false);
      setSuccess("Course deleted successfully!");
      asetLoading(false);
      window.location.reload();
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
      setSuccess("");
      setShowConfirmPopup(false);
      asetLoading(false);
    }
  };
  const [courseTypes, setCourseTypes] = useState([]);

  // Fetch course categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/course-category/categories"
        );
        setCourseTypes(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCancelDelete = () => {
    setShowConfirmPopup(false);
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  // Handle location changes
  const handleLocationChange = (index, field, value) => {
    const updatedLocation = [...formData.location];
    updatedLocation[index] = {
      ...updatedLocation[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, location: updatedLocation }));
  };

  // Add a new location
  const addLocation = () => {
    setFormData((prev) => ({
      ...prev,
      location: [
        ...prev.location,
        { address: "", city: "", phoneNumber: "", link: "" },
      ],
    }));
  };

  // Remove a location
  const removeLocation = (index) => {
    setFormData((prev) => ({
      ...prev,
      location: prev.location.filter((_, i) => i !== index),
    }));
  };

  const fileInputRef = useRef(null); // Reference for the file input
  // Helper function to convert ArrayBuffer to Base64


  // Function to handle image input change (when files are selected)
  const handleImageChange = (e) => {
    const files = e.target.files;  // Get selected files
    if (files && files.length > 0) {
      // Convert FileList to array and create object URLs for each image
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );

      // Update the formData state with the new images
      setFormData((prevState) => ({
        ...prevState,
        images: [...prevState.images, ...newImages] // Append the new images
      }));
    }
  };

  // Function to trigger file input
  const addImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Simulate click on file input
    }
  };
  // Function to remove an image
  const removeImage = (index) => {
    setFormData((prevState) => {
      const updatedImages = prevState.images.filter(
        (_, imgIndex) => imgIndex !== index
      );
      return { ...prevState, images: updatedImages };
    });
  };

  const getBase64ImageSrc = (base64String) =>
    `data:image/jpeg;base64,${base64String}`;

  const handleAgeGroupChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      ageGroup:
        Array.isArray(prev.ageGroup) && prev.ageGroup.length > 0
          ? prev.ageGroup.map((group, index) =>
            index === 0
              ? { ...group, [name]: value } // Update the first object in the array
              : group
          )
          : [{ [name]: value }], // If ageGroup is empty or not an array, initialize it with an object
    }));
  };

  return (
    <div className="">
      <div className="">
        {loading ? (
          <div
            style={{ marginTop: "15%", marginBottom: "10%" }}
            className="loader-container-edit"
          >
            <div className="loading-dots-edit">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : (
          <>
            {searchError && <p className="error-message">{searchError}</p>}
            {courseData && (
              <form className="add-course-form" onSubmit={handleSubmit}>
                <label htmlFor="name" style={{ color: "black" }}>
                  Course Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Course Name"
                  required
                  disabled={!isEditMode}
                />
                {/* Preferred Gender and Course Type */}
                <div className="form-group add-course-label-group">
                  <label htmlFor="preferredGender">Preferred Gender</label>
                  <label htmlFor="courseType">Course Type</label>
                </div>
                <div className="form-group add-duration-group">
                  <select
                    id="preferredGender"
                    name="preferredGender"
                    value={formData.preferredGender}
                    onChange={handleChange}
                    required
                    disabled={!isEditMode}
                  >
                    <option value="Any">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <select
                    id="courseType"
                    name="courseType"
                    value={formData.courseType}
                    onChange={handleChange}
                    required
                    disabled={!isEditMode}
                  >
                    <option value="">Select Course Type</option>
                    {courseTypes.map((type) => (
                      <option key={type._id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', marginBottom: '20px' }}>
                  <div className="form-group add-duration-label-group">
                    <label htmlFor="startDate">Course Duration</label>
                  </div>
                  {/* Add Another Duration Button */}
                  {formData.courseDuration.length >= 0 && (
                    <div className="form-group add-duration-group">
                      <button
                        className="add-time-slot-btn"
                        type="button"
                        style={{
                          backgroundColor: '#ecedef',
                          fontSize: '12px',
                          color: 'black',
                        }}
                        onClick={addDuration} // Ensure addDuration is defined to handle adding new duration
                      >
                        Add Course Duration +
                      </button>
                    </div>
                  )}
                </div>

                {/* Loop through courseDurations to display each one */}
                {formData.courseDuration.map((duration, index) => (
                  <div key={duration.id} className="course-duration-group">
                    <div className="form-group add-duration-group">
                      <input
                        type="number"
                        id={`duration-${index}`}
                        name="duration"
                        placeholder="Course Duration"
                        value={duration.duration || ""} // Ensure duration value is controlled
                        onChange={(e) => handleChange(e, index)} // Pass index for correct update
                        disabled={!isEditMode}
                      />
                      <select
                        id={`durationUnit-${index}`}
                        name="durationUnit"
                        value={duration.durationUnit || "days"} // Default to "days" if not set
                        onChange={(e) => handleChange(e, index)} // Pass index for correct update
                        disabled={!isEditMode}
                      >
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>

                    <div className="form-group add-duration-label-group">
                      <label htmlFor={`startDate-${index}`}>Start Date</label>
                      <label htmlFor={`endDate-${index}`}>End Date</label>
                    </div>

                    <div className="form-group add-duration-group">
                      <input
                        type="date"
                        id={`startDate-${index}`}
                        name="startDate"
                        value={duration.startDate ? new Date(duration.startDate).toISOString().split("T")[0] : ""}
                        onChange={(e) => handleChange(e, index)} // Pass index for correct update
                        disabled={!isEditMode}
                      />
                      <input
                        type="date"
                        id={`endDate-${index}`}
                        name="endDate"
                        value={duration.endDate ? new Date(duration.endDate).toISOString().split("T")[0] : ""}
                        onChange={(e) => handleChange(e, index)} // Pass index for correct update
                        disabled={!isEditMode}
                      />
                    </div>

                    {/* Remove Button */}
                    <div
                      className="form-group add-duration-group"
                      style={{
                        marginTop: '20px',
                        marginBottom: '20px',
                        float: 'right',
                      }}
                    >
                      <button
                        className="add-time-slot-btn"
                        type="button"
                        style={{
                          borderRadius: '15px',
                          color: 'black',
                        }}
                        onClick={() => removeDuration(duration.id)} // Use id to remove duration
                      >
                        Remove Duration
                      </button>
                    </div>
                  </div>
                ))}



                {/* Display Added Duration List */}
                <div style={{ marginBottom: '20px' }}>
                  <h4>Added Durations:</h4>
                  <ul style={{ marginLeft: '20px' }}>
                    {formData.courseDuration.map((duration, index) => {
                      // Format the startDate and endDate
                      const formattedStartDate = duration.startDate ? new Date(duration.startDate).toLocaleDateString() : 'N/A';
                      const formattedEndDate = duration.endDate ? new Date(duration.endDate).toLocaleDateString() : 'N/A';

                      return (
                        <li key={duration.id}>
                          {duration.duration} {duration.durationUnit} from{" "}
                          {formattedStartDate} to {formattedEndDate}
                        </li>
                      );
                    })}
                  </ul>
                </div>


                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label htmlFor="description">Course Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={!isEditMode}
                    maxLength={charLimit}
                  />
                  <p
                    style={{
                      fontSize: "smaller",
                      marginBottom: "20px",
                      marginLeft: "10px",
                      color: "black",
                    }}
                  >
                    {charCount}/{charLimit} characters
                  </p>
                </div>
                <div className="form-group">
                  <label>Fee Structure</label>
                  <div className="fee-structure">
                    <input
                      type="number"
                      id="feeAmount"
                      name="feeAmount"
                      value={formData.feeAmount}
                      onChange={handleChange}
                      placeholder="Amount"
                      disabled={!isEditMode}
                    />
                    <span className="currency-symbol">QAR</span>
                    <select
                      id="feeType"
                      name="feeType"
                      value={formData.feeType}
                      onChange={handleChange}
                      disabled={!isEditMode}
                    >
                      <option value="full_course">Full Course</option>
                      <option value="per_month">Per Month</option>
                      <option value="per_week">Per Week</option>
                      <option value="per_class">Per Class</option>
                    </select>
                  </div>
                </div>
                <label
                  style={{ color: "black" }}
                  className="selecet-days-label"
                >
                  Select Days:
                </label>
                <div className="form-group add-days-group">
                  <div className="days-selection">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <label key={day} className="day-checkbox">
                          <input
                            type="checkbox"
                            value={day}
                            checked={formData.days.includes(day)}
                            onChange={handleDayChange}
                            className="days-checkbox"
                            disabled={!isEditMode}
                          />
                          {day}
                        </label>
                      )
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <div className="btn-grpp">
                    <label>Time Slots:</label>
                    <button
                      disabled={!isEditMode}
                      type="button"
                      className="add-time-slot-btn"
                      onClick={addTimeSlot}
                    >
                      Add Time Slot
                    </button>
                  </div>
                  {formData.timeSlots.map((slot, index) => (
                    <div key={index} className="time-slot">
                      <input
                        type="time"
                        name="from"
                        value={slot.from}
                        onChange={(e) => handleTimeSlotChange(index, e)}
                        disabled={!isEditMode}
                      />
                      <span>to</span>
                      <input
                        type="time"
                        name="to"
                        value={slot.to}
                        onChange={(e) => handleTimeSlotChange(index, e)}
                        disabled={!isEditMode}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          className="rem-button"
                          onClick={() => removeTimeSlot(index)}
                          disabled={!isEditMode}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {/* Age Group */}
                <div className="form-group add-course-label-group">
                  <label htmlFor="ageStart">Age Group Start</label>
                  <label htmlFor="ageEnd">Age Group End</label>
                </div>
                <div className="form-group add-duration-group">
                  <input
                    type="date"
                    id="ageStart"
                    name="ageStart"
                    placeholder="Start Age"
                    value={
                      formData.ageGroup && formData.ageGroup[0]?.ageStart
                        ? new Date(formData.ageGroup[0].ageStart)
                          .toISOString()
                          .split("T")[0]
                        : ""
                    }
                    onChange={handleAgeGroupChange}
                    required
                    disabled={!isEditMode}
                  />
                  <input
                    type="date"
                    id="ageEnd"
                    name="ageEnd"
                    placeholder="End Age"
                    value={
                      formData.ageGroup && formData.ageGroup[0]?.ageEnd
                        ? new Date(formData.ageGroup[0].ageEnd)
                          .toISOString()
                          .split("T")[0]
                        : ""
                    }
                    onChange={handleAgeGroupChange}
                    required
                    disabled={!isEditMode}
                  />
                </div>
                <div className="form-group">
                  <div className="btn-grpp">
                    <label>Locations:</label>
                    <button
                      type="button"
                      className="add-time-slot-btn"
                      onClick={addLocation}
                      disabled={!isEditMode}
                    >
                      Add Location
                    </button>
                  </div>
                  <div className="form-group add-location-label-group">
                    <label>Location/Area to be displayed</label>
                    <label htmlFor="ageStart">Municipality</label>
                    <label htmlFor="ageEnd">Phone No.</label>
                  </div>
                  {formData.location.map((loc, index) => (
                    <div
                      key={index}
                      className="time-slot"
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      {/* Address input */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                          }}
                        >
                          <input
                            type="text"
                            name="address"
                            value={loc.address}
                            placeholder={
                              index === 0 ? "Area" : `Area ${index + 1}`
                            }
                            onChange={(e) =>
                              handleLocationChange(
                                index,
                                "address",
                                e.target.value
                              )
                            }
                            style={{ width: "30%" }}
                            required
                            disabled={!isEditMode}
                          />
                          <select
                            name="city"
                            value={loc.city}
                            onChange={(e) =>
                              handleLocationChange(
                                index,
                                "city",
                                e.target.value
                              )
                            }
                            style={{ width: "33%" }}
                          >
                            <option value="Doha">Doha</option>
                            <option value="Al Rayyan">Al Rayyan</option>
                            <option value="Al Wakrah">Al Wakrah</option>
                            <option value="Al Shamal">Al Shamal</option>
                            <option value="Al Khor">Al Khor</option>
                            <option value="Umm Salal">Umm Salal</option>
                            <option value="Al Daayen">Al Daayen</option>
                            <option value="Al Shahaniya">Al Shahaniya</option>
                            <option value="Dukhan">Dukhan</option>
                            <option value="Mesaieed">Mesaieed</option>
                          </select>

                          {/* Phone Number input */}
                          <input
                            type="text"
                            name="phoneNumber"
                            value={loc.phoneNumber}
                            placeholder={
                              index === 0
                                ? "Phone Number"
                                : `Phone Number ${index + 1}`
                            }
                            onChange={(e) =>
                              handleLocationChange(
                                index,
                                "phoneNumber",
                                e.target.value
                              )
                            }
                            style={{ width: "30%" }}
                            required
                            disabled={!isEditMode}
                          />
                        </div>
                        {/* Remove Location Button */}
                        {index > 0 && (
                          <button
                            type="button"
                            className="rem-button"
                            onClick={() => removeLocation(index)}
                            disabled={!isEditMode}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        name="link"
                        value={loc.link}
                        placeholder={
                          index === 0
                            ? "Map Link to location"
                            : `Map Link to location ${index + 1}`
                        }
                        onChange={(e) =>
                          handleLocationChange(index, "link", e.target.value)
                        }
                        style={{ width: "100%" }}
                        required
                        disabled={!isEditMode}
                      />
                    </div>
                  ))}
                </div>

                {/* images */}
                <div className="form-group">
                  <div className="btn-grpp">
                    <label>
                      Course Images{" "}
                      <span style={{ fontSize: ".8rem", color: "grey" }}>
                        [ size: 1280 X 1028 ]
                      </span>
                      :
                    </label>
                    <button type="button" className="add-time-slot-btn" onClick={addImage}>
                      Add Images
                    </button>
                    {/* Hidden file input field triggered by the button */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept=".png, .jpg, .jpeg"
                      multiple
                      style={{ display: "none" }} // Hide the input field
                    />
                  </div>

                  {/* Render the list of images */}
                  {formData.images.map((img, index) => (
                    <div key={index} className="time-slot">
                      {/* If the image is a file, use object URL to display the image */}
                      <img
                        src={img} // Create a URL for the file object
                        alt={`Course Image ${index + 1}`}
                        width="100"
                      />
                      <button
                        type="button"
                        className="rem-button"
                        onClick={() => removeImage(index)} // Remove image button
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                {/* Action Buttons */}

                <div className="button-container">
                  {!isEditMode ? (
                    <>
                      <></>
                      <button
                        style={{ backgroundColor: "black" }}
                        type="button"
                        onClick={() => setIsEditMode(true)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        type="button"
                        className="delete-course-button"
                        onClick={handleDelete}
                        style={{ backgroundColor: "black" }}
                      >
                        <FaTrash /> Delete
                      </button>
                    </>
                  ) : (
                    <button style={{ backgroundColor: "black" }} type="submit">
                      Save
                    </button>
                  )}
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
              </form>
            )}
          </>
        )}
      </div>
      {aloading && (
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
      {showConfirmPopup && (
        <div className="confirm-popup">
          <div className="confirm-popup-content">
            <p>Are you sure you want to delete this course?</p>
            <button onClick={handleConfirmDelete}>Yes</button>
            <button onClick={handleCancelDelete}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditCourseForm1;
