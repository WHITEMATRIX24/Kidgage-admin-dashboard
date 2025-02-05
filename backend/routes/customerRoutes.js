const express = require("express");
const Customer = require("../models/Customer");
const router = express.Router();
const mongoose = require("mongoose");

// Get all bookings for a provider
router.get("/bookings/:providerId", async (req, res) => {
    try {
        const { providerId } = req.params;
        const objectIdProviderId = new mongoose.Types.ObjectId(providerId);

        console.log("Provider ID received:", providerId);
        console.log("Converted ObjectId:", objectIdProviderId);

        const customers = await Customer.find({ "bookings.providerId": objectIdProviderId })
            .populate({ path: "bookings.courseId", select: "name" })

            .select("email name bookings");



        const filteredBookings = customers.flatMap((customer) =>
            customer.bookings
                .filter((booking) => booking.providerId && booking.providerId.toString() === providerId)
                .map((booking) => ({
                    userEmail: customer.email,
                    courseName: booking.courseId?.name || "N/A",
                    bookedDates: booking.courseDuration?.bookedDates || [],
                    fee: booking.courseDuration?.fee || "N/A",
                    noOfSessions: booking.courseDuration?.noOfSessions || "N/A",
                    timeSlot: booking.bookingDate || "N/A",
                    paymentMethod: booking.paymentDetails?.paymentMethod || "N/A",
                }))
        );


        res.status(200).json(filteredBookings);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/bookings/count", async (req, res) => {
    try {
        const totalBookingCount = await Customer.aggregate([
            { $unwind: "$bookings" },
            { $count: "totalBookings" }
        ]);

        const bookingCount = totalBookingCount[0].totalBookings;

        console.log("Total Bookings:", bookingCount);
        res.status(200).json({ bookingsCount: bookingCount });
    } catch (error) {
        console.error(" Error fetching booking count:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/bookings", async (req, res) => {
    try {
        // Fetch all customers with their bookings
        const customers = await Customer.find({})
            .populate({ path: "bookings.courseId", select: "name" })
            .select("email name bookings");

        // Extract all bookings from all customers
        const allBookings = customers.flatMap((customer) =>
            customer.bookings.map((booking) => ({
                userEmail: customer.email,
                courseName: booking.courseId?.name || "N/A",
                bookedDates: booking.courseDuration?.bookedDates || [],
                fee: booking.courseDuration?.fee || "N/A",
                noOfSessions: booking.courseDuration?.noOfSessions || "N/A",
                timeSlot: booking.bookingDate || "N/A",
                paymentMethod: booking.paymentDetails?.paymentMethod || "N/A",
            }))
        );

        res.status(200).json(allBookings);
    } catch (error) {
        console.error("Error fetching all bookings:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



// Get a specific customer's bookings
router.get("/customer/:customerId/bookings", async (req, res) => {
    try {
        const { customerId } = req.params;
        const customer = await Customer.findById(customerId).select("email name bookings");

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(customer.bookings);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Add a new booking for a customer
router.post("/customer/:customerId/bookings", async (req, res) => {
    try {
        const { customerId } = req.params;
        const newBooking = req.body;

        const customer = await Customer.findByIdAndUpdate(
            customerId,
            { $push: { bookings: newBooking } },
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(201).json({ message: "Booking added successfully", bookings: customer.bookings });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Delete a booking
router.delete("/customer/:customerId/bookings/:bookingId", async (req, res) => {
    try {
        const { customerId, bookingId } = req.params;

        const customer = await Customer.findByIdAndUpdate(
            customerId,
            { $pull: { bookings: { _id: bookingId } } },
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ message: "Booking deleted successfully", bookings: customer.bookings });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
