import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import "./AddCourseForm.css";

function AddCourseForm({ providerId }) {
  const initialCourseState = {
    providerId: providerId,
    name: "",
    courseDuration: [
      { id: Date.now(), duration: "", durationUnit: "days", startDate: "", endDate: "" },
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
          "http://localhost:5001/api/course-category/categories"
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

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    // If name is "description", update charCount (for static fields like description)
    if (name === "description") {
      setCharCount(value.length);
    }

    // If we're working with course duration (dynamically generated fields)
    if (name === "duration" || name === "durationUnit" || name === "startDate" || name === "endDate") {
      const updatedDurations = [...course.courseDuration];
      updatedDurations[index][name] = value; // Update the correct field for the specific index
      setCourse({
        ...course,
        courseDuration: updatedDurations,
      });
    } else {
      // For other static fields (like name, description, etc.)
      setCourse((prev) => ({ ...prev, [name]: value }));
    }
  };
  // Add a new duration entry
  const addDuration = () => {
    setCourse({
      ...course,
      courseDuration: [
        ...course.courseDuration,
        { id: Date.now(), duration: "", durationUnit: "days", startDate: "", endDate: "" },
      ],
    });
  };

  // Remove a specific duration entry
  const removeDuration = (id) => {
    const updatedDurations = course.courseDuration.filter(
      (duration) => duration.id !== id  // Filter out the duration with the matching id
    );
    setCourse({
      ...course,
      courseDuration: updatedDurations, // Update state with the filtered durations
    });
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     const formData = new FormData();

  //     // Append all course data to the formData object
  //     formData.append("providerId", course.providerId);
  //     formData.append("name", course.name);
  //     // Append the courseDurations to formData
  //     course.courseDurations.forEach((duration, index) => {
  //       formData.append(`courseDurations[${index}][duration]`, duration.duration);
  //       formData.append(`courseDurations[${index}][durationUnit]`, duration.durationUnit);
  //       formData.append(`courseDurations[${index}][startDate]`, duration.startDate);
  //       formData.append(`courseDurations[${index}][endDate]`, duration.endDate);
  //     });
  //     formData.append("description", course.description);
  //     formData.append("feeAmount", course.feeAmount);
  //     formData.append("feeType", course.feeType);
  //     formData.append("promoted", course.promoted);
  //     formData.append("courseType", course.courseType);
  //     formData.append("preferredGender", course.preferredGender); // Append the new field

  //     // Append each timeSlot as a JSON string
  //     formData.append("timeSlots", JSON.stringify(course.timeSlots));

  //     // Append days and locations as arrays
  //     course.days.forEach((day) => formData.append("days[]", day));
  //     const validatedLocations = course.location.map((loc) => ({
  //       address: loc.address || "",
  //       city: loc.city || "",
  //       phoneNumber: loc.phoneNumber || "",
  //       link: loc.link || "",
  //     }));

  //     // Append location array as a JSON string
  //     formData.append("location", JSON.stringify(validatedLocations));
  //     formData.append("ageGroup", JSON.stringify(course.ageGroup));
  //     // Append each image file (File object)
  //     course.images.forEach((image) => {
  //       if (image) {
  //         formData.append("academyImg", image); // Send file object directly
  //       }
  //     });

  //     const response = await axios.post(
  //       "http://localhost:5001/api/courses/addcourse",
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );

  //     console.log("Course added successfully", response.data);
  //     setCourse(initialCourseState);
  //     setSuccess("Course added successfully!");
  //     setError("");
  //     setIsLoading(false); // Stop loading after fetch
  //     window.location.reload();
  //   } catch (error) {
  //     console.error(
  //       "Error adding course. Check if all fields are filled",
  //       error
  //     );
  //     if (error.response) {
  //       setError(error.response.data.message);
  //     } else {
  //       setError("An error occurred. Please try again later.");
  //     }
  //     setSuccess("");
  //     setIsLoading(false); // Stop loading after fetch
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
  
      // Append all course data to the formData object
      formData.append("providerId", course.providerId);
      formData.append("name", course.name);
  
      // Append the courseDurations to formData
      course.courseDuration.forEach((duration, index) => {
        formData.append(`courseDuration[${index}][id]`, duration.id); // Add the 'id' field
        formData.append(`courseDuration[${index}][duration]`, duration.duration);
        formData.append(`courseDuration[${index}][durationUnit]`, duration.durationUnit);
  
        // Convert startDate and endDate to ISO format (UTC)
        const startDate = new Date(duration.startDate).toISOString();
        const endDate = new Date(duration.endDate).toISOString();
  
        formData.append(`courseDuration[${index}][startDate]`, startDate);
        formData.append(`courseDuration[${index}][endDate]`, endDate);

        // formData.append(`courseDurations[${index}][startDate]`, duration.startDate);
        // formData.append(`courseDurations[${index}][endDate]`, duration.endDate);

      });
  
      console.log('Course Durations before submitting: ',course.courseDurations);
      
      // Append other course data
      formData.append("description", course.description);
      formData.append("feeAmount", course.feeAmount);
      formData.append("feeType", course.feeType);
      formData.append("promoted", course.promoted);
      formData.append("courseType", course.courseType);
      formData.append("preferredGender", course.preferredGender); 
  
      // Append timeSlots as a JSON string
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
  
      // Append courseDurations as a stringified array
      formData.append("courseDurations", JSON.stringify(course.courseDuration));
  
      formData.append("ageGroup", JSON.stringify(course.ageGroup));
  
      // Append each image file (File object)
      course.images.forEach((image) => {
        if (image) {
          formData.append("academyImg", image); // Send file object directly
        }
      });
  
      // Make the POST request
      const response = await axios.post(
        "http://localhost:5001/api/courses/addcourse",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      console.log("Course added successfully", response.data);
      setCourse(initialCourseState); // Reset the form state
      setSuccess("Course added successfully!");
      setError(""); // Clear error messages
      setIsLoading(false); // Stop loading after fetch
      window.location.reload(); // Reload page after success
    } catch (error) {
      console.error("Error adding course. Check if all fields are filled", error);
      if (error.response) {
        setError(error.response.data.message); // Display specific error message
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
        `http://localhost:5001/api/users/search?query=${searchQuery}`
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

  console.log(course);


  return (
    <div className="course-addmodal-container">
      <form className="add-course-form" onSubmit={handleSubmit}>
        <label htmlFor="name" style={{ color: "black" }}>
          Course Name
        </label>
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


        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', marginBottom: '20px' }}>
          <h3>Course Duration Form</h3>
          {/* Add Another Duration Button */}
          {course.courseDuration.length >= 0 && (
            <div className="form-group add-duration-group">
              <button
                className="add-time-slot-btn"
                type="button"
                style={{
                  backgroundColor: '#ecedef',
                  fontSize: '12px',
                  color: 'black',

                }}
                onClick={addDuration}
              >
                Add Course Duration +
              </button>
            </div>
          )}
        </div>
        {/* Loop through courseDurations to display each one */}
        {course.courseDuration.map((duration, index) => (
          <div key={duration.id} className="course-duration-group">
            <div className="form-group add-course-label-group">
              <label htmlFor={`duration-${index}`}>Course Duration</label>
            </div>

            <div className="form-group add-duration-group">
              <input
                type="number"
                id={`duration-${index}`}
                name="duration"
                placeholder="Course Duration"
                value={duration.duration}
                onChange={(e) => handleChange(e, index)}
              />
              <select
                id={`durationUnit-${index}`}
                name="durationUnit"
                value={duration.durationUnit}
                onChange={(e) => handleChange(e, index)}
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
                value={duration.startDate}
                onChange={(e) => handleChange(e, index)}
              />
              <input
                type="date"
                id={`endDate-${index}`}
                name="endDate"
                value={duration.endDate}
                onChange={(e) => handleChange(e, index)}
              />
            </div>

            {/* Remove Button */}
            <div
              className="form-group add-duration-group"
              style={{
                marginTop: '20px',
                marginBottom: '20px',
                float: 'right'
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
            {course.courseDuration.map((duration, index) => (
              <li key={duration.id}>
                {duration.duration} {duration.durationUnit} from{" "}
                {duration.startDate} to {duration.endDate}
              </li>
            ))}
          </ul>
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
        <label className="" style={{ color: "black" }}>
          Select Days:
        </label>
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

        <button
          style={{ backgroundColor: "black" }}
          type="submit"
          className="addcourse-submit"
        >
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
