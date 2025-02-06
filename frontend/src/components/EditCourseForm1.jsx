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
  const [suggestions, setSuggestions] = useState([]);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null }); // To store latitude and longitude
  const [loadingList, setLoadingList] = useState([]);
  const [formData, setFormData] = useState({
    providerId: "",
    name: "",
    courseDuration: [
      {
        duration: "", // Initial empty value
        durationUnit: "days", // Default unit
        startDate: "",
        endDate: "",
        noOfSessions: "",
        fee: ""
      },
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
    removedImages: [], // Track removed images
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
      const response = await axios.get(`https://admin.kidgage.com/api/courses/course/${courseId}`);

      if (response.data) {
        // Assuming response.data contains course data and courseDuration
        setCourseData(response.data);

        const thingstokeepinmind = response.data.thingstokeepinmind || [
          {
            desc: ""
          }
        ];

        const mappedthingstokeepinmind = thingstokeepinmind.map((item) => ({
          desc: item.desc || "",
        }));

        const faq = response.data.faq || [
          {
            question: "",
            answer: ""
          }
        ];

        const mappedfaq = faq.map((item) => ({
          question: item.question || "",
          answer: item.answer || "",
        }));

        // If courseDuration exists, initialize it; otherwise, set a default value
        const courseDuration = response.data.courseDuration || [
          {
            duration: "",
            durationUnit: "days",
            startDate: "",
            endDate: "",
            noOfSessions: "", fee: ""
          },
        ];
        const mappedCourseDuration = courseDuration.map((item) => ({
          duration: item.duration || "",
          durationUnit: item.durationUnit || "days", // Default to "days"
          startDate: item.startDate || "",
          endDate: item.endDate || "",
          noOfSessions: item.noOfSessions || "",
          fee: item.fee || "",
        }));

        // Update formData with values from courseDuration
        setFormData({
          providerId: response.data.providerId || "",
          name: response.data.name || "",
          // Assuming courseDuration is an array, use the first item for these values
          courseDuration: mappedCourseDuration,
          faq: mappedfaq,
          thingstokeepinmind: mappedthingstokeepinmind,
          description: response.data.description || "",
          // feeAmount: response.data.feeAmount || "",
          // feeType: response.data.feeType || "full_course", // Default value for feeType
          days: response.data.days || [],
          timeSlots: response.data.timeSlots || [{ from: "", to: "" }], // Default timeSlots value
          location: response.data.location || [{ address: "", city: "", phoneNumber: "", link: "", lat: "", lon: "" }],
          courseType: response.data.courseType || "",
          images: response.data.images || [],
          removedImages: [],
          promoted: response.data.promoted || false,
          ageGroup: response.data.ageGroup || { ageStart: "", ageEnd: "" },
          preferredGender: response.data.preferredGender || "Any",
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
    } catch (error) {
      // Handle error gracefully
      console.error("Error fetching course:", error); // Log the error for debugging
      setSearchError(
        error.response
          ? error.response.data.message
          : "An error occurred. Please try again later."
      );
      setCourseData(null); // Reset course data on error
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  const [charCount, setCharCount] = useState(0);
  const charLimit = 500;
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "description" || name === "thingstokeepinmind") {
      setCharCount(value.length);
    }

    if (["duration", "durationUnit", "startDate", "endDate", "noOfSessions", "fee"].includes(name)) {
      const updatedDurations = [...courseData?.courseDuration];
      updatedDurations[index] = {
        ...updatedDurations[index],
        [name]: value,
      };
      setCourseData((prev) => ({
        ...prev,
        courseDuration: updatedDurations,
      }));
    } else {
      setCourseData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const addDuration = () => {
    setCourseData((prev) => ({
      ...prev,
      courseDuration: [
        ...prev.courseDuration,
        { id: Date.now(), duration: "", durationUnit: "days", startDate: "", endDate: "", noOfSessions: "", fee: "" },
      ],
    }));
  };

  const removeDuration = (id) => {
    const updatedDurations = courseData?.courseDuration.filter((duration) => duration.id !== id);
    setCourseData((prev) => ({
      ...prev,
      courseDuration: updatedDurations,
    }));
  };

  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    setCourseData((prevState) => ({
      ...prevState,
      days: checked
        ? [...prevState.days, value]
        : prevState.days.filter((day) => day !== value),
    }));
  };

  const handleTimeSlotChange = (index, e) => {
    const { name, value } = e.target;
    const timeSlots = [...courseData?.timeSlots];
    timeSlots[index] = { ...timeSlots[index], [name]: value };
    setCourseData((prevState) => ({ ...prevState, timeSlots }));
  };

  const addTimeSlot = () => {
    setCourseData((prevState) => ({
      ...prevState,
      timeSlots: [...prevState.timeSlots, { from: "", to: "" }],
    }));
  };

  const removeTimeSlot = (index) => {
    setCourseData((prevState) => ({
      ...prevState,
      timeSlots: prevState.timeSlots.filter((_, i) => i !== index),
    }));
  };

  const MAX_FAQ_LIMIT = 6;  // Set the maximum number of FAQs
  const MIN_FAQ_LIMIT = 4;  // Set the minimum number of FAQs (optional, can be 0 if no lower limit)

  // Function to handle FAQ changes (same as before)
  const handleFaqChange = (index, e) => {
    const { name, value } = e.target;

    if (name === "question" || name === "answer") {
      const updatedFaqList = [...courseData.faq];
      updatedFaqList[index][name] = value;

      setCourseData({
        ...courseData,
        faq: updatedFaqList,
      });
    } else {
      setCourseData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Function to handle adding a new FAQ entry
  const handleAddFaq = () => {
    if (courseData.faq.length < MAX_FAQ_LIMIT) {
      // Only add a new FAQ if it's under the max limit
      setCourseData({
        ...courseData,
        faq: [
          ...courseData.faq,
          { question: "", answer: "" }, // Add a new FAQ object with empty fields
        ],
      });
    } else {
      // Optional: alert or show an error message if the max FAQ limit is reached
      alert(`You can only add up to ${MAX_FAQ_LIMIT} FAQs.`);
    }
  };

  // Function to handle removing an FAQ entry (if you want to allow removing FAQs)
  const handleRemoveFaq = (index) => {
    if (courseData.faq.length > MIN_FAQ_LIMIT) {
      // const updatedFaqList = [...courseData.faq];
      // updatedFaqList.splice(index, 1); // Remove the FAQ at the given index
      // setCourseData({
      //   ...courseData,
      //   faq: updatedFaqList,
      // });
      setCourseData((prev) => ({
        ...prev,
        faq: prev.faq.filter((_, i) => i !== index),
      }));
    } else {
      // Optional: alert or show an error message if the min FAQ limit is reached
      alert(`You must have at least ${MIN_FAQ_LIMIT} FAQ.`);
    }
  };

  // Function to handle Things to mind changes (same as before)
  const handleThingstoMindChange = (index, e) => {
    const { name, value } = e.target;

    // Update FAQ field dynamically based on field name (question or answer)
    const updatedList = [...courseData.thingstokeepinmind];
    updatedList[index][name] = value;

    // Set the updated FAQ list in state
    setCourseData({
      ...courseData,
      thingstokeepinmind: updatedList,
    });

    // Check if the current FAQ has empty fields
    if (value.trim() === "") {
      setError("FAQ question and answer cannot be empty.");
    } else {
      setError(""); // Clear any error if fields are filled
    }
  };

  // Function to handle adding a new desc entry
  const handleAddThingsToMind = () => {
    if (courseData.thingstokeepinmind.length < MAX_FAQ_LIMIT) {
      // Only add a new FAQ if it's under the max limit
      setCourseData({
        ...courseData,
        thingstokeepinmind: [
          ...courseData.thingstokeepinmind,
          { desc: "" }, // Add a new  object with empty fields
        ],
      });
    } else {
      // Optional: alert or show an error message if the max FAQ limit is reached
      alert(`You can only add up to ${MAX_FAQ_LIMIT} FAQs.`);
    }
  };

  // Function to handle removing an  entry (if you want to allow removing )
  const handleRemoveThingstoMind = (index) => {
    if (courseData.thingstokeepinmind.length > MIN_FAQ_LIMIT) {
      // const updatedList = [...courseData.thingstokeepinmind];
      // updatedList.splice(index, 1); // Remove the FAQ at the given index
      // setCourseData({
      //   ...courseData,
      //   thingstokeepinmind: updatedList,
      // });
      setCourseData((prev) => ({
        ...prev,
        thingstokeepinmind: prev.thingstokeepinmind.filter((_, i) => i !== index),
      }));
    } else {
      // Optional: alert or show an error message if the min FAQ limit is reached
      alert(`You must have at least ${MIN_FAQ_LIMIT} FAQ.`);
    }
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
      handleLocationChange(index, 'latitude', coordinates.lat);
      handleLocationChange(index, 'longitude', coordinates.lon);
      setCoordinates({ lat: coordinates.lat, lon: coordinates.lon }); // Update state with the coordinates
    }

    setSuggestions([]); // Clear suggestions after selection
  };
  // console.log(coordinates);

  const handleSubmit = async (e) => {
    e.preventDefault();
    asetLoading(true);
    if (isEditMode) {

      if (courseData.thingstokeepinmind.length < 4) {
        setError("A minimum of 4 datas are required.");
        asetLoading(false);  // Stop loading
        return;  // Prevent form submission
      }

      //Filter out empty FAQs
      const cleanedData = courseData.thingstokeepinmind.filter(
        (item) => item.desc.trim()
      );

      //Check if there are any empty FAQs after cleaning
      if (cleanedData.length !== courseData.thingstokeepinmind.length) {
        setError("Please fill all data field");
        asetLoading(false);  // Stop loading
        return;  // Prevent form submission
      }

      // Validate FAQ length and empty fields (question and answer must not be empty)
      if (courseData.faq.length < 4) {
        setError("A minimum of 4 FAQs (questions and answers) are required.");
        asetLoading(false);  // Stop loading
        return;  // Prevent form submission
      }

      // Filter out empty FAQs
      const cleanedFaq = courseData.faq.filter(
        (item) => item.question.trim() && item.answer.trim()
      );

      // Check if there are any empty FAQs after cleaning
      if (cleanedFaq.length !== courseData.faq.length) {
        setError("Please fill in all FAQ fields (both question and answer).");
        asetLoading(false);  // Stop loading
        return;  // Prevent form submission
      }
      try {

        const formData = new FormData();
        // Ensure courseData is defined before accessing its properties
        if (!courseData) {
          throw new Error('Course data is undefined');
        }
        // Append all course data to the formData object
        formData.append("providerId", courseData.providerId);
        formData.append("name", courseData.name);

        // Append the courseDurations to formData
        if (Array.isArray(courseData.courseDuration)) {
          courseData.courseDuration.forEach((duration, index) => {
            formData.append(`courseDuration[${index}][id]`, duration.id);
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
        }

        // Append other course data
        formData.append("description", courseData.description);
        formData.append("promoted", courseData.promoted);
        formData.append("courseType", courseData.courseType);
        formData.append("preferredGender", courseData.preferredGender);

        // Append timeSlots as a JSON string
        formData.append("timeSlots", JSON.stringify(courseData.timeSlots));

        // Append days as an array
        if (Array.isArray(courseData.days)) {
          courseData.days.forEach((day) => formData.append("days[]", day));
        }

        const validatedLocations = courseData.location.map((loc, index) => {
          return {
            address: loc.address || "", // Ensure address is set
            city: loc.city || "", // Ensure city is set
            phoneNumber: loc.phoneNumber || "", // Ensure phoneNumber is set
            link: loc.link || "", // Ensure link is set
            lat: loc.lat || coordinates.lat, // Default lat to coordinates if not provided
            lon: loc.lon || coordinates.lon, // Default lng to coordinates if not provided
          };
        });

        console.log("Validated Locations:", validatedLocations);

        // Append location array as a JSON string
        formData.append("location", JSON.stringify(validatedLocations));

        // Append courseDurations as a stringified array
        formData.append("courseDurations", JSON.stringify(courseData.courseDuration));

        // Append ageGroup as a stringified array
        formData.append("ageGroup", JSON.stringify(courseData.ageGroup));

        //Append the faq 
        courseData.faq.forEach((item, index) => {
          formData.append(`faq[${index}][question]`, item.question);
          formData.append(`faq[${index}][answer]`, item.answer);
        })

        // Append things to keep in mind
        courseData.thingstokeepinmind.forEach((item, index) => {
          formData.append(`thingstokeepinmind[${index}][desc]`, item.desc);
        })


        // Append new images
        if (Array.isArray(courseData.images)) {
          courseData.images.forEach((image) => {
            if (image) {
              formData.append("academyImg", image); // Append new images to formData
            }
          });
        }

        // Append removed images
        const removedImages = Array.isArray(courseData.removedImages) ? courseData.removedImages : [];
        console.log("Final removed images:", removedImages);

        removedImages.forEach((image) => {
          formData.append("removedImages", image); // Send removed images to the backend
        });

        // Make the POST request
        const response = await axios.put(
          `https://admin.kidgage.com/api/courses/update/${courseData._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        console.log("Course updated successfully", response.data);
        setCourseData(null); // Reset the form state
        setSuccess("Course updated successfully!");
        setError(""); // Clear error messages
        asetLoading(false); // Stop loading after fetch
        // window.location.reload(); // Reload page after success
      } catch (error) {
        console.error("Error updating course. Check if all fields are filled", error);

        if (error.response) {
          setError(error.response.data.message); // Display specific error message
        } else {
          setError("An error occurred. Please try again later.");
        }

        setSuccess("");
        asetLoading(false); // Stop loading after fetch
      }

    }

  };

  const handleDelete = () => {
    setShowConfirmPopup(true);
  };

  const handleConfirmDelete = async () => {
    asetLoading(true);
    try {
      await axios.delete(
        `https://admin.kidgage.com/api/courses/delete/${courseData._id}`
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
          "https://admin.kidgage.com/api/course-category/categories"
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

  const handleLocationChange = (index, field, value) => {
    setCourseData((prevCourse) => {
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

    setCourseData((prev) => ({
      ...prev,
      location: [...prev.location, newLocation],
    }));
  };
  // Remove a location
  const removeLocation = (index) => {
    setCourseData((prev) => ({
      ...prev,
      location: prev.location.filter((_, i) => i !== index),
    }));
  };

  const fileInputRef = useRef(null); // Reference for the file input


  const handleImageChange = (e) => {
    const files = e.target.files;  // Get selected files
    if (files && files.length > 0) {
      const newImages = Array.from(files);

      // Update the courseData state with the new images
      setCourseData((prevState) => ({
        ...prevState,
        images: [...prevState.images, ...newImages] // Append the new files to the images array
      }));
    }
  };

  // Function to trigger file input
  const addImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Simulate click on file input
    }
  };

  // Function to remove image and store removed image locally
  const removeImage = (index) => {
    setCourseData((prevState) => {
      const updatedRemovedImages = Array.isArray(prevState.removedImages)
        ? prevState.removedImages
        : [];

      const imageToRemove = prevState.images[index];
      if (imageToRemove && !updatedRemovedImages.includes(imageToRemove)) {
        updatedRemovedImages.push(imageToRemove);
      }

      const updatedImages = prevState.images.filter((_, imgIndex) => imgIndex !== index);

      return {
        ...prevState,
        images: updatedImages, // Update images list after removal
        removedImages: updatedRemovedImages, // Update removedImages list
      };
    });
  };

  const handleAgeGroupChange = (e) => {
    const { name, value } = e.target;

    setCourseData((prev) => ({
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
                  value={courseData?.name}
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
                    value={courseData?.preferredGender}
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
                    value={courseData.courseType}
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
                  {courseData?.courseDuration.length >= 0 && (
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
                {courseData.courseDuration.map((duration, index) => (
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
                        disabled={!isEditMode}
                      />

                      <input
                        type="number"
                        id={`fee-${index}`}
                        name="fee"
                        placeholder="fee"
                        value={duration.fee}
                        onChange={(e) => handleChange(e, index)}
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
                    {courseData?.courseDuration.map((duration, index) => {
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
                    value={courseData?.description}
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
                {/* <div className="form-group">
                  <label>Fee Structure</label>
                  <div className="fee-structure">
                    <input
                      type="number"
                      id="feeAmount"
                      name="feeAmount"
                      value={courseData?.feeAmount}
                      onChange={handleChange}
                      placeholder="Amount"
                      disabled={!isEditMode}
                    />
                    <span className="currency-symbol">QAR</span>
                    <select
                      id="feeType"
                      name="feeType"
                      value={courseData?.feeType}
                      onChange={handleChange}
                      disabled={!isEditMode}
                    >
                      <option value="full_course">Full Course</option>
                      <option value="per_month">Per Month</option>
                      <option value="per_week">Per Week</option>
                      <option value="per_class">Per Class</option>
                    </select>
                  </div>
                </div> */}
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
                            checked={courseData?.days.includes(day)}
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
                  {courseData?.timeSlots.map((slot, index) => (
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
                      courseData?.ageGroup && courseData?.ageGroup[0]?.ageStart
                        ? new Date(courseData?.ageGroup[0].ageStart)
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
                      courseData?.ageGroup && courseData?.ageGroup[0]?.ageEnd
                        ? new Date(courseData?.ageGroup[0].ageEnd)
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
                  {courseData.location.map((loc, index) => (
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
                    <label>Things to keep in mind:<span style={{ color: 'gray', fontSize: '12px' }}> [Required minimum 4]</span></label>
                    <button className="add-time-slot-btn" onClick={handleAddThingsToMind} disabled={courseData.thingstokeepinmind.length >= MAX_FAQ_LIMIT || !isEditMode}>
                      Add
                    </button>
                  </div>
                  {/* Render the FAQ inputs */}
                  {courseData.thingstokeepinmind.map((thingstokeepinmind, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        name="desc"
                        value={thingstokeepinmind.desc}
                        onChange={(e) => handleThingstoMindChange(index, e)}
                        placeholder="Enter your data"
                        disabled={!isEditMode}
                      />
                      <button style={{ float: 'right' }} disabled={!isEditMode} className="rem-button" onClick={() => handleRemoveThingstoMind(index)}><FaTrash /></button>
                    </div>
                  ))}
                </div>


                <div className="form-group" >
                  <div className="btn-grpp">
                    <label>Add FAQS:<span style={{ color: 'gray', fontSize: '12px' }}> [Required minimum 4]</span></label>
                    <button className="add-time-slot-btn" onClick={handleAddFaq} disabled={courseData.faq.length >= MAX_FAQ_LIMIT || !isEditMode}>
                      Add FAQ
                    </button>
                  </div>


                  {/* Render the FAQ inputs */}
                  {courseData.faq.map((faq, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        name="question"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(index, e)}
                        placeholder="Enter your question"
                        disabled={!isEditMode}
                      />
                      <input
                        type="text"
                        name="answer"
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(index, e)}
                        placeholder="Enter your answer"
                        disabled={!isEditMode}
                      />
                      <button style={{ float: 'right' }} disabled={!isEditMode} className="rem-button" onClick={() => handleRemoveFaq(index)}><FaTrash /></button>
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
                  {courseData?.images.map((img, index) => (
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
