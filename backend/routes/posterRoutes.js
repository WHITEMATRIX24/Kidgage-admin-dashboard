const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3"); // Import PutObjectCommand from AWS SDK v3

const express = require('express');
const multer = require('multer');
const Poster = require('../models/Poster'); // Adjust the path as necessary
const s3 = require("../aws-config"); // AWS S3 v3 config
const crypto = require("crypto");
const path = require("path");
const { promisify } = require("util");
const router = express.Router();

// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

// Route to add a new poster
router.post('/add', upload.single('image'), async (req, res) => {
  
  const { name, description, location,link, startDate, endDate } = req.body;
  const image = await uploadImageToS3(req.file); // Upload image to S3 and get URL

  if (!image) {
    return res.status(400).json({ message: 'Image is required' });
  }

  // // Check if the campaign start date is today or in the past
  // const today = new Date();
  // const posterStartDate = new Date(startDate);
  // const isActive = posterStartDate <= today;

  // Create new poster with the provided data
  try {
    const newPoster = new Poster({
      name,
      description,
      location,
      link,
      startDate,
      endDate,
      image,
    });

    const savedPoster = await newPoster.save();
    res.status(201).json(savedPoster);
    console.log(savedPoster);
    
  } catch (error) {
    console.error('Error saving poster:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Route to fetch all posters or wishlist posters based on query parameter
router.get('/', async (req, res) => {
  const { wishlist } = req.query;
  const searchKey=req.query.search
  // console.log("searchKey:.....",searchKey);
  try {
    const query ={
      name:{$regex:searchKey,$options:'i'},
  }
    let posters;
    if (wishlist === 'true') {
      posters = await Poster.find({ wishlist: true });
    } else {
      posters = await Poster.find(query);
    }

    console.log('Fetched posters:', posters.length); // Logging number of posters fetched
    res.status(200).json(posters);
  } catch (error) {
    console.error('Error fetching posters:', error); // More detailed logging
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Route to update a specific poster by ID
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, description, location, link, startDate, endDate } = req.body;
  const updateData = { name, description, location, link, startDate, endDate };
  // let imageBase64 = null;

  if (req.file) {
    const image = await uploadImageToS3(req.file);
    updateData.image = image;
  }
  
  try {
    const updatedPoster = await Poster.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true });

    if (!updatedPoster) {
      return res.status(404).json({ message: 'Poster not found' });
    }

    res.status(200).json(updatedPoster);
  } catch (error) {
    console.error('Error updating poster:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Route to delete a specific poster by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPoster = await Poster.findByIdAndDelete(id);
    if (!deletedPoster) {
      return res.status(404).json({ message: 'Poster not found' });
    }
    res.status(200).json({ message: 'Poster deleted successfully' });
  } catch (error) {
    console.error('Error deleting poster:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Route to update the wishlist status of a poster
router.put('/:id/wishlist', async (req, res) => {
  const { id } = req.params;
  const { wishlist } = req.body;

  try {
    const updatedPoster = await Poster.findByIdAndUpdate(id, { wishlist }, { new: true });

    if (!updatedPoster) {
      return res.status(404).json({ message: 'Poster not found' });
    }

    res.status(200).json(updatedPoster);
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

//update status
router.put("/update-status/:id", upload.none(), async (req, res) => {
  const { id } = req.params;
  const { posterStatus } = req.body;
  // console.log(posterStatus);
  

  if (!id) {
      res
          .status(400)
          .json({ message: "bad request", error: "Requres poster Id" })
  }
  try {
      const posterNews = await Poster.findByIdAndUpdate(
          id,
          {
              activeStatus: !posterStatus,
          },
          { new: true }
      );
      res.status(200).json({ message: "toggle success" });
  } catch (error) {
      res.status(500).json({ message: "server Error", error });
  }
});



// Route to fetch a specific poster by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const poster = await Poster.findById(id);
    if (!poster) {
      return res.status(404).json({ message: 'Poster not found' });
    }
    res.status(200).json(poster);
  } catch (error) {
    console.error('Error fetching poster:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});
module.exports = router;
