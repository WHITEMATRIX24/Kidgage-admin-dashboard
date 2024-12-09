import axios from "axios";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CalendarComponent() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const sendEmail = async () => {
        const date = selectedDate.toLocaleDateString();
        const time = selectedDate.toLocaleTimeString();

        try {
            await axios.post("http://localhost:3001/send-email", { date, time });
            alert("Email sent successfully!");
        } catch (error) {
            console.error("Error sending email", error);
        }
    };

    return (
        <div>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                showTimeSelect
                dateFormat="Pp"
            />
            <button onClick={sendEmail}>Send Event Email</button>
        </div>
    );
}

export default CalendarComponent;
