
const express = require("express");
const Enquiry = require("../models/Enquiry");
const router = express.Router();
// Route to get courses by provider IDs
router.get("/enquiry-by-providers", async (req, res) => {
  const searchKey=req.query.search
  console.log("searchKey:.....",searchKey);
    const { providerIds } = req.query;
    console.log('provider id',providerIds);
    try {
      const query = {
        providerId: { $in: providerIds }
      };
  
      // Add the regex part if searchKey is provided
      if (searchKey) {
        query['parentDetails.name'] = { $regex: searchKey, $options: 'i' };
      }
      const enquiries = await Enquiry.find(query);
      res.status(200).json(enquiries);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  module.exports = router;


