const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3"); // Import PutObjectCommand from AWS SDK v3
const express = require("express");
const multer = require("multer");
const Course = require("../models/Course");
const s3 = require("../aws-config"); // AWS S3 v3 config
const crypto = require("crypto");
const path = require("path");
const { promisify } = require("util");

// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });


const router = express.Router();

// Generate a random file name
const randomBytes = promisify(crypto.randomBytes);

async function uploadImageToS3(file) {
  try {
    // Generate a unique name for the image
    const rawBytes = await randomBytes(16);
    const imageName =
      rawBytes.toString("hex") + path.extname(file.originalname);

    const params = {
      Bucket: "kidgage", // The bucket name from .env
      Key: imageName, // The unique file name
      Body: file.buffer, // The file buffer
      ContentType: "image/jpeg",
      AWS_REGION: "eu-north-1", // The file type (e.g., image/jpeg)
      // Set the file to be publicly accessible
    };

    const command = new PutObjectCommand(params); // Create PutObjectCommand
    await s3.send(command); // Send the command to S3 to upload the file

    // Construct the public URL of the uploaded image
    const imageUrl = `https://${params.Bucket}.s3.${params.AWS_REGION}.amazonaws.com/${params.Key}`;
    return imageUrl; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
}
// Upload multiple images to S3
async function uploadImagesToS3(files) {
  try {
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        // Generate a unique name for the image
        const rawBytes = await randomBytes(16);
        const imageName =
          rawBytes.toString("hex") + path.extname(file.originalname);

        const params = {
          Bucket: "kidgage", // The bucket name
          Key: imageName, // The unique file name
          Body: file.buffer, // The file buffer
          ContentType: file.mimetype, // The file type
          AWS_REGION: "eu-north-1", // The AWS region
        };

        const command = new PutObjectCommand(params); // Create the PutObjectCommand
        await s3.send(command); // Send the command to S3 to upload the file

        // Construct the public URL of the uploaded image
        return `https://${params.Bucket}.s3.${params.AWS_REGION}.amazonaws.com/${params.Key}`;
      })
    );
    return imageUrls; // Return array of uploaded image URLs
  } catch (error) {
    console.error("Error uploading images to S3:", error);
    throw error;
  }
}

async function deleteImageFromS3(imageUrl) {
  try {
    const urlParts = imageUrl.split("/");
    const key = urlParts[urlParts.length - 1]; // Extract the file name from the URL

    const params = {
      Bucket: "kidgage",
      Key: key,
    };

    const command = new DeleteObjectCommand(params); // Create DeleteObjectCommand
    await s3.send(command); // Send the command to S3 to delete the file
  } catch (error) {
    console.error("Error deleting image from S3:", error);
    throw error;
  }
}

// Add a new course
// router.post("/addcourse", upload.array("academyImg", 10), async (req, res) => {
//   try {
//     const {
//       providerId,
//       name,
//       duration,
//       durationUnit,
//       startDate,
//       endDate,
//       description,
//       feeAmount,
//       feeType,
//       days,
//       timeSlots,
//       location,
//       ageGroup,
//       courseType,
//       promoted,
//       preferredGender,
//     } = req.body;

//     // Ensure the timeSlots are parsed correctly
//     const parsedTimeSlots =
//       typeof timeSlots === "string" ? JSON.parse(timeSlots) : timeSlots;
//     const parsedLocation =
//       typeof location === "string" ? JSON.parse(location) : location;
//     const parsedAge =
//       typeof ageGroup === "string" ? JSON.parse(ageGroup) : ageGroup;

//     // Handle the images
//     const images = req.files ? await uploadImagesToS3(req.files) : [];

//     const newCourse = new Course({
//       providerId,
//       name,
//       duration,
//       durationUnit,
//       startDate,
//       endDate,
//       description,
//       feeAmount,
//       feeType,
//       days,
//       timeSlots: parsedTimeSlots,
//       location: parsedLocation,
//       ageGroup: parsedAge,
//       courseType,
//       images, // Base64 encoded images
//       promoted,
//       preferredGender,
//     });

