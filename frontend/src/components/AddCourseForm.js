import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import "./AddCourseForm.css";

function AddCourseForm({ providerId }) {
  const initialCourseState = {
    providerId: providerId,
    name: "",
    courseDuration: [
      { id: Date.now(), duration: "", durationUnit: "days", startDate: "", endDate: "", noOfSessions: "", fee: "" },
    ],
    faq: [
      { question: "", answer: "" },
    ],
    description: "",
    thingstokeepinmind: [{
      desc: ""
    }],
    // feeAmount: "",
    // feeType: "full_course",
    days: [],
    timeSlots: [{ from: "", to: "" }],
    location: [{
      address: "", city: "", phoneNumber: "", link: "", lat: "", lon: "",
    }],
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
  const [suggestions, setSuggestions] = useState([]);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null }); // To store latitude and longitude
  const [loadingList, setLoadingList] = useState([]);

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
    if (name === "description" || name === "thingstokeepinmind") {
      setCharCount(value.length);
    }

    // If we're working with course duration (dynamically generated fields)
    if (name === "duration" || name === "durationUnit" || name === "startDate" || name === "endDate" || name === "noOfSessions" || name === "fee") {
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
        { id: Date.now(), duration: "", durationUnit: "days", startDate: "", endDate: "", noOfSessions: "", fee: "" },
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
    setCourse((prevCourse) => {
      const updatedLocations = [...prevCourse.location];
      updatedLocations[index] = {
        ...updatedLocations[index], // Preserve other fields
        [field]: value, // Update only the specific field (e.g., address, lat, lon)
      };

      // Log the updated locations to the console
      console.log("Updated Locations:", updatedLocations);

      return { ...prevCourse, location: updatedLocations };
    });
  };

  const addLocation = () => {
    const newLocation = {
      address: "",
      city: "",
      phoneNumber: "",
      link: "",
      lat: "",  // Default value
      lon: "",  // Default value
    };

    setCourse((prev) => ({
      ...prev,
      location: [...prev.location, newLocation],
    }));
  };

  const removeLocation = (index) => {
    setCourse((prev) => ({
      ...prev,
      location: prev.location.filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      images: [...prevCourse.images, ""],
    }));
  };

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

  const removeImage = (index) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      images: prevCourse.images.filter((_, i) => i !== index),
    }));
  };

  const getCoordinates = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1`;

    try {
      const response = await axios.get(url);
      if (response.data.length > 0) {
        const location = response.data[0];
        return {
          lat: location.lat,
          lon: location.lon,
        };
      } else {
        throw new Error('Address not found');
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleAddressChange = async (value, index) => {
    setAddress(value);
    handleLocationChange(index, 'address', value);

    // Update the loading state for this particular index
    setLoadingList((prevLoading) => {
      const newLoading = [...prevLoading];
      newLoading[index] = true;  // Set loading to true for this location
      return newLoading;
    });

    if (value.length > 2) { // Start suggesting after 3 characters
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1&limit=5`
        );

        // Update the suggestions for the current index
        setSuggestions((prevSuggestions) => {
          const newSuggestions = [...prevSuggestions];
          newSuggestions[index] = response.data;  // Update the suggestions for the specific location
          return newSuggestions;
        });
      } catch (error) {
        console.error("Error fetching address suggestions", error);
      } finally {
        // Update loading state after the request completes
        setLoadingList((prevLoading) => {
          const newLoading = [...prevLoading];
          newLoading[index] = false;  // Set loading to false after the request is done
          return newLoading;
        });
      }
    } else {
      setSuggestions((prevSuggestions) => {
        const newSuggestions = [...prevSuggestions];
        newSuggestions[index] = [];  // Clear the suggestions for the current location
        return newSuggestions;
      });
    }
  };

  const handleSelectAddress = async (selectedAddress, index) => {
    setAddress(selectedAddress.display_name);
    handleLocationChange(index, 'address', selectedAddress.display_name);

    const coordinates = await getCoordinates(selectedAddress.display_name);
    if (coordinates) {
      handleLocationChange(index, 'lat', coordinates.lat);
      handleLocationChange(index, 'lon', coordinates.lon);
      setCoordinates({ lat: coordinates.lat, lon: coordinates.lon }); // Update state with the coordinates
    }

    setSuggestions([]); // Clear suggestions after selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (course.thingstokeepinmind.length < 4) {
      setError("A minimum of 4 datas are required.");
      setIsLoading(false);  // Stop loading
      return;  // Prevent form submission
    }


    // Validate FAQ length and empty fields (question and answer must not be empty)
    if (course.faq.length < 4) {
      setError("A minimum of 4 FAQs (questions and answers) are required.");
      setIsLoading(false);  // Stop loading
      return;  // Prevent form submission
    }

    // Filter out empty FAQs
    const cleanedFaq = course.faq.filter(
      (item) => item.question.trim() && item.answer.trim()
    );

    // Check if there are any empty FAQs after cleaning
    if (cleanedFaq.length !== course.faq.length) {
      setError("Please fill in all FAQ fields (both question and answer).");
      setIsLoading(false);  // Stop loading
      return;  // Prevent form submission
    }

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
        formData.append(`courseDuration[${index}][noOfSessions]`, duration.noOfSessions);
        formData.append(`courseDuration[${index}][fee]`, duration.fee);
      });

      console.log('Course Durations before submitting: ', course.courseDuration);
      // Append other course data
      formData.append("description", course.description);
      formData.append("promoted", course.promoted);
      formData.append("courseType", course.courseType);
      formData.append("preferredGender", course.preferredGender);

      // Append timeSlots as a JSON string
      formData.append("timeSlots", JSON.stringify(course.timeSlots));

      // Append days and locations as arrays
      course.days.forEach((day) => formData.append("days[]", day));

      // Assuming you already have a coordinates state that holds lat/lng values
      const validatedLocations = course.location.map((loc, index) => {
        return {
          address: loc.address || "", // Ensure address is set
          city: loc.city || "", // Ensure city is set
          phoneNumber: loc.phoneNumber || "", // Ensure phoneNumber is set
          link: loc.link || "", // Ensure link is set
          lat: loc.lat || coordinates.lat, // Default lat to coordinates if not provided
          lon: loc.lon || coordinates.lon, // Default lon  to coordinates if not provided
        };
      });

      console.log("Validated Locations:", validatedLocations);

      // Append location array as a JSON string
      formData.append("location", JSON.stringify(validatedLocations));

      // Append courseDurations as a stringified array
      formData.append("courseDurations", JSON.stringify(course.courseDuration));

      formData.append("ageGroup", JSON.stringify(course.ageGroup));


      //Append the faq 
      course.faq.forEach((item, index) => {
        formData.append(`faq[${index}][question]`, item.question);
        formData.append(`faq[${index}][answer]`, item.answer);
      })

      //Append the thingstokeepinmind
      course.thingstokeepinmind.forEach((item, index) => {
        formData.append(`thingstokeepinmind[${index}][desc]`, item.desc);
      })


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
      // window.location.reload(); // Reload page after success
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

  const MAX_FAQ_LIMIT = 6;  // Set the maximum number of FAQs
  const MIN_FAQ_LIMIT = 4;  // Set the minimum number of FAQs (optional, can be 0 if no lower limit)


  const handleFaqChange = (index, e) => {
    const { name, value } = e.target;

    // Update FAQ field dynamically based on field name (question or answer)
    const updatedFaqList = [...course.faq];
    updatedFaqList[index][name] = value;

    // Set the updated FAQ list in state
    setCourse({
      ...course,
      faq: updatedFaqList,
    });

    // Check if the current FAQ has empty fields
    if (value.trim() === "") {
      setError("FAQ question and answer cannot be empty.");
    } else {
      setError(""); // Clear any error if fields are filled
    }
  };

  const handleAddFaq = () => {
    if (course.faq.length < MAX_FAQ_LIMIT) {
      // Only add a new FAQ if it's under the max limit
      setCourse({
        ...course,
        faq: [
          ...course.faq,
          { question: "", answer: "" }, // Add a new FAQ object with empty fields
        ],
      });
    } else {
      // Optional: alert or show an error message if the max FAQ limit is reached
      alert(`You can only add up to ${MAX_FAQ_LIMIT} FAQs.`);
    }
  };

  const handleRemoveFaq = (index) => {
    if (course.faq.length > MIN_FAQ_LIMIT) {
      const updatedFaqList = [...course.faq];
      updatedFaqList.splice(index, 1); // Remove the FAQ at the given index
      setCourse({
        ...course,
        faq: updatedFaqList,
      });
    } else {
      // Optional: alert or show an error message if the min FAQ limit is reached
      alert(`You must have at least ${MIN_FAQ_LIMIT} FAQ.`);
    }
  };

  const handleThingstoMindChange = (index, e) => {
    const { name, value } = e.target;

    // Update FAQ field dynamically based on field name (question or answer)
    const updatedList = [...course.thingstokeepinmind];
    updatedList[index][name] = value;

    // Set the updated FAQ list in state
    setCourse({
      ...course,
      thingstokeepinmind: updatedList,
    });

    // Check if the current FAQ has empty fields
    if (value.trim() === "") {
      setError("FAQ question and answer cannot be empty.");
    } else {
      setError(""); // Clear any error if fields are filled
    }
  };

  const handleAddThingsToMind = () => {
    if (course.thingstokeepinmind.length < MAX_FAQ_LIMIT) {
      // Only add a new FAQ if it's under the max limit
      setCourse({
        ...course,
        thingstokeepinmind: [
          ...course.thingstokeepinmind,
          { desc: "" }, // Add a new  object with empty fields
        ],
      });
    } else {
      // Optional: alert or show an error message if the max FAQ limit is reached
      alert(`You can only add up to ${MAX_FAQ_LIMIT} FAQs.`);
    }
  };

  const handleRemoveThingstoMind = (index) => {
    if (course.thingstokeepinmind.length > MIN_FAQ_LIMIT) {
      const updatedList = [...course.thingstokeepinmind];
      updatedList.splice(index, 1); // Remove the FAQ at the given index
      setCourse({
        ...course,
        thingstokeepinmind: updatedList,
      });
    } else {
      // Optional: alert or show an error message if the min FAQ limit is reached
      alert(`You must have at least ${MIN_FAQ_LIMIT} FAQ.`);
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
          <div className="form-group add-course-label-group">
            <label htmlFor={`duration`}>Course Duration</label>
          </div>
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
            <div className="form-group add-duration-label-group">
              <label htmlFor={`noOfSessions-${index}`}>No of sessions</label>
              <label htmlFor={`fee-${index}`}>Fee</label>
            </div>
            <div className="form-group add-duration-group">
              <input
                type="number"
                id={`noOfSessions-${index}`}
                name="noOfSessions"
                placeholder="No of sessions"
                value={duration.noOfSessions}
                onChange={(e) => handleChange(e, index)}
              />

              <input
                type="number"
                id={`fee-${index}`}
                name="fee"
                placeholder="fee"
                value={duration.fee}
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

        {/* <div className="form-group">
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
        </div> */}
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
              <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "row", width: "100%", gap: "1rem" }}>

                  {/* Address Field */}
                  <div style={{ position: "relative", flex: 1 }}>
                    <input
                      type="text"
                      name="address"
                      value={loc.address}
                      placeholder={index === 0 ? "Area" : `Area ${index + 1}`}
                      onChange={(e) => handleAddressChange(e.target.value, index)}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        boxSizing: "border-box",
                      }}
                      required
                    />
                    {loadingList[index] && <div>Loading...</div>} {/* Only show loading for the specific index */}

                    {/* Address Suggestions */}
                    {suggestions[index] && suggestions[index].length > 0 && (
                      <ul
                        style={{
                          position: "absolute",
                          zIndex: 10,
                          width: "100%",
                          background: "white",
                          border: "1px solid #ccc",
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        {suggestions[index].map((suggestion, idx) => (
                          <li
                            key={idx}
                            style={{ padding: "5px", cursor: "pointer" }}
                            onClick={() => handleSelectAddress(suggestion, index)}
                          >
                            {suggestion.display_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* City Dropdown */}
                  <div style={{ flex: 1 }}>
                    <select
                      name="city"
                      value={loc.city}
                      onChange={(e) => handleLocationChange(index, "city", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        boxSizing: "border-box",
                      }}
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
                  </div>

                  {/* Phone Number Field */}
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={loc.phoneNumber}
                      placeholder={index === 0 ? "Phone Number" : `Phone Number ${index + 1}`}
                      onChange={(e) => handleLocationChange(index, "phoneNumber", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        boxSizing: "border-box",
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Remove Button */}
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

              {/* Map Link Field */}
              <input
                type="text"
                name="link"
                value={loc.link}
                placeholder={index === 0 ? "Map Link to location" : `Map Link to location ${index + 1}`}
                onChange={(e) => handleLocationChange(index, "link", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>
          ))}
        </div>

        <div className="form-group" >
          <div className="btn-grpp">
            <label>Things to keep in mind:<span style={{color:'gray',fontSize:'12px'}}> [Required minimum 4]</span></label>
            <button className="add-time-slot-btn" onClick={handleAddThingsToMind} disabled={course.thingstokeepinmind.length >= MAX_FAQ_LIMIT}>
              Add
            </button>
          </div>


          {/* Render the FAQ inputs */}
          {course.thingstokeepinmind.map((thingstokeepinmind, index) => (
            <div key={index}>
              <input
                type="text"
                name="desc"
                value={thingstokeepinmind.desc}
                onChange={(e) => handleThingstoMindChange(index, e)}
                placeholder="Enter your data"

              />
              <button style={{ float: 'right' }} className="add-time-slot-btn" onClick={() => handleRemoveThingstoMind(index)}>Remove</button>
            </div>
          ))}
        </div>


        <div className="form-group" >
          <div className="btn-grpp">
            <label>Add FAQS:<span style={{color:'gray',fontSize:'12px'}}> [Required minimum 4]</span> </label>
            <button className="add-time-slot-btn" onClick={handleAddFaq} disabled={course.faq.length >= MAX_FAQ_LIMIT}>
              Add FAQ
            </button>
          </div>


          {/* Render the FAQ inputs */}
          {course.faq.map((faq, index) => (
            <div key={index}>
              <input
                type="text"
                name="question"
                value={faq.question}
                onChange={(e) => handleFaqChange(index, e)}
                placeholder="Enter your question"
              />
              <input
                type="text"
                name="answer"
                value={faq.answer}
                onChange={(e) => handleFaqChange(index, e)}
                placeholder="Enter your answer"
              />
              <button style={{ float: 'right' }} className="add-time-slot-btn" onClick={() => handleRemoveFaq(index)}>Remove FAQ</button>
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
