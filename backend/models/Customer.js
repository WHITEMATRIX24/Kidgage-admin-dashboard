const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true, required: true },
  bookingDate: { type: String, required: true },
  courseName: { type: String, required: true },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  providerName: { type: String, required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courseDuration: {
    duration: { type: Number, required: true },
    durationUnit: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    bookedDates: [{ type: String, required: true }],
    noOfSessions: { type: Number, required: true },
    fee: { type: Number, required: true },
  },
  paymentDetails: {
    isPaid: { type: Boolean, required: true },
    paymentMethod: { type: String, required: true },
  },
  status: { type: Boolean },
});

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    gToken: {
      access_token: { type: String },
      refresh_token: { type: String },
    },
    bookings: [BookingSchema],
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
