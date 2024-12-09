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
router.post("/addcourse", upload.array("academyImg", 10), async (req, res) => {
  try {
    const {
      providerId,
      name,
      duration,
      durationUnit,
      startDate,
      endDate,
      description,
      feeAmount,
      feeType,
      days,
      timeSlots,
      location,
      ageGroup,
      courseType,
      promoted,
      preferredGender,
    } = req.body;

    // Ensure the timeSlots are parsed correctly
    const parsedTimeSlots =
      typeof timeSlots === "string" ? JSON.parse(timeSlots) : timeSlots;
    const parsedLocation =
      typeof location === "string" ? JSON.parse(location) : location;
    const parsedAge =
      typeof ageGroup === "string" ? JSON.parse(ageGroup) : ageGroup;

    // Handle the images
    const images = req.files ? await uploadImagesToS3(req.files) : [];

    const newCourse = new Course({
      providerId,
      name,
      duration,
      durationUnit,
      startDate,
      endDate,
      description,
      feeAmount,
      feeType,
      days,
      timeSlots: parsedTimeSlots,
      location: parsedLocation,
      ageGroup: parsedAge,
      courseType,
      images, // Base64 encoded images
      promoted,
      preferredGender,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Error adding course:", error);
    res
      .status(500)
      .json({ message: "Error adding course", error: error.message });
  }
});

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

router.put("/update/:id", async (req, res) => {
  try {
    // Find the course by ID
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Merge existing course with the fields to be updated
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== null) {
        course[key] = req.body[key]; // Update only fields that are provided and not null/undefined
      }
    });

    // Save the updated course
    const updatedCourse = await course.save();

    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a course
router.delete("/delete/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // If the course has images, delete each one from S3
    if (course.images && course.images.length > 0) {
      await Promise.all(
        course.images.map((imageUrl) => deleteImageFromS3(imageUrl))
      );
    }

    res.json({ message: "Course and associated images deleted successfully" });
  } catch (err) {
    console.error("Error deleting course or images:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get courses by provider IDs
router.get("/by-providers", async (req, res) => {
  const { providerIds } = req.query;

  try {
    const courses = await Course.find({ providerId: { $in: providerIds } });
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


//course status updator
// router.put('/update-active-status/:id', async (req, res) => {
//   const  {id}  = req.params;
//   const {active}  = req.body; // Get 'active' from the body

//   console.log("id",id);
//   console.log("active status",active);


//   // Validate the 'active' value
//   if (active !== "true" && active !== "false" && typeof active !== "boolean") {
//     return res.status(400).json({ message: "Invalid 'active' value. It should be 'true' or 'false'." });
//   }

//   try {
//     // Update the course's active status in the database
//     const course = await Course.findByIdAndUpdate(
//       id,
//       {
//         active: active,
//       },
//       { new: true }
//     );
//       console.log("course",course.active);

//     if (!course) {
//       return res.status(404).json({ message: "Course not found." });
//     }

//     res.json(course); // Return the updated course object
//   } catch (err) {
//     console.error('Error updating course:', err);
//     res.status(500).json({ message: "Error updating course" });
//   }
// });

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
