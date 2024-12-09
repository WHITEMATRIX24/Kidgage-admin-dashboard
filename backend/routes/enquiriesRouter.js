
const express = require("express");
const Enquiry = require("../models/Enquiry");
const router = express.Router();
// Route to get courses by provider IDs
router.get("/enquiry-by-providers", async (req, res) => {
    const { providerIds } = req.query;
    console.log('provider id',providerIds);
    try {
      const enquiries = await Enquiry.find({ providerId: { $in: providerIds } });
      res.status(200).json(enquiries);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  module.exports = router;