//     const savedCourse = await newCourse.save();
//     res.status(201).json(savedCourse);
//   } catch (error) {
//     console.error("Error adding course:", error);
//     res
//       .status(500)
//       .json({ message: "Error adding course", error: error.message });
//   }
// });

// Add a new course
// Backend: Ensure the parsedCourseDurations is handled properly

//original code 
router.post("/addcourse", upload.array("academyImg", 10), async (req, res) => {
  try {
    const {
      providerId,
      name,
      description,
      days,
      timeSlots,
      location,
      ageGroup,
      courseType,
      promoted,
      preferredGender,
      courseDuration, // Receiving courseDurations from the frontend
      faq, // Expecting an array of FAQ objects with question and answer fields
      thingstokeepinmind,
    } = req.body;

    console.log("Received courseDurations:", courseDuration);  // Check raw value
    console.log("Received ageGroup:", ageGroup);  // Check raw value
    console.log("faq:", faq);  // Check raw value
    console.log(" thingstokeepinmind:",  thingstokeepinmind);  // Check raw value

    // Ensure courseDurations is parsed correctly if it's a string
    const parsedCourseDurations = typeof courseDuration === "string" ? JSON.parse(courseDuration) : courseDuration;
    console.log("Parsed courseDurations:", parsedCourseDurations);  // Check parsed value

    // Ensure faq is parsed correctly if it's a string
    const parsedFaq = typeof faq === "string" ? JSON.parse(faq) : faq;
    console.log("Parsed faq:", parsedFaq);  // Log the parsed faq value

     // Ensure faq is parsed correctly if it's a string
     const parsedthingstokeepinmind = typeof  thingstokeepinmind === "string" ? JSON.parse( thingstokeepinmind) :  thingstokeepinmind;
     console.log("Parsed faq:", parsedthingstokeepinmind);  // Log the parsed faq value

    // Handle the rest of the course data...
    const newCourse = new Course({
      providerId,
      name,
      description,
      days,
      timeSlots: JSON.parse(timeSlots),
      location: JSON.parse(location),
      ageGroup: JSON.parse(ageGroup),
      courseType,
      images: req.files ? await uploadImagesToS3(req.files) : [],
      promoted,
      preferredGender,
      active: true,
      courseDuration: parsedCourseDurations,  // Save the courseDurations properly
      faq: parsedFaq, // Correctly pass the parsed FAQ array, not a string
      thingstokeepinmind:parsedthingstokeepinmind,
    });

    const savedCourse = await newCourse.save();
    console.log("Saved course:", savedCourse);

    res.status(201).json(savedCourse);  // Return saved course

  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ message: "Error adding course", error: error.message });
  }
});




//for checking

// Function to resolve Google Maps short link and get the full URL
// const resolveGoogleMapsLink = async (shortUrl) => {
//   try {
//     const response = await axios.get(shortUrl, { maxRedirects: 5 });
//     const fullUrl = response.request.res.responseUrl; // The resolved URL
//     console.log("Resolved Full URL:", fullUrl);
//     return fullUrl;
//   } catch (error) {
//     console.error("Error resolving the short URL:", error.message);
//     throw new Error("Failed to resolve the short link");
//   }
// };

// // Function to extract coordinates from the full URL
// const extractCoordinates = (url) => {
//   const urlParts = new URL(url);
//   const query = urlParts.searchParams.get('q');
//   if (query) {
//     const [latitude, longitude] = query.split(',');
//     return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
//   } else {
//     throw new Error("Coordinates not found in the URL");
//   }
// };

// // POST /addcourse route
// router.post("/addcourse", upload.array("academyImg", 10), async (req, res) => {
//   try {
//     const {
//       providerId,
//       name,
//       description,
//       days,
//       timeSlots,
//       location, // Expecting an array of location objects
//       ageGroup,
//       courseType,
//       promoted,
//       preferredGender,
//       courseDuration,
//     } = req.body;

//     console.log("Received courseDurations:", courseDuration);
//     console.log("Received ageGroup:", ageGroup);
//     console.log("Received Location:", location);

