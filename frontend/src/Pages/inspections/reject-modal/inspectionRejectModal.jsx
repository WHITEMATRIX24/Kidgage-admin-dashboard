import React, { useState } from "react";
import "./inspectionRejectModal.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const InspectionRejectModal = ({ isShow, closeHandler, userId, emailId }) => {
  const [textAreaData, setTextAreaData] = useState("");
  const [validateTextAreaData, setValidateTextAreaData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //   confirm Handler
  const confirmHandler = async () => {
    if (!textAreaData) {
      setValidateTextAreaData(true);
      return;
    }
    setValidateTextAreaData(false);
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `https://kidgage-dashboar-newui.onrender.com/api/users/academy/${userId}/${emailId}`,
        { data: { message: textAreaData } }
      );

      if (res.status === 200) {
        alert("Successfully rejected");
        cancelHandler();
      }
    } catch (error) {
      console.log(`Error in rejecting accademy error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  //   cancel Handler
  const cancelHandler = () => {
    setTextAreaData("");
    setValidateTextAreaData(false);
    closeHandler();
  };

  return (
    <div className={`inspection-reject-modal ${isShow ? "show" : "hidden"}`}>
      <div className={`inspection-reject-modal-container`}>
        <span onClick={closeHandler}>
          <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
        </span>
        <h3 className="inspection-reject-h3">
          Do you want to reject this request ?
        </h3>
        <div className="textArea-container">
          <textarea
            rows="10"
            placeholder="reason for rejection"
            value={textAreaData}
            onChange={(e) => setTextAreaData(e.target.value)}
          ></textarea>
          {validateTextAreaData && <p>need reason for rejection</p>}
        </div>
        <div className="inspection-reject-modal-btn-container">
          <button
            className="inspection-reject-btn inspection-reject-modal-btn-red"
            onClick={cancelHandler}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="inspection-reject-btn inspection-reject-modal-btn-green"
            onClick={confirmHandler}
            disabled={isLoading}
          >
            {isLoading ? "Please wait" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspectionRejectModal;
