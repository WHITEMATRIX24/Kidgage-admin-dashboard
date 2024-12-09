const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { writeFileSync } = require("fs");
const { createEvent } = require("ics");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'whitematrix2024@gmail.com',
        pass: 'tkxj mgpk cewx crni'  // your sender Gmail password or app-specific password
    },
});
app.post("/send-email", (req, res) => {
    // Set a fixed date and time for the event
    const date = "2024-11-15";
    const time = "14:30";

    try {
        // Combine date and time to create a single Date object
        const eventDateTime = new Date(`${date}T${time}:00`);
        if (isNaN(eventDateTime)) {
            console.error("Invalid combined date and time");
            return res.status(400).send("Invalid combined date and time.");
        }

        const event = {
            start: [
                eventDateTime.getFullYear(),
                eventDateTime.getMonth() + 1,
                eventDateTime.getDate(),
                eventDateTime.getHours(),
                eventDateTime.getMinutes(),
            ],
            duration: { hours: 1 },
            title: "Meeting with kidgage",
            description: "meeeting with kidgage scheduled",
            location: "Online",
            url: "https://your-organization-link.com",
        };

        createEvent(event, (error, value) => {
            if (error) {
                console.error("Error creating event:", error);
                return res.status(500).send("Error creating event");
            }
            writeFileSync("./event.ics", value); // Save the ICS file temporarily

            const mailOptions = {
                from: "anulisba@gmail.com",
                to: "anulisbaraj@gmail.com",
                subject: `Event Reminder: Interview on ${eventDateTime.toDateString()}`,
                html: `<p>This event isn't in your calendar yet.</p>
                 <p>Do you want to automatically add this and future invitations to your calendar?</p>
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
                res.status(200).send("Email sent: " + info.response);
            });
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).send("An unexpected error occurred.");
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
