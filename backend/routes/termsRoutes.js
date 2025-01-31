const express = require('express');
const Student = require('../models/Student');
const router = express.Router();


router.post('/add', async (req, res) => {
    // const { parent, firstName, lastName, dob, gender, levelOfExpertise, interests } = req.body;

    // try {
    //     const student = new Student({
    //         parent,
    //         firstName,
    //         lastName,
    //         dob,
    //         gender,
    //         levelOfExpertise,
    //         interests
    //     });

    //     await student.save();
    //     res.status(201).json(student);
    // } catch (error) {
    //     console.error('Error adding student:', error);
    //     res.status(500).json({ message: 'Internal server error. Please try again later.' });
    // }
});


module.exports = router;