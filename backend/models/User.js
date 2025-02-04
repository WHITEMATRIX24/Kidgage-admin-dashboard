const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\+?[0-9]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  fullName: { type: String, required: true },
  designation: { type: String, required: true },
  description: { type: String, required: true },

  locations: [
    {
      locationName: { type: String, required: true }, // User-defined location name
      latitude: { type: Number, required: true }, // Latitude coordinate
      longitude: { type: Number, required: true }, // Longitude coordinate
    },
  ],

  website: { type: String }, // Optional field
  instaId: { type: String }, // Optional field
  crFile: { type: String },
  address: { type: String, required: true }, // Stores file path or link to the CR document
  agreeTerms: { type: Boolean, required: true, default: true },
  verificationStatus: { type: String, default: 'pending' },
  academyImg: { type: String, default: null }, // Optional, to be updated later
  logo: { type: String, default: null }, // Optional, to be updated later
  licenseNo: { type: String, default: null }, // Optional, to be updated later
  noOfCourses: { type: Number, default: 5 },
  meetingScheduleDate: { type: Date, default: Date.now },
  requestFiledDate: { type: Date, default: Date.now },
  expiryDate: {
    type: Date,
    default: () => {
      const today = new Date();
      return new Date(today.setFullYear(today.getFullYear() + 1));
    },
  },
  promoted: { type: Boolean, required: true, default: false },
  awards: { type: [String], default: null },
  amenities: { type: [String], default: null },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
