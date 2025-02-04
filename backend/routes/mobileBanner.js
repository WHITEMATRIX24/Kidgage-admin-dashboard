const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3"); // Import PutObjectCommand from AWS SDK v3
const express = require("express");
const multer = require("multer");
const s3 = require("../aws-config"); // AWS S3 v3 config
const crypto = require("crypto");
const path = require("path");
const { promisify } = require("util");
const MobileBanner = require("../models/mobileBanner");

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
// async function deleteImageFromS3(imageUrl) {
//   try {
//     const urlParts = imageUrl.split("/");
//     const key = urlParts[urlParts.length - 1]; // Extract the file name from the URL

//     const params = {
//       Bucket: "kidgage",
//       Key: key,
//     };

//     const command = new DeleteObjectCommand(params); // Create DeleteObjectCommand
//     await s3.send(command); // Send the command to S3 to delete the file
//   } catch (error) {
//     console.error("Error deleting image from S3:", error);
//     throw error;
//   }
// }
// Route to get all banners

async function deleteImageFromS3(imageUrl) {
  try {
    console.log("Received image URL:", imageUrl);

    const urlParts = imageUrl.split("/");
    const key = urlParts[urlParts.length - 1]; // Extract the file name from the URL
    console.log("Extracted key for S3:", key);

    const params = {
      Bucket: "kidgage",  // Ensure that the bucket name is correct
      Key: key,           // The key should match the image file stored in S3
    };

    const command = new DeleteObjectCommand(params);  // Create DeleteObjectCommand
    console.log("Sending delete command to S3:", params);
    await s3.send(command);  // Send the command to S3 to delete the file

    console.log("Image successfully deleted from S3.");
  } catch (error) {
    console.error("Error deleting image from S3:", error);
    throw error; // Rethrow the error for the calling function to handle
  }
}

router.get("/", async (req, res) => {
  const searchKey=req.query.search
  console.log("searchKey:.....",searchKey);
  try {
    const query ={
      title:{$regex:searchKey,$options:'i'}
  }
    const banners = await MobileBanner.find(query);
    res.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to add a banner
router.post("/addbanner", upload.single("image"), async (req, res) => {
  try {
    const { title, bookingLink, startDate, endDate, fee } = req.body;
    const imageUrl = await uploadImageToS3(req.file); // Upload image to S3 and get URL

    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Check if the campaign start date is today or in the past
    const today = new Date();
    const campaignStartDate = new Date(startDate);
    const isActive = campaignStartDate <= today;

    // Create new banner with the provided data
    const newBanner = new MobileBanner({
      title,
      imageUrl,
      bookingLink,
      startDate: campaignStartDate,
      endDate: new Date(endDate),
      fee,
      status: isActive, // Set status based on start date
    });

    const savedBanner = await newBanner.save();
    res
      .status(201)
      .json({ message: "Banner added successfully", banner: savedBanner });
  } catch (error) {
    console.error("Error adding banner:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to update a banner
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, bookingLink } = req.body;
    // const updateData = { title, bookingLink };
    const updateData=req.body;

    if (req.file) {
      const image = await uploadImageToS3(req.file);
      updateData.imageUrl = image;
    }

    const updatedBanner = await MobileBanner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Banner updated successfully", banner: updatedBanner });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to delete a banner
// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the banner to get the image URL
//     const banner = await MobileBanner.findById(id);
//     if (!banner) {
//       return res.status(404).json({ message: "Banner not found" });
//     }

//     // Delete the image from S3
//     await deleteImageFromS3(banner.imageUrl);

//     // Delete the banner from the database
//     await MobileBanner.findByIdAndDelete(id);

//     res.json({ message: "Banner and image deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting banner:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("id:",id);
    
//     // Find the banner to get the image URL
//     const banner = await MobileBanner.findById(id);
//     if (!banner) {
//       return res.status(404).json({ message: "Banner not found" });
//     }

//     // Validate image URL before attempting deletion
//     console.log(banner.imageUrl);
    
//     if (!banner.imageUrl) {
//       return res.status(400).json({ message: "Banner does not have a valid image URL" });
//     }

//     // // Delete the image from S3
//     // try {
//     //   await deleteImageFromS3(banner.imageUrl);
//     // } catch (error) {
//     //   return res.status(500).json({ message: "Error deleting image from S3", error });
//     // }

//     // Delete the banner from the database
//     await MobileBanner.findByIdAndDelete(id);

//     res.json({ message: "Banner and image deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting banner:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("mobile banner id:", id); // Log the ID to ensure it's correct

    // Find the banner to get the image URL
    const banner = await MobileBanner.findById(id);
    if (!banner) {
      console.log("Banner not found");
      return res.status(404).json({ message: "Banner not found" });
    }

    console.log("Found banner:", banner);

    // Delete the image from S3
    // try {
    //   await deleteImageFromS3(banner.imageUrl);
    // } catch (error) {
    //   return res.status(500).json({ message: "Error deleting image from S3", error });
    // }

    // Delete the banner from the database
    const deletedBanner = await MobileBanner.findByIdAndDelete(id);
    if (!deletedBanner) {
      console.log("Failed to delete banner");
      return res.status(500).json({ message: "Failed to delete banner, please try again" });
    }

    console.log("Banner deleted:", deletedBanner);
    res.json({ message: "Banner and image deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ message: "Server error", error: error.stack });
  }
});


// banner status updater
router.put("/update-status/:id", upload.none(), async (req, res) => {
  const { id } = req.params;
  const { bannerStatus } = req.body;

  if (!id) {
    res
      .status(400)
      .json({ message: "bad request", error: "Requires banner id" });
  }

  try {
    const updateExistingBanner = await MobileBanner.findByIdAndUpdate(
      id,
      {
        status: !bannerStatus,
      },
      { new: true }
    );

    res.status(200).json({ message: "toggle success" });
  } catch (error) {
    res.status(500).json({ message: "server Error", error });
  }
});

module.exports = router;
