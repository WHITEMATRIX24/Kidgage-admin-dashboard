const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Adjust the path as necessary
const nodemailer = require("nodemailer");
const Admin = require("../models/adminModel");
const Course = require("../models/Course");
const fs = require("fs");
const { writeFileSync } = require("fs");
const { createEvent } = require("ics");
const s3 = require("../aws-config");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3"); // Import PutObjectCommand from AWS SDK v3
const crypto = require("crypto");
const path = require("path");
const { promisify } = require("util");

// Generate a random file name
const randomBytes = promisify(crypto.randomBytes);

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465, // Use 587 for TLS
  secure: true, // true for 465, false for 587
  auth: {
    user: "hello@kidgage.com", // Your Zoho Mail email address
    pass: "t0zHp1RBgsmX", // Your Zoho Mail password or app password
  },
});
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
// Route to get all banners

router.post("/send-email", (req, res) => {
  const { email, date } = req.body; // now looking for 'date' instead of 'dateTime'

  console.log("Request Body:", req.body);

  // Check if date is provided
  if (!date) {
    console.error("Date is missing in the request body.");
    return res.status(400).send("Date and time are required.");
  }

  try {
    // Parse date into separate date and time components
    const parsedDate = new Date(date); // assuming date includes both date and time in ISO format
    const year = parsedDate.getUTCFullYear();
    const month = parsedDate.getUTCMonth(); // months are 0-based in JavaScript Date
    const day = parsedDate.getUTCDate();
    const hour = parsedDate.getUTCHours();
    const minute = parsedDate.getUTCMinutes();

    // Event details
    const event = {
      start: [year, month, day, hour, minute],
      duration: { hours: 1 },
      title: "Meeting with Kidgage",
      description: "Meeting with Kidgage scheduled",
      location: "Online",
      url: "https://your-organization-link.com",
    };
    console.log("Event to be created:", event);

    createEvent(event, (error, value) => {
      if (error) {
        console.error("Error creating event:", error);
        return res.status(500).send("Error creating event");
      }

      writeFileSync("./event.ics", value); // Save the ICS file temporarily

      // Format date and time for email content
      const formattedDate = `${day.toString().padStart(2, "0")}-${(month + 1)
        .toString()
        .padStart(2, "0")}-${year}`;
      const formattedTime = `${hour
        .toString()
        .padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

      const mailOptions = {
        from: "hello@kidgage.com",
        to: email, // Using the recipient's email from req.body
        subject: `Event Reminder: Meeting on ${formattedDate} at ${formattedTime}`,
        html: `<p>Your meeting is scheduled on ${formattedDate} at ${formattedTime}.</p>
               <p>Click the button below to add this event to your calendar.</p>
               <button><a href="cid:event.ics" download="event.ics">Add to calendar</a></button>`,
        attachments: [
          {
            filename: "event.ics",
            path: "./event.ics",
            cid: "event.ics",
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).send("Error sending email");
        }
        console.log("Email sent:", info.response);
        res.status(200).send("Email sent: " + info.response);
      });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).send("An unexpected error occurred.");
  }
});
router.post(
  "/signup",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "crFile", maxCount: 1 },
    { name: "academyImg", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      username,
      email,
      phoneNumber,
      fullName,
      designation,
      description,
      location,
      website,
      licenseNo,
      instaId,
      agreeTerms,
    } = req.body;

    const files = req.files;
    const fileBase64 = {};

    if (files) {
      if (files.logo) fileBase64.logo = files.logo[0].buffer.toString("base64");
      if (files.crFile)
        fileBase64.crFile = files.crFile[0].buffer.toString("base64");
      if (files.academyImg)
        fileBase64.academyImg = files.academyImg[0].buffer.toString("base64");
    }

    try {
      const existingUser = await User.findOne({
        $or: [{ email }, { phoneNumber }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({
            message: "User with this email or phone number already exists.",
          });
      }

      // Construct the new user object based on the updated schema
      const newUser = new User({
        username,
        email,
        phoneNumber,
        fullName,
        designation,
        description,
        location,
        licenseNo,
        website: website || null, // Optional
        instaId: instaId || null, // Optional
        logo: fileBase64.logo,
        crFile: fileBase64.crFile,
        academyImg: fileBase64.academyImg,
        agreeTerms: agreeTerms === "true", // Ensure agreeTerms is parsed as a Boolean
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully!" });
      const existingAdmin = await Admin.findOne({ name: email });
      if (existingAdmin) {
        console.log("Admin with this email already exists");
        return res
          .status(400)
          .json({ message: "Admin with this email already exists" });
      }

      // Hash the phone number to use as password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(phoneNumber, salt);
      const role = "provider";
      // Create a new Admin account using the provided user data
      const admin = new Admin({
        name: email,
        password: hashedPassword,
        fullName: fullName,
        role: role,
        userId: newUser._id,
      });

      // Save the new Admin account
      await admin.save();
      console.log("Admin saved successfully:", admin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error." });
    }
  }
);
// Sign-In Route
router.post("/signin", async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    // Find the user by email or phone number
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
    });

    if (!user) {
      return res.status(400).json({ message: "Email/phone is incorrect" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // Successful sign-in
    res.status(200).json({ message: "Sign-in successful", user });
  } catch (err) {
    console.error("Sign-in error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/updateVerification", async (req, res) => {
  const { userId, date } = req.body;
  try {
    // Update user's verification status in the database
    await User.findByIdAndUpdate(userId, {
      verificationStatus: "meeting-scheduled",
      meetingScheduleDate: date,
    });
    res.status(200).send("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});

router.get("/pending", async (req, res) => {
  try {
    const pendingUsers = await User.find({ verificationStatus: "pending" });
    console.log("Fetched Pending Users:", pendingUsers); // Debugging log
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error.message); // Debugging log for errors
    res.status(400).json({ message: error.message });
  }
});

router.get("/accepted", async (req, res) => {
  try {
    const acceptedUsers = await User.find({ verificationStatus: "accepted" });
    console.log("Fetched Accepted Users:", acceptedUsers); // Debugging log
    res.status(200).json(acceptedUsers);
  } catch (error) {
    console.error("Error fetching accepted users:", error.message); // Debugging log for errors
    res.status(400).json({ message: error.message });
  }
});

router.post("/verify/:id", async (req, res) => {
  try {
    const { email, username, phone, fullName, role } = req.body;

    // Check if the admin with this username already exists
    const existingAdmin = await Admin.findOne({ name: username });
    if (existingAdmin) {
      console.log("Admin with this username already exists");
      return res
        .status(400)
        .json({ message: "Admin with this username already exists" });
    }

    // Hash the phone number to use as password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(phone, salt);

    // Create a new Admin account using the provided user data
    const admin = new Admin({
      name: username,
      password: hashedPassword,
      fullName: fullName,
      role: role,
      userId: req.params.id,
    });

    // Save the new Admin account
    await admin.save();
    console.log("Admin saved successfully:", admin);
    const url = "https://main.d3781xttwrodcq.amplifyapp.com/";

    // Set today's date for expiryDate
    const today = new Date();
    today.setFullYear(today.getFullYear() + 1); // Adds 1 year to today's date

    // Update the user verification status and expiry date
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: "accepted",
        expiryDate: today,
      },
      { new: true }
    );

    console.log("User verification status and expiry date updated:", user);

    const welcomeMessage = `
    Dear ${fullName},
    
    We are happy to inform you that your account has been verified by KidGage.
    To get started, please login using the following credentials: 
    Link to Activity Manager: ${url}
    Username: ${username}
    Password: ${phone}
    
    Please complete your profile after logging in.
    
    Welcome to KidGage Team!
  `;

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465, // Use 587 for TLS
      secure: true, // true for 465, false for 587
      auth: {
        user: "hello@kidgage.com", // Your Zoho Mail email address
        pass: "t0zHp1RBgsmX", // Your Zoho Mail password or app password
      },
    });

    // Set up email data
    const mailOptions = {
      from: "hello@kidgage.com",
      to: email,
      subject: "Welcome to KidGage!",
      text: welcomeMessage,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully to:", email);

    // Send a response back to the client
    res.status(200).json({
      message: "User verified, admin account created successfully, and expiry date set.",
      user,
    });
  } catch (error) {
    console.error("Error in verify route:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Rejection endpoint
router.post("/reject/:id", async (req, res) => {
  const { username, email, fullName, reason } = req.body;
  const { id } = req.params; // Extract the user ID from the request parameters

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465, // Use 587 for TLS
      secure: true, // true for 465, false for 587
      auth: {
        user: "hello@kidgage.com", // Your Zoho Mail email address
        pass: "t0zHp1RBgsmX", // Your Zoho Mail password or app password
      },
    });

    // Construct the email message
    const mailOptions = {
      from: "hello@kidgage.com",
      to: email,
      subject: "Application Rejected",
      text: `Dear ${fullName},

We hope this message finds you well.

We regret to inform you that your application with ${username} has been rejected. After careful consideration, we have decided not to proceed with your application at this time.

Reason for Rejection:
${reason}

We appreciate the time and effort you invested in your application and encourage you to apply again in the future. Should you have any questions or require further clarification, please do not hesitate to reach out to us.

Thank you for your interest in being a part of Kidgage. We wish you all the best in your future endeavors.

Best regards,
Team Kidgage`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Delete the user from the database
    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "User rejected and email sent successfully" });
  } catch (error) {
    console.error("Error rejecting user or sending email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Search Route
router.get("/search", async (req, res) => {
  const { query } = req.query;

  try {
    // Find the user by email or phone number
    const user = await User.findOne({
      $or: [{ email: query }, { phoneNumber: query }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Send the user details
    res.status(200).json(user);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    // Fetch only verified users with the specified fields (username, logo)
    const users = await User.find(
      { verificationStatus: "verified" },
      "username logo email"
    );
    console.log("Fetched Users:", users); // Debugging log
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message); // Debugging log for errors
    res.status(400).json({ message: error.message });
  }
});
router.get("/provider/:id", async (req, res) => {
  try {
    const provider = await User.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// router.put('/update/:id', upload.fields([{ name: 'logo' }, { name: 'crFile' }, { name: 'academyImg' }]), async (req, res) => {
//   const { id } = req.params;
//   const { username, email, phoneNumber, fullName, designation, description, location, website, instaId, licenseNo } = req.body;

//   // Convert files to base64 if they are provided
//   let logoBase64 = null;
//   let crFileBase64 = null;
//   let academyImgBase64 = null;

//   if (req.files.logo) {
//     logoBase64 = req.files.logo[0].buffer.toString('base64');
//   }
//   if (req.files.crFile) {
//     crFileBase64 = req.files.crFile[0].buffer.toString('base64');
//   }
//   if (req.files.academyImg) {
//     academyImgBase64 = req.files.academyImg[0].buffer.toString('base64');
//   }
//   console.log('Received files:', req.files);
//   console.log('Received body:', req.body);

//   try {
//     const updatedUser = await User.findByIdAndUpdate(id, {
//       username,
//       email,
//       phoneNumber,
//       fullName,
//       designation,
//       description,
//       location,
//       website,
//       instaId,
//       licenseNo,
//       logo: logoBase64 || undefined, // Only update logo if a new file is provided
//       crFile: crFileBase64 || undefined, // Only update CR file if a new file is provided
//       academyImg: academyImgBase64 || undefined // Only update academyImg if a new file is provided
//     }, { new: true });

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ message: 'Internal server error. Please try again later.' });
//   }
// });
router.put(
  "/update/:id",
  upload.fields([{ name: "logo" }, { name: "crFile" }, { name: "academyImg" }]),
  async (req, res) => {
    const { id } = req.params;
    const {
      username,
      email,
      phoneNumber,
      fullName,
      designation,
      description,
      location,
      website,
      instaId,
      licenseNo,
    } = req.body;

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update basic user info
      user.username = username;
      user.email = email;
      user.phoneNumber = phoneNumber;
      user.fullName = fullName;
      user.designation = designation;
      user.description = description;
      user.location = location;
      user.website = website;
      user.instaId = instaId;
      user.licenseNo = licenseNo;

      if (req.files) {
        if (req.files.logo && req.files.logo[0]) {
          // Delete existing logo from S3 if it exists
          if (user.logo) await deleteImageFromS3(user.logo);

          // Upload new logo to S3 (assumed as image)
          user.logo = await uploadImageToS3(req.files.logo[0]);
        }

        if (req.files.crFile && req.files.crFile[0]) {
          // Delete existing CR file from S3 if it exists
          if (user.crFile) await deleteImageFromS3(user.crFile);

          // Upload new CR file to S3 as PDF
          const crFileParams = {
            Bucket: "kidgage",
            Key: `${Date.now()}_${req.files.crFile[0].originalname}`, // Unique file name
            Body: req.files.crFile[0].buffer,
            ContentType: "application/pdf", // Set ContentType for PDF
            ACL: "public-read",
          };
          const crFileCommand = new PutObjectCommand(crFileParams);
          await s3.send(crFileCommand);
          user.crFile = `https://${crFileParams.Bucket}.s3.${crFileParams.AWS_REGION}.amazonaws.com/${crFileParams.Key}`;
        }

        if (req.files.academyImg && req.files.academyImg[0]) {
          // Delete existing academy image from S3 if it exists
          if (user.academyImg) await deleteImageFromS3(user.academyImg);

          // Upload new academy image to S3
          user.academyImg = await uploadImageToS3(req.files.academyImg[0]);
        }
      }

      await user.save();
      res.status(200).json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res
        .status(500)
        .json({ message: "Internal server error. Please try again later." });
    }
  }
);

