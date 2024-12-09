import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import "./AddCourseForm.css";

function AddCourseForm({ providerId }) {
  const initialCourseState = {
    providerId: providerId,
    name: "",
    duration: "",
    durationUnit: "days",
    startDate: "",
    endDate: "",
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
    preferredGender: "Any", // Default value can be set as needed
  };
  const [isLoading, setIsLoading] = useState(false); // Manage loading state
  const [course, setCourse] = useState(initialCourseState);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courseTypes, setCourseTypes] = useState([]);

  useEffect(() => {
    const fetchCourseTypes = async () => {
      try {
        const response = await axios.get(
          "https://kidgage-dashboar-newui.onrender.com/api/course-category/categories"
        );
        setCourseTypes(response.data);
      } catch (error) {
        console.error("Error fetching course types", error);
      }
    };

    fetchCourseTypes();
  }, []);

  const [charCount, setCharCount] = useState(0);
  const charLimit = 500;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      setCharCount(value.length);
    }
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    setCourse((prev) => ({
      ...prev,
      days: checked
        ? [...prev.days, value]
        : prev.days.filter((day) => day !== value),
    }));
  };
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 5000); // Hide success message after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [success]);

  const handleTimeSlotChange = (index, e) => {
    const { name, value } = e.target;
    const timeSlots = [...course.timeSlots];
    timeSlots[index] = { ...timeSlots[index], [name]: value };
    setCourse((prev) => ({ ...prev, timeSlots }));
  };

  const addTimeSlot = () => {
    setCourse((prev) => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { from: "", to: "" }],
    }));
  };

  const removeTimeSlot = (index) => {
    setCourse((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index),
    }));
  };

  const handleLocationChange = (index, field, value) => {
    const updatedLocation = [...course.location];
    updatedLocation[index] = {
      ...updatedLocation[index],
      [field]: value,
    };
    setCourse((prev) => ({ ...prev, location: updatedLocation }));
  };

  const addLocation = () => {
    setCourse((prev) => ({ ...prev, location: [...prev.location, ""] }));
  };

  const removeLocation = (index) => {
    setCourse((prev) => ({
      ...prev,
      location: prev.location.filter((_, i) => i !== index),
    }));
  };
  // Function to add a new image input
  const addImage = () => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      images: [...prevCourse.images, ""],
    }));
  };

  // Function to handle the image input change
  const handleImageChange = (index, e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setCourse((prevCourse) => {
        const newImages = [...prevCourse.images];
        newImages[index] = file; // Store the file directly
        return { ...prevCourse, images: newImages };
      });
    }
  };

  // Function to remove an image input
  const removeImage = (index) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      images: prevCourse.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Append all course data to the formData object
      formData.append("providerId", course.providerId);
      formData.append("name", course.name);
      formData.append("duration", course.duration);
      formData.append("durationUnit", course.durationUnit);
      formData.append("startDate", course.startDate);
      formData.append("endDate", course.endDate);
      formData.append("description", course.description);
      formData.append("feeAmount", course.feeAmount);
      formData.append("feeType", course.feeType);
      formData.append("promoted", course.promoted);
      formData.append("courseType", course.courseType);
      formData.append("preferredGender", course.preferredGender); // Append the new field

      // Append each timeSlot as a JSON string
      formData.append("timeSlots", JSON.stringify(course.timeSlots));

      // Append days and locations as arrays
      course.days.forEach((day) => formData.append("days[]", day));
      const validatedLocations = course.location.map((loc) => ({
        address: loc.address || "",
        city: loc.city || "",
        phoneNumber: loc.phoneNumber || "",
        link: loc.link || "",
      }));

      // Append location array as a JSON string
      formData.append("location", JSON.stringify(validatedLocations));
      formData.append("ageGroup", JSON.stringify(course.ageGroup));
      // Append each image file (File object)
      course.images.forEach((image) => {
        if (image) {
          formData.append("academyImg", image); // Send file object directly
        }
      });

      const response = await axios.post(
        "https://kidgage-dashboar-newui.onrender.com/api/courses/addcourse",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Course added successfully", response.data);
      setCourse(initialCourseState);
      setSuccess("Course added successfully!");
      setError("");
      setIsLoading(false); // Stop loading after fetch
      window.location.reload();
    } catch (error) {
      console.error(
        "Error adding course. Check if all fields are filled",
        error
      );
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
      setSuccess("");
      setIsLoading(false); // Stop loading after fetch
    }
  };

  const handleAgeGroupChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({
      ...prev,
      ageGroup: { ...prev.ageGroup, [name]: value || "" }, // Set to empty string if value is undefined
    }));
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://kidgage-dashboar-newui.onrender.com/api/users/search?query=${searchQuery}`
      );
      setSearchResult(response.data);
      setSearchError("");
      setCourse((prev) => ({ ...prev, providerId: response.data._id }));
    } catch (error) {
      setSearchResult(null);
      setSearchError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
    }
  };

  return (

    <div className="course-addmodal-container">

      <form className="add-course-form" onSubmit={handleSubmit}>
        <label htmlFor="name" style={{ color: "black" }}>Course Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Course Name"
          value={course.name}
          onChange={handleChange}
        />
        <div className="form-group add-course-label-group">
          <label htmlFor="preferredGender">Preferred Gender</label>
          <label htmlFor="preferredGender">Course Type</label>
        </div>
        <div className="form-group add-duration-group">
          <select
            id="preferredGender"
            name="preferredGender"
            value={course.preferredGender}
            onChange={handleChange}
            required
          >
            <option value="Any">Any</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select
            id="courseType"
            name="courseType"
            value={course.courseType}
            onChange={handleChange}
            required
          >
            <option value="">Select Course Type</option>
            {courseTypes.map((type) => (
              <option key={type._id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group add-course-label-group">
          <label htmlFor="preferredGender">Course Duration</label>
        </div>
        <div className="form-group add-duration-group">
          <input
            type="number"
            id="duration"
            name="duration"
            placeholder="Course Duration"
            value={course.duration}
            onChange={handleChange}
          />
          <select
            id="durationUnit"
            name="durationUnit"
            value={course.durationUnit}
            onChange={handleChange}
          >
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
        <div className="form-group add-duration-label-group">
          <label htmlFor="startDate">Start Date</label>
          <label htmlFor="endDate">End Date</label>
        </div>
        <div className="form-group add-duration-group">
          <input
            className="start-date-ip"
            type="date"
            id="startDate"
            name="startDate"
            value={course.startDate}
            onChange={handleChange}
          />
          <input
            className="start-date-ip"
            type="date"
            id="endDate"
            name="endDate"
            value={course.endDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Course Description</label>
          <textarea
            id="description"
            name="description"
            value={course.description}
            onChange={handleChange}
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
              value={course.feeAmount}
              onChange={handleChange}
              placeholder="Amount"
            />
            <span className="currency-symbol">QAR</span>
            <select
              id="feeType"
              name="feeType"
              value={course.feeType}
              onChange={handleChange}
            >
              <option value="full_course">Full Course</option>
              <option value="per_month">Per Month</option>
              <option value="per_week">Per Week</option>
              <option value="per_class">Per Class</option>
            </select>
          </div>
        </div>
        <label className="" style={{ color: 'black' }}>Select Days:</label>
        <div className="form-group add-days-group">
          <div className="days-selection">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <label key={day} className="day-checkbox">
                <input
                  type="checkbox"
                  value={day}
                  checked={course.days.includes(day)}
                  onChange={handleDayChange}
                  className="days-checkbox"
                />
                {day}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <div className="btn-grpp">
            <label>Time Slots:</label>
            <button
              type="button"
              className="add-time-slot-btn"
              onClick={addTimeSlot}
            >
              Add Time Slot
            </button>
          </div>
          {course.timeSlots.map((slot, index) => (
            <div key={index} className="time-slot">
              <input
                type="time"
                name="from"
                value={slot.from}
                onChange={(e) => handleTimeSlotChange(index, e)}
              />
              <span>to</span>
              <input
                type="time"
                name="to"
                value={slot.to}
                onChange={(e) => handleTimeSlotChange(index, e)}
              />
              {index > 0 && (
                <button
                  type="button"
                  className="rem-button"
                  onClick={() => removeTimeSlot(index)}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="form-group add-duration-label-group">
          <label htmlFor="ageStart">Age Group Start</label>
          <label htmlFor="ageEnd">Age Group End</label>
        </div>
        <div className="form-group add-duration-group">
          <input
            type="date"
            id="ageStart"
            name="ageStart"
            value={course.ageGroup.ageStart}
            onChange={handleAgeGroupChange}
          />
          <input
            type="date"
            id="ageEnd"
            name="ageEnd"
            value={course.ageGroup.ageEnd}
            onChange={handleAgeGroupChange}
          />
        </div>
        <div className="form-group">
          <div className="btn-grpp">
            <label>Locations:</label>
            <button
              type="button"
              className="add-time-slot-btn"
              onClick={addLocation}
            >
              Add Location
            </button>
          </div>
          <div className="form-group add-location-label-group">
            <label>Location/Area to be displayed</label>
            <label htmlFor="ageStart">Municipality</label>
            <label htmlFor="ageEnd">Phone No.</label>
          </div>
          {course.location.map((loc, index) => (
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
                style={{ display: "flex", flexDirection: "row", width: "100%" }}
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
                    placeholder={index === 0 ? "Area" : `Area ${index + 1}`}
                    onChange={(e) =>
                      handleLocationChange(index, "address", e.target.value)
                    }
                    style={{ width: "33%" }}
                    required
                  />
                  <select
                    name="city"
                    value={loc.city}
                    onChange={(e) =>
                      handleLocationChange(index, "city", e.target.value)
                    }
                    style={{ width: "33%" }}
                  >
                    <option value="">Select A City</option>
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
                      index === 0 ? "Phone Number" : `Phone Number ${index + 1}`
                    }
                    onChange={(e) =>
                      handleLocationChange(index, "phoneNumber", e.target.value)
                    }
                    style={{ width: "36%" }}
                    required
                  />
                </div>
                {/* Remove Location Button */}
                {index > 0 && (
                  <button
                    type="button"
                    className="rem-button"
                    onClick={() => removeLocation(index)}
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
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <div className="btn-grpp">
            <label>
              Course Images
              <span style={{ fontSize: ".8rem", color: "grey" }}>
                [ size: 1280 X 1028 ]
              </span>
              :
            </label>
            <button
              type="button"
              className="add-time-slot-btn"
              onClick={addImage}
            >
              Add Images
            </button>
          </div>
          {course.images.map((img, index) => (
            <div key={index} className="time-slot">
              <input
                type="file"
                name={index === 0 ? "academyImg" : `academyImg-${index}`}
                onChange={(e) => handleImageChange(index, e)}
                accept=".png, .jpg, .jpeg"
              />

              {index > 0 && (
                <button
                  type="button"
                  className="rem-button"
                  onClick={() => removeImage(index)}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>

        <button style={{ backgroundColor: 'black' }} type="submit" className="addcourse-submit">
          Submit
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
      {/* )} */}
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

export default AddCourseForm;
