const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const express = require('express');
const multer = require('multer');
const News = require('../models/News');
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
        const rawBytes = await randomBytes(16);
        const imageName = rawBytes.toString("hex") + path.extname(file.originalname);

        const params = {
            Bucket: "kidgage",
            Key: imageName,
            Body: file.buffer,
            ContentType: "image/jpeg",
            AWS_REGION: "eu-north-1",
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        const imageUrl = `https://${params.Bucket}.s3.${params.AWS_REGION}.amazonaws.com/${params.Key}`;
        return imageUrl;
    } catch (error) {
        console.error("Error uploading image to S3:", error);
        throw error;
    }
}

async function deleteImageFromS3(imageUrl) {
    try {
        const urlParts = imageUrl.split("/");
        const key = urlParts[urlParts.length - 1];

        const params = {
            Bucket: "kidgage",
            Key: key,
        };

        const command = new DeleteObjectCommand(params);
        await s3.send(command);
    } catch (error) {
        console.error("Error deleting image from S3:", error);
        throw error;
    }
}

// Route to add a new news article
router.post('/add', upload.single('image'), async (req, res) => {
    const { title, description, publishedOn, activeStatus } = req.body;

    try {
        const image = await uploadImageToS3(req.file);

        const newNews = new News({
            title,
            description,
            publishedOn,
            image,
            activeStatus: activeStatus || true,
        });

        const savedNews = await newNews.save();
        res.status(201).json(savedNews);
    } catch (error) {
        console.error("Error adding news:", error);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
});

// Route to fetch all news articles
router.get('/', async (req, res) => {
    const { search } = req.query;
    try {
        const query = search ? { title: { $regex: search, $options: 'i' } } : {};
        const news = await News.find(query);
        res.status(200).json(news);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
});

// Route to fetch a specific news article by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const news = await News.findById(id);
        if (!news) {
            return res.status(404).json({ message: "News not found" });
        }
        res.status(200).json(news);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
});

// Route to update a specific news article by ID
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, description, publishedOn, activeStatus } = req.body;
    const updateData = { title, description, publishedOn, activeStatus };

    try {
        if (req.file) {
            const image = await uploadImageToS3(req.file);
            updateData.image = image;
        }

        const updatedNews = await News.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedNews) {
            return res.status(404).json({ message: "News not found" });
        }

        res.status(200).json(updatedNews);
    } catch (error) {
        console.error("Error updating news:", error);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
});
router.put("/update-status/:id", upload.none(), async (req, res) => {
    const { id } = req.params;
    const { newsStatus } = req.body;

    if (!id) {
        res
            .status(400)
            .json({ message: "bad request", error: "Requres News Id" })
    }
    try {
        const updatedNews = await News.findByIdAndUpdate(
            id,
            {
                activeStatus: !newsStatus,
            },
            { new: true }
        );
        res.status(200).json({ message: "toggle success" });
    } catch (error) {
        res.status(500).json({ message: "server Error", error });
    }
});

// Route to delete a specific news article by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const newsToDelete = await News.findByIdAndDelete(id);
        if (!newsToDelete) {
            return res.status(404).json({ message: "News not found" });
        }

        // await deleteImageFromS3(newsToDelete.image);

        res.status(200).json({ message: "News deleted successfully" });
    } catch (error) {
        console.error("Error deleting news:", error);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
});

module.exports = router;