// New route to delete academy by id
router.delete("/academy/:id/:email", async (req, res) => {
  const { id, email } = req.params;
  const { message } = req.body;

  try {
    console.log("Request Params:", { id, email });
    console.log("Request Body:", { message });

    // Delete academy
    const deletedAcademy = await User.findByIdAndDelete(id);
    if (!deletedAcademy) {
      console.error(`No academy found with ID: ${id}`);
      return res.status(404).json({ message: "Academy not found" });
    }

    console.log("Deleted Academy:", deletedAcademy);

    // Delete associated courses
    const deletedCourses = await Course.deleteMany({ providerId: id });
    console.log("Deleted Courses:", deletedCourses);

    // Send email
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: "hello@kidgage.com",
        pass: "t0zHp1RBgsmX",
      },
    });

    await transporter.sendMail({
      from: "hello@kidgage.com",
      to: email,
      subject: "Rejection from Kidgage",
      text: `Dear Activity Provider,
    
    We regret to inform you that your application has been rejected for the following reason:
    
    "${message}"
    
    If you have any questions or need further assistance, please feel free to reach out to us.
    
    Best regards,  
    Kidgage Support Team`,
      html: `
        <p>Dear ${deletedAcademy.name},</p>
        <p>We regret to inform you that your application has been rejected for the following reason:</p>
        <blockquote style="font-style: italic; color: #555;">"${message}"</blockquote>
        <p>If you have any questions or need further assistance, please feel free to reach out to us.</p>
        <p>Best regards,</p>
        <p><b>Kidgage Support Team</b></p>
      `,
    });

    res.status(200).json({
      message: "Academy and associated courses deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting academy and courses:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user details from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/email/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const provider = await User.findOne({ email: email }); // Check for email field match
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// router.post('/complete/:userId', upload.fields([{ name: 'academyImg' }, { name: 'logo' }]), async (req, res) => {
//   const { userId } = req.params;
//   const { licenseNo } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update the license number and verification status
//     user.licenseNo = licenseNo;
//     user.verificationStatus = 'verified'; // Set the verification status to 'verified'

//     // Convert files to Base64 and update the user record
//     if (req.files) {
//       if (req.files.academyImg && req.files.academyImg[0]) {
//         user.academyImg = req.files.academyImg[0].buffer.toString('base64'); // Convert Academy Image to Base64
//       }

//       if (req.files.logo && req.files.logo[0]) {
//         user.logo = req.files.logo[0].buffer.toString('base64'); // Convert Logo to Base64
//       }
//     }

//     await user.save();

//     res.json({ message: 'User details updated successfully!' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.post(
  "/complete/:userId",
  upload.fields([{ name: "academyImg" }, { name: "logo" }]),
  async (req, res) => {
    const { userId } = req.params;
    const { licenseNo } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update the license number and verification status

      user.verificationStatus = "accepted";

      if (req.files) {
        if (req.files.academyImg && req.files.academyImg[0]) {
          // Delete existing academy image from S3 if it exists
          // if (user.academyImg) await deleteImageFromS3(user.academyImg);

          // Upload new academy image to S3
          user.academyImg = await uploadImageToS3(req.files.academyImg[0]);
        }

        if (req.files.logo && req.files.logo[0]) {
          // Delete existing logo from S3 if it exists
          // if (user.logo) await deleteImageFromS3(user.logo);

          // Upload new logo to S3
          user.logo = await uploadImageToS3(req.files.logo[0]);
        }
      }

      await user.save();
      res.json({ message: "User details updated successfully!" });
    } catch (error) {
      console.error("Error updating user details:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

router.post(
  "/edit/:userId",
  upload.fields([{ name: "academyImg" }, { name: "logo" }]),
  async (req, res) => {
    const { userId } = req.params;
    const {
      licenseNo,
      fullName,
      designation,
      description,
      website,
      instaId,
      location,
      email,
      phoneNumber,
    } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log(req.files.logo);
      // Update the license number and verification status
      user.licenseNo = licenseNo;
      user.fullName = fullName;
      user.designation = designation;
      user.description = description;
      user.location = location;
      user.website = website || null;
      user.instaId = instaId || null;
      user.email = email;
      user.phoneNumber = phoneNumber;

      // Convert files to Base64 and update the user record
      if (req.files) {
        if (req.files.academyImg && req.files.academyImg[0]) {
          // Delete existing academy image from S3 if it exists
          // if (user.academyImg) await deleteImageFromS3(user.academyImg);

          // Upload new academy image to S3
          user.academyImg = await uploadImageToS3(req.files.academyImg[0]);
        }

        if (req.files.logo && req.files.logo[0]) {
          // Delete existing logo from S3 if it exists
          // if (user.logo) await deleteImageFromS3(user.logo);

          // Upload new logo to S3
          user.logo = await uploadImageToS3(req.files.logo[0]);
        }
      }

      await user.save();

      res.json({ message: "User details updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.post(
  "/edits/:userId",
  upload.fields([{ name: "academyImg" }, { name: "logo" }, { name: "crFile" }]),
  async (req, res) => {
    const { userId } = req.params;
    const {
      licenseNo,
      fullName,
      designation,
      description,
      website,
      instaId,
      location,
      email,
      phoneNumber,
    } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Update the license number and verification status
      user.licenseNo = licenseNo;
      user.fullName = fullName;
      user.designation = designation;
      user.description = description;
      user.location = location;
      user.website = website || null;
      user.instaId = instaId || null;
      user.email = email;
      user.phoneNumber = phoneNumber;

      // Convert files to Base64 and update the user record
      if (req.files) {
        if (req.files.academyImg && req.files.academyImg[0]) {
          // Delete existing academy image from S3 if it exists
          // if (user.academyImg) await deleteImageFromS3(user.academyImg);

          // Upload new academy image to S3
          user.academyImg = await uploadImageToS3(req.files.academyImg[0]);
        }

        if (req.files.logo && req.files.logo[0]) {
          // Delete existing logo from S3 if it exists
          // if (user.logo) await deleteImageFromS3(user.logo);

          // Upload new logo to S3
          user.logo = await uploadImageToS3(req.files.logo[0]);
        }
        if (req.files.crFile && req.files.crFile[0]) {
          user.crFile = req.files.crFile[0].buffer.toString("base64"); // Convert Logo to Base64
        }
      }

      await user.save();

      res.json({ message: "User details updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
router.get("/meeting-scheduled-users", async (req, res) => {
  try {
    const meetingScheduledUsers = await User.find({
      verificationStatus: "meeting-scheduled",
    }).sort({ meetingScheduleDate: 1 });
    res.status(200).json(meetingScheduledUsers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});
router.get("/allUser", async (req, res) => {
  try {
    const { verificationStatus } = req.query;

    // Define a query object that will filter users based on verificationStatus if provided
    let query = {};
    if (verificationStatus) {
      query.verificationStatus = verificationStatus;
    }

    // Fetch users with the specified filter
    const users = await User.find(query);
    console.log("Fetched Users:", users); // Debugging log to check filtered users
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message); // Debugging log for errors
    res.status(400).json({ message: error.message });
  }
});

//updating activiy details-no of classes

router.put("/update-activity/:id", async (req, res) => {
  const { id } = req.params;
  const { noOfCourses } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic user info
    user.noOfCourses = noOfCourses;

    // Save the updated user
    await user.save();

    // Send the updated user as response
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
});





module.exports = router;
