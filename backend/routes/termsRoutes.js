const express = require('express');
const Student = require('../models/Student');
const TermsAndCondition = require('../models/TermsAndCondition');
const router = express.Router();


router.post('/add', async (req, res) => {
    const { terms } = req.body;
    console.log(terms);
    // const policy=""
    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    console.log("Current Date:", currentDate);

    try {
        const newData = new TermsAndCondition({
            terms,
            // policy,
            date: currentDate,
        });

        await newData.save();
        res.status(201).json(newData);
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
});

router.post('/add-policy', async (req, res) => {
    const { policy } = req.body;
    // const terms=""
 
    console.log(policy);
     // Get the current date in YYYY-MM-DD format
     const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
     console.log("Current Date:", currentDate);
    try {
        const newData = new TermsAndCondition({
            // terms,
            policy,
            date: currentDate,
        });

        await newData.save();
        res.status(201).json(newData);
    } catch (error) {
        console.error('Error adding policy:', error);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
});

//get terms and conditions only
router.get('/term-data', async (req, res) => {
    // const { search } = req.query;
    try {
        const termsAndpolicy = await TermsAndCondition.find({}, 'terms date');
        res.status(200).json(termsAndpolicy);
    } catch (error) {
        console.error("Error fetching termsAndpolicy:", error);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
});

//get privacy policy only
router.get('/policy-data', async (req, res) => {
    // const { search } = req.query;
    try {
        const termsAndpolicy = await TermsAndCondition.find({}, 'policy date');
        res.status(200).json(termsAndpolicy);
    } catch (error) {
        console.error("Error fetching termsAndpolicy:", error);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
});


//delete terms and policy and conditions and privacy
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTermsAndPolicy = await TermsAndCondition.findByIdAndDelete(id);
    if (!deletedTermsAndPolicy ) {
      return res.status(404).json({ message: 'Terms not found' });
    }
    res.status(200).json({ message: 'Terms deleted successfully' });
  } catch (error) {
    console.error('Error deleting terms:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});


  // Update a terms
  router.put("/update-terms/:id", async (req, res) => {
    const { id } = req.params;
    const { terms } = req.body;
  
    // Log the received ID and terms
    console.log("Updating terms with ID:", id);
    console.log("Request body:", req.body);
  
    if (!terms) {
      return res.status(400).json({ message: "Terms field cannot be empty" });
    }
  
    const updateFields = { terms };
  
    try {
      const updatedTerms = await TermsAndCondition.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );
  
      if (!updatedTerms) {
        return res.status(404).json({ message: "Terms and condition not found" });
      }
  
      // Return the updated terms
      res.status(200).json(updatedTerms);
    } catch (error) {
      console.error("Error updating Terms and conditions:", error);
      res.status(500).json({
        message: "Internal server error. Please try again later.",
      });
    }
  });
  
   // Update a policy
   router.put("/update-policy/:id", async (req, res) => {
    const { id } = req.params;
    const { policy } = req.body;
  
    // Log the received ID and terms
    console.log("Updating policy with ID:", id);
    console.log("Request body:", req.body);
  
    if (!policy) {
      return res.status(400).json({ message: "Policy field cannot be empty" });
    }
  
    const updateFields = { policy };
  
    try {
      const updatedPolicy = await TermsAndCondition.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );
  
      if (!updatedPolicy) {
        return res.status(404).json({ message: "Terms and condition not found" });
      }
  
      // Return the updated terms
      res.status(200).json(updatedPolicy);
    } catch (error) {
      console.error("Error updating Terms and conditions:", error);
      res.status(500).json({
        message: "Internal server error. Please try again later.",
      });
    }
  });
  



module.exports = router;