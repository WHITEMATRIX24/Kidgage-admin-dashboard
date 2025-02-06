import React, { useEffect, useState } from "react";
import axios from "axios";

import "./Enquiries.css";
import Appbar from "../../components/common/appbar/Appbar";

const Enquiries = ({ searchdata }) => {
  const [enquiryData, setEnquiryData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const providerId = sessionStorage.getItem("userid"); // Get provider ID from sessionStorage
        if (!providerId) {
          setError("Provider ID not found.");
          return;
        }

        const response = await axios.get(`https://admin.kidgage.com/api/customers/bookings/${providerId}`);
        setEnquiryData(response.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load enquiries. Please try again later.");
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="enquiriesPage-container">
      {(!searchdata ||
        (Array.isArray(searchdata) && searchdata.length === 0) ||
        (typeof searchdata === "object" && Object.keys(searchdata).length === 0)) && <Appbar />}

      <div className="enquiriesPage-content">
        <h3 className="enquiriesPage-content-h3">Enquiries</h3>
        <div className="enquiriesPage-content-container">
          <div className="enquiriesPage-table-wrapper">
            <table className="enquiriesPage-content-table">
              <thead>
                <tr>
                  <th>User Email</th>
                  <th>Course Name</th>
                  <th>No. of Sessions</th>
                  <th>Booked Dates</th>
                  <th>Fee</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr>
                    <td colSpan="5" className="error-message">{error}</td>
                  </tr>
                ) : enquiryData.length === 0 ? (
                  <tr>
                    <td colSpan="5">No enquiries found.</td>
                  </tr>
                ) : (
                  enquiryData.map((item) => (
                    <tr key={item._id}>
                      <td>{item.userEmail}</td>
                      <td>{item.courseName}</td>
                      <td>{item.noOfSessions}</td>
                      <td>
                        {item.bookedDates.map(date => (
                          <div key={date}>
                            {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        ))}
                      </td>


                      <td>{item.fee}</td>
                      <td>Cash On Pay</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enquiries;
