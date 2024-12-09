const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3"); // Import PutObjectCommand from AWS SDK v3
const express = require("express");
const multer = require("multer");
const CourseCategory = require("../models/CourseCategory");
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

// POST request to upload image
router.post("/add", upload.single("image"), async (req, res) => {
  const { name } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  try {
    // Upload image to S3 and get the URL
    const imageUrl = await uploadImageToS3(req.file);

    // Create a new course category with the image URL
    const newCourseCategory = new CourseCategory({
      name,
      image: imageUrl, // Store the URL in the database
    });

    // Save the new course category to the database
    const savedCourseCategory = await newCourseCategory.save();
    res.status(201).json(savedCourseCategory);
  } catch (error) {
    console.error("Error saving course category:", error.message); // Log the specific error message
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await CourseCategory.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a course category
router.put("/update/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  let updateFields = { name };

  if (req.file) {
    const imageBase64 = await uploadImageToS3(req.file);
    updateFields.image = imageBase64;
  }

  try {
    const updatedCourseCategory = await CourseCategory.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedCourseCategory) {
      return res.status(404).json({ message: "Course category not found" });
    }

    res.status(200).json(updatedCourseCategory);
  } catch (error) {
    console.error("Error updating course category:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});
// Function to delete the image from S3
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

// Delete a course category
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCourseCategory = await CourseCategory.findByIdAndDelete(id);

    if (!deletedCourseCategory) {
      return res.status(404).json({ message: "Course category not found" });
    }

    // Assuming 'imageUrl' is stored in the course category document
    if (deletedCourseCategory.imageUrl) {
      await deleteImageFromS3(deletedCourseCategory.imageUrl);
    }

    res.status(200).json({
      message: "Course category and associated image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course category or image:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

module.exports = router;
