import React, { useEffect, useState } from "react";
import axios from "axios";

import "./inspectionPage.css";
import Appbar from "../../components/common/appbar/Appbar";
import SuccessIcon from "../../components/iconsSvg/successIcon";
import RejectIcon from "../../components/iconsSvg/rejectIcon";

import InspectionRejectModal from "../inspections/reject-modal/inspectionRejectModal";
import InspectionApproveModal from "../inspections/approve-modal/inspectionApproveModal";
import {
  toRedableDate,
  toRedableDateAndTime,
} from "../../components/utils/redableDate";

const InspectionPage = (searchdata) => {
  const [meetingScheduledUsers, setMeetingScheduledUsrs] = useState([]);
  const [searchKey, setSearchKey] = useState("")
  const [modalState, setModalState] = useState({
    open: false,
    type: "",
    userData: null,
  });

  // modal open handler
  const openModalHandler = (type, userValue) => {
    setModalState({ open: true, type: type, userData: userValue });
  };
  // modal close handler
  const closeModalHandler = () => {
    setModalState({ open: false, type: "", userData: null });
  };

  console.log(searchKey);
  // initial scheduled meeting user data handler
  const meetingScheduledUserDataHandler = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/users/meeting-scheduled-users?search=${searchKey}`
      );
      setMeetingScheduledUsrs(response.data);
    } catch (error) {
      console.log(
        `error in fetching meeting scheduled users initial data error: ${error}`
      );
    }
  };

  const handleChildData = (data) => {
    setSearchKey(data); // Set the received data to state
  };

  useEffect(() => {
    meetingScheduledUserDataHandler();
  }, [searchKey]);

  return (
    <div className="inspectinPage-container">

      {
        !searchdata ||
          (Array.isArray(searchdata) && searchdata.length === 0) ||
          (typeof searchdata === 'object' && Object.keys(searchdata).length === 0)
          ? <Appbar sendDataToParent={handleChildData} />
          : null
      }

      <div className="inspectionPage-content">
        <h1 className="inspectionPage-content-h3">Inspection Schedule</h1>
        <div className="inspectionPage-content-container">
          {/* <h3 className="inspectionPage-table-h3">Inspection schedule</h3> */}
          <div className="inspectionPage-table-wrapper">
            <table className="inspectionPage-content-table">
              <thead>
                <tr>
                  <th>Meeting Date & Time</th>
                  <th>Academy Name</th>
                  <th>Request Date</th>
                  <th>Locations</th>
                  <th>Contact Number</th>
                </tr>
              </thead>
              <tbody>
                {meetingScheduledUsers.length > 0 &&
                  meetingScheduledUsers.map((scheduledUsers) => (
                    <tr key={scheduledUsers?._id}>
                      <td>
                        {toRedableDateAndTime(
                          scheduledUsers?.meetingScheduleDate
                        )}
                      </td>
                      <td className="inspectionPage-content-table-academytitle">
                        {/* <img src="" alt="" /> */}
                        {scheduledUsers?.username}
                      </td>
                      <td>{toRedableDate(scheduledUsers?.requestFiledDate)}</td>
                      <td>{scheduledUsers?.location}</td>
                      <td>{scheduledUsers?.phoneNumber}</td>
                      <td>
                        <div className="inspectionPage-content-table-actions">
                          <button
                            onClick={() =>
                              openModalHandler("reject", scheduledUsers)
                            }
                          >
                            <RejectIcon />
                          </button>
                          <button
                            onClick={() =>
                              openModalHandler("approve", scheduledUsers)
                            }
                          >
                            <SuccessIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* reject modal */}
      {modalState.open && modalState.type === "reject" && (
        <InspectionRejectModal
          isShow={modalState.open && modalState.type === "reject"}
          closeHandler={closeModalHandler}
          userId={modalState.userData?._id}
          emailId={modalState.userData?.email}
        />
      )}
      {/* aprrove modal */}
      {modalState.open &&
        modalState.type === "approve" &&
        modalState.userData && (
          <InspectionApproveModal
            isShow={
              modalState.open &&
              modalState.type === "approve" &&
              modalState.userData
            }
            closeHandler={closeModalHandler}
            providerData={{
              username: modalState.userData?.licenseNo,
              phoneNumber: modalState.userData?.phoneNumber,
              noOfCourses: modalState.userData?.noOfCourses,
              email: modalState.userData?.email,
              fullName: modalState.userData?.fullName,
              userId: modalState.userData?._id,
            }}
          />
        )}
    </div>
  );
};

export default InspectionPage;
