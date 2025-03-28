import React, { useEffect, useState } from "react";
import "./InboundRequest.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faMagnifyingGlass,
  faTrashCan,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RequestsPopup from "./RequestsPopup";
import Appbar from "./common/appbar/Appbar";
import InspectionRejectModal from "../Pages/inspections/reject-modal/inspectionRejectModal";

function InboundRequest(searchdata) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  // Step 1: Loading state
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchKey, setSearchKey] = useState("")
  const [rejectionStatus, setRejectionStatus] = useState([])
  const [showRejectPopupData, setShowRejectPopupData] = useState({
    isShow: false,
    data: null,
  });

  // const fetchUsers = async () => {
  //   try {
  //     setLoading(true);
  //     if(searchKey){
  //       const response = await axios.get(
  //         `https://admin.kidgage.com/api/users/pending-search?search=${searchKey}`
  //       );
  //     }
  //     const response = await axios.get(
  //       `https://admin.kidgage.com/api/users/pending`
  //     );
  //     setPendingUsers(response.data);
  //   } catch (error) {
  //     console.error("Error fetching pending users:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let response;
      if (searchKey) {
        // If searchKey is present, perform the search query
        response = await axios.get(
          `https://admin.kidgage.com/api/users/pending-search?search=${searchKey}`
        );
      } else {
        // If no searchKey, fetch all pending users
        response = await axios.get(
          `https://admin.kidgage.com/api/users/pending`
        );
      }
      // Set the response data (pending users) to the state
      setPendingUsers(response.data);
    } catch (error) {
      console.error("Error fetching pending users:", error);
    } finally {
      setLoading(false);
    }
  };


  const openRequestDetails = (user) => {
    setSelectedUser(user);
    setShowRequestPopup(true);
  };

  const closeRequestDetails = () => {
    setShowRequestPopup(false);
  };

  const handleCalendarClick = (user) => {
    setSelectedUser(user);
    setShowDatePicker(true);
  };

  // reject pop up open handler
  const handleRejectPopUpOpenHandler = (user) => {
    setShowRejectPopupData({ isShow: true, data: user });
  };

  // reject pop up close handler
  const handleRejectPopUpCloseHandler = () =>
    setShowRejectPopupData({ isShow: false, data: null });

  const handleConfirmDate = async () => {
    if (!selectedUser || !selectedDate) {
      console.error("No user or date selected for scheduling a meeting.");
      return;
    }

    try {
      setIsLoading(true); // Step 2: Set loading state to true
      await axios.post(
        "https://admin.kidgage.com/api/users/updateVerification",
        {
          userId: selectedUser._id,
          date: selectedDate.toISOString(),
        }
      );
      await axios.post("https://admin.kidgage.com/api/users/send-email", {
        email: selectedUser.email,
        date: selectedDate.toISOString(),
      });

      setShowDatePicker(false);
      alert("Meeting scheduled and email sent!");
      fetchUsers();
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      console.log("Selected User:", selectedUser);
      console.log("Selected Date:", selectedDate);
    } finally {
      setIsLoading(false);  // Step 3: Set loading state to false after process finishes
    }
  };


  const handleChildData = (data) => {
    setSearchKey(data); // Set the received data to state
  };


  useEffect(() => {
    fetchUsers();
  }, [searchKey, rejectionStatus]);

  return (
    <div className="inbound-container">
      {
        !searchdata ||
          (Array.isArray(searchdata) && searchdata.length === 0) ||
          (typeof searchdata === 'object' && Object.keys(searchdata).length === 0)
          ? <Appbar sendDataToParent={handleChildData} />
          : null
      }
      <div className="inbound-heading">
        <h3>Inbound Requests</h3>
      </div>
      {pendingUsers.length > 0 ? (
        <div className="inbound-table-container">
          {/* <h3 className="inbound-table-heading">Inbound Requests</h3> */}
          <table className="inbound-details">
            <thead className="table-head">
              <tr>
                <th>Academy Name</th>
                <th>Request Date</th>
                <th>Address</th>
                <th>Contact Number</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => {
                const requestDate = new Date(user.requestFiledDate);
                const formattedDate = requestDate
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "-");
                return (
                  <tr key={user._id}>
                    <td>
                      <div className="inbound-profile-container">
                        {/* <div className="inbound-img">
                          <img
                            src="https://img.icons8.com/color/452/khan-academy.png"
                            alt="Academy"
                          />
                        </div> */}
                        <div id="inbound-profile-name">{user.username}</div>
                      </div>
                    </td>
                    <td>{formattedDate}</td>
                    <td>{user.location}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      <div className="inbound-icons">
                        <FontAwesomeIcon
                          icon={faMagnifyingGlass}
                          cursor="pointer"
                          className="inbound-icon-search"
                          onClick={() => openRequestDetails(user)}
                        />
                        <FontAwesomeIcon
                          icon={faCalendarDays}
                          className="inbound-icon-calender"
                          cursor="pointer"
                          onClick={() => handleCalendarClick(user)}
                        />
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          cursor="pointer"
                          className="inbound-icon-trash"
                          onClick={() => handleRejectPopUpOpenHandler(user)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data-message">Nothing to Display</p>
      )}
      {showRequestPopup && selectedUser && (
        <RequestsPopup
          show={showRequestPopup}
          selectedUser={selectedUser}
          closeRequests={closeRequestDetails}
        />
      )}
      {showDatePicker && (
        <div className="inbound-overlay">
          <div className="inbound-date-picker-popup">
            <FontAwesomeIcon
              icon={faTimes}
              className="inbound-close-button"
              onClick={() => setShowDatePicker(false)}
            />
            <h2>Schedule Meeting</h2>
            <input
              type="text"
              value={selectedDate ? selectedDate.toLocaleString("en-GB") : ""}
              readOnly
              className="inbound-selected-date-input"
            />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              showTimeSelect
              inline
              timeIntervals={30}
              dateFormat="Pp"
              timeFormat="HH:mm"
              timeCaption="Time"
            />
            <button
              className="inbound-schedule-button"
              onClick={handleConfirmDate}
              disabled={isLoading}
            >
              Schedule Meeting
              {isLoading ? "Scheduling..." : "Schedule Meeting"}
            </button>
            {isLoading && <div className="loading-spinner">Loading...</div>} {/* Optional: Add a spinner */}
          </div>
        </div>
      )}

      {/* reject modal */}
      {showRejectPopupData.isShow && (
        <InspectionRejectModal
          isShow={showRejectPopupData.isShow}
          closeHandler={handleRejectPopUpCloseHandler}
          userId={showRejectPopupData.data._id}
          emailId={showRejectPopupData.data.email}
          setRejectionStatus={setRejectionStatus}
        />
      )}
    </div>
  );
}

export default InboundRequest;
