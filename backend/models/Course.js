const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
});

const locationSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  link: { type: String, required: true },
});

const ageGroupSchema = new mongoose.Schema({
  ageStart: { type: Date, required: true },
  ageEnd: { type: Date, required: true },
});

const courseDurationSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  duration: { type: Number, required: true },
  durationUnit: {
    type: String,
    enum: ["days", "weeks", "months", "years"],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  noOfSessions:{ type: Number, required: true },
  fee:{type: Number, required: true }
});

// const courseDurationSchema = new mongoose.Schema(
//   {
//     id: { 
//       type: Number, // If this is meant to be a custom ID, Number is fine. For more flexibility, consider using String.
//       required: true, 
//       unique: true // Ensure this ID is unique if required
//     },
//     duration: { 
//       type: Number, 
//       required: true,
//       min: [1, 'Duration must be at least 1'] // Optional: Ensure duration is at least 1 unit
//     },
//     durationUnit: {
//       type: String,
//       enum: ["days", "weeks", "months", "years"], // Valid duration units
//       required: true,
//     },
//     startDate: { 
//       type: Date, 
//       required: true,
//       validate: {
//         validator: function(value) {
//           // Ensure startDate is earlier than endDate
//           return !this.endDate || value < this.endDate;
//         },
//         message: 'startDate must be before endDate'
//       }
//     },
//     endDate: { 
//       type: Date, 
//       required: true,
//       validate: {
//         validator: function(value) {
//           // Ensure endDate is later than startDate
//           return !this.startDate || value > this.startDate;
//         },
//         message: 'endDate must be after startDate'
//       }
//     }
//   },
//   {
//     timestamps: true // Optional: Automatically adds createdAt and updatedAt fields
//   }
// );


const courseSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  courseDuration: { type: [courseDurationSchema], required: true },
  description: { type: String, required: true },
  // feeAmount: { type: Number, required: true },
  // feeType: {
  //   type: String,
  //   enum: ["full_course", "per_day", "per_week", "per_month"],
  //   required: true,
  // },
  days: { type: [String], required: true },
  timeSlots: { type: [timeSlotSchema], required: true },
  location: { type: [locationSchema], required: true },
  courseType: { type: String, required: true },
  images: [{ type: String, required: true }],
  ageGroup: { type: [ageGroupSchema], required: true },
  promoted: { type: Boolean, default: false }, // Add this field to track promoted courses
  active: { type: Boolean, default: true },  // Set the default value for 'active' field
  preferredGender: {
    type: String,
    enum: ["Male", "Female", "Any"],
    default: "Any", // You can set a default value if desired
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