//     const parsedCourseDurations = typeof courseDuration === "string" ? JSON.parse(courseDuration) : courseDuration;

//     // Initialize an empty array for the locations
//     let locations = [];

//     // Process each location in the location array
//    // Process each location in the location array
// for (let loc of location) {
//   let { address, city, phoneNumber, link, latitude, longitude } = loc;

//   console.log("Processing location:", loc);

//   // Check if required fields are present
//   if (!address || !city || !phoneNumber) {
//     console.log("Missing address, city, or phone number:", { address, city, phoneNumber });
//     continue; // Skip this location and move to the next one
//   }

//   try {
//     // Check if link is valid and a string
//     if (link && typeof link === 'string' && link.includes("google.com/maps")) {
//       // Resolve the short URL to get the full URL
//       const fullUrl = await resolveGoogleMapsLink(link);
//       const { latitude: lat, longitude: lon } = extractCoordinates(fullUrl);
//       latitude = lat;
//       longitude = lon;
//     }

//     // Ensure latitude and longitude are populated
//     if (!latitude || !longitude) {
//       console.log("Missing coordinates:", { latitude, longitude });
//       continue; // Skip this location if coordinates are missing
//     }

//     // Add the valid location to the locations array
//     locations.push({
//       address,
//       city,
//       phoneNumber,
//       link,
//       latitude,
//       longitude
//     });

//   } catch (error) {
//     console.error("Error processing location:", error.message);
//     return res.status(400).json({ message: "Error with location data", error: error.message });
//   }
// }

//     // Create the new course object with the location array
//     const newCourse = new Course({
//       providerId,
//       name,
//       description,
//       days,
//       timeSlots: JSON.parse(timeSlots),
//       location: locations,  // Store locations as an array
//       ageGroup: JSON.parse(ageGroup),
//       courseType,
//       images: req.files ? await uploadImagesToS3(req.files) : [],
//       promoted,
//       preferredGender,
//       active: true,
//       courseDuration: parsedCourseDurations,
//     });

//     const savedCourse = await newCourse.save();
//     console.log("Saved course:", savedCourse);

//     res.status(201).json(savedCourse);  // Return saved course

//   } catch (error) {
//     console.error("Error adding course:", error);
//     res.status(500).json({ message: "Error adding course", error: error.message });
//   }
// });

