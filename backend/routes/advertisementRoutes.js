const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3'); // Import PutObjectCommand from AWS SDK v3
const express = require('express');
const multer = require('multer');
const Advertisement = require('../models/Advertisement');
const s3 = require('../aws-config'); // AWS S3 v3 config
const crypto = require('crypto');
const path = require('path');
const { promisify } = require('util');

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
        const imageName = rawBytes.toString('hex') + path.extname(file.originalname);

        const params = {
            Bucket: 'kidgage', // The bucket name from .env
            Key: imageName, // The unique file name
            Body: file.buffer, // The file buffer
            ContentType: 'image/jpeg',
            AWS_REGION: 'eu-north-1', // The file type (e.g., image/jpeg)
            // Set the file to be publicly accessible
        };

        const command = new PutObjectCommand(params); // Create PutObjectCommand
        await s3.send(command); // Send the command to S3 to upload the file

        // Construct the public URL of the uploaded image
        const imageUrl = `https://${params.Bucket}.s3.${params.AWS_REGION}.amazonaws.com/${params.Key}`;
        return imageUrl; // Return the URL of the uploaded image
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        throw error; // Re-throw the error to be handled by the calling function
    }
}
async function deleteImageFromS3(imageUrl) {
    try {
        const urlParts = imageUrl.split('/');
        const key = urlParts[urlParts.length - 1]; // Extract the file name from the URL

        const params = {
            Bucket: 'kidgage',
            Key: key,
        };

        const command = new DeleteObjectCommand(params); // Create DeleteObjectCommand
        await s3.send(command); // Send the command to S3 to delete the file
    } catch (error) {
        console.error('Error deleting image from S3:', error);
        throw error;
    }
}
// Fetch all advertisements
router.get('/', async (req, res) => {
    try {
        const advertisements = await Advertisement.find();
        res.status(200).json(advertisements);
    } catch (error) {
        console.error('Error fetching advertisements:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Route to add a new advertisement (already exists)
router.post(
    '/addadvertisement',
    upload.fields([{ name: 'desktopImage' }, { name: 'mobileImage' }]),
    async (req, res) => {
        try {
            const { title, space } = req.body;  // Extract space from req.body
            const desktopImage = req.files['desktopImage'][0];
            const mobileImage = req.files['mobileImage'][0];

            // Convert images to Base64 strings
            const desktopImageBase64 = await uploadImageToS3(req.files['desktopImage'][0]);
            const mobileImageBase64 = await uploadImageToS3(req.files['mobileImage'][0]);
            console.log(desktopImageBase64);

            // Create a new advertisement document
            const newAdvertisement = new Advertisement({
                title,
                desktopImage: desktopImageBase64,
                mobileImage: mobileImageBase64,
                space: Number(space)  // Use the space value from req.body and convert it to a number
            });

            // Save the advertisement to the database
            await newAdvertisement.save();

            res.status(201).json({ message: 'Advertisement added successfully!' });
        } catch (error) {
            console.error('Error adding advertisement:', error);
            res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    }
);


// Route to update an advertisement
router.put('/:id', upload.fields([{ name: 'desktopImage' }, { name: 'mobileImage' }]), async (req, res) => {
    try {
        const { title } = req.body;
        const { id } = req.params;

        // Find the advertisement by ID
        const advertisement = await Advertisement.findById(id);
        if (!advertisement) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }

        // Update title
        advertisement.title = title;

        // Update images if provided
        if (req.files['desktopImage']) {
            const desktopImage = await uploadImageToS3(req.files['desktopImage'][0]);
            advertisement.desktopImage = desktopImage;

        }
        if (req.files['mobileImage']) {
            const mobileImage = await uploadImageToS3(req.files['mobileImage'][0]);
            advertisement.mobileImage = mobileImage;
        }

        // Save the updated advertisement
        await advertisement.save();
        res.status(200).json({ message: 'Advertisement updated successfully!' });
    } catch (error) {
        console.error('Error updating advertisement:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the advertisement by ID
        const advertisement = await Advertisement.findById(id);
        if (!advertisement) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }

        // Delete images from S3
        if (advertisement.desktopImage) {
            await deleteImageFromS3(advertisement.desktopImage);
        }
        if (advertisement.mobileImage) {
            await deleteImageFromS3(advertisement.mobileImage);
        }

        // Delete the advertisement from the database
        await Advertisement.findByIdAndDelete(id);

        res.status(200).json({ message: 'Advertisement deleted successfully!' });
    } catch (error) {
        console.error('Error deleting advertisement:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;
