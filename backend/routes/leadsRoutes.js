const express = require("express");
const Leads = require("../models/Leads");
const router = express.Router();

// get all leades
router.get("/get-all-leads-count", async (req, res) => {
  try {
    const totalLeadesGenerated = await Leads.find({});
    const leadsCount = totalLeadesGenerated[0].clickCount;
    res.status(200).json({ leadsCount });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