router.get("/course/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// Route to search for a course by ID
router.get("/search", async (req, res) => {
  try {
    const { id } = req.query; // Get the ID from the query parameters

    // Validate ID
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    console.log("Received ID:", id); // Log the received ID

    // Use findById to search directly by ID
    const course = await Course.findById(id);

    // Check if the course exists
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    console.log("Fetched Course:", course); // Log the fetched course
    res.status(200).json(course); // Send the course back as a response
  } catch (error) {
    console.error("Error fetching course:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error });
  }
});

router.put("/update/:id", upload.array("academyImg", 10), async (req, res) => {
  try {
    // Destructure request body
    const {
      providerId,
      name,
      description,
      // feeAmount,
      // feeType,
      days,
      timeSlots,
      location,
      ageGroup,
      courseType,
      promoted,
      preferredGender,
      courseDuration,
      removedImages,  // Array of images to be removed from the course (can be empty)
      thingstokeepinmind,
      faq,
    } = req.body;

    // Log the received fields for debugging
    console.log("Received data:", {
      name, courseDuration, ageGroup, timeSlots, location, removedImages,thingstokeepinmind,faq
    });

    // Parse courseDuration, timeSlots, location, ageGroup safely
    const parsedCourseDurations = typeof courseDuration === "string" ? JSON.parse(courseDuration) : courseDuration;
    const parsedTimeSlots = timeSlots ? JSON.parse(timeSlots) : [];
    const parsedLocation = location ? JSON.parse(location) : [];
    const parsedAgeGroup = ageGroup ? JSON.parse(ageGroup) : [];

    // Ensure data is parsed correctly if it's a string
    const parsedthingstokeepinmind = typeof  thingstokeepinmind === "string" ? JSON.parse( thingstokeepinmind) :  thingstokeepinmind;
    console.log("Parsed faq:", parsedthingstokeepinmind);  // Log the parsed faq value


    // Ensure data is parsed correctly if it's a string
    const parsedfaq = typeof  faq === "string" ? JSON.parse(faq) :  faq;
    console.log("Parsed faq:", faq);  // Log the parsed faq value

    // Prepare file upload if any
    const uploadedImages = req.files ? await uploadImagesToS3(req.files) : [];

    // Fetch the current course to retain existing images and other data
    const currentCourse = await Course.findById(req.params.id);

    if (!currentCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Handle removed images (if any) and retain existing images
    let remainingImages = currentCourse.images;
    if (removedImages && Array.isArray(removedImages)) {
      remainingImages = currentCourse.images.filter(image => !removedImages.includes(image));
      // Optionally delete removed images from cloud storage here
      // for (const image of removedImages) {
      //   await deleteImageFromS3(image); // Replace with your S3 deletion logic
      // }
    }

    // Combine the remaining images with the newly uploaded ones
    const combinedImages = remainingImages.concat(uploadedImages);

    // Update the course with all the fields (including the combined images)
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,  // Use the ID from the URL
      {
        providerId,
        name,
        description,
        days,
        timeSlots: parsedTimeSlots,
        location: parsedLocation,
        ageGroup: parsedAgeGroup,
        courseType,
        images: combinedImages,  // Update images with new and remaining ones
        promoted,
        preferredGender,
        active: false,  // Ensure the course is inactive
        courseDuration: parsedCourseDurations,  // Update course duration
        thingstokeepinmind:parsedthingstokeepinmind,
        faq:parsedfaq,
      },
      { new: true }  // Return the updated document
    );
    // Return the updated course as a response
    res.status(200).json(updatedCourse);

  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Something went wrong during the update." });
  }
});

//delete course
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course  not found" });
    }

    // // Assuming 'imageUrl' is stored in the course category document
    // if (deletedCourse.imageUrl) {
    //   await deleteImageFromS3(deletedCourse.imageUrl);
    // }

    res.status(200).json({
      message: "Course  and associated image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course  or image:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

// Route to get courses by provider IDs
router.get("/by-providers", async (req, res) => {
  const { providerIds } = req.query;
  const searchKey = req.query.search
  if (searchKey && typeof searchKey !== 'string') {
    return res.status(400).json({ message: "Search key must be a string" });
  }
  console.log("searchKey:.....", searchKey);
  try {
    const query = {
      providerId: { $in: providerIds }
    };

    // Add the regex part if searchKey is provided
    if (searchKey) {
      query.name = { $regex: searchKey, $options: 'i' };
    }
    const courses = await Course.find(query);
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// for all courses and count
router.get("/get-all-courses", async (req, res) => {
  try {
    const allCoursesData = await Course.find({});
    const totalCourseCounts = allCoursesData.length;
    res.status(200).json({ courseCounts: totalCourseCounts, allCoursesData });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.put('/update-active-status/:id', async (req, res) => {
  const { id } = req.params;  // Extract 'id' from URL parameters
  const { active } = req.body;  // Extract 'active' from request body

  console.log("Received id:", id);
  console.log("Received active status:", active);

  // Check if the 'active' field is valid
  if (active !== "true" && active !== "false" && typeof active !== "boolean") {
    return res.status(400).json({ message: "Invalid 'active' value. It should be 'true' or 'false'." });
  }

  try {
    // Update the course's active status in the database
    const course = await Course.findByIdAndUpdate(
      id,
      { active: active },  // Update the 'active' field
      { new: true }        // Return the updated document
    );

    // Check if the course was found and updated
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Log the updated course
    console.log("Updated course:", course);

    // Respond with the updated course object
    res.json(course);

  } catch (err) {
    // Log any error that occurs during the update
    console.error('Error updating course:', err);
    res.status(500).json({ message: "Error updating course" });
  }
});



module.exports = router;
