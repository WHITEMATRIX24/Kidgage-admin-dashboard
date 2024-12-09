import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faArrowLeft,
  faLocationDot,
  faGlobe,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import "./requestsPopup.css";

const RequestsPopup = ({ show, closeRequests, selectedUser }) => {
  const popupRef = useRef(null);

  const downloadFile = () => {
    const base64String = selectedUser.crFile; // Assuming this is the Base64 string
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${base64String}`; // Change mime type if needed
    link.download = "CRFile.pdf"; // Provide a default name
    link.click();
  };

  // Render nothing if show is false or no selected user
  if (!show || !selectedUser) return null;

  return (
    <>
      <div className="popup-overlay"></div>
      <div className="popup-window" ref={popupRef}>
        <button className="request-popup-close-button" onClick={closeRequests}>
          <FontAwesomeIcon
            icon={faTimes}
            className="request-popup-close-icon"
          />
        </button>
        <h3>Request Details</h3>
        <div className="request-popup-wrapper">
          <div className="pending-form">
            <div className="request-popup-header">
              <h4>{selectedUser.username}</h4>
              <div className="request-popup-header-icons">
                <a
                  href={selectedUser?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="request-popup-header-icon-globe"
                >
                  <FontAwesomeIcon
                    icon={faGlobe}
                    size="xl"
                    color="#ffffff"
                    className="request-popup-header-icon-globe"
                  />
                </a>
                <a
                  href={`https://www.instagram.com/${selectedUser?.instaId}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon style={{ cursor: "pointer", color: "#0080ff" }}
                    icon={faInstagram}
                    size="2xl"
                    className="request-popup-header-icon-instagram"
                  />
                </a>
                <button style={{ backgroundColor: "transparent", border: "none", cursor: "pointer", color: "#0080ff" }} onClick={downloadFile}>
                  <FontAwesomeIcon
                    icon={faDownload}
                    size="2xl"
                    className="request-popup-header-icon-instagram"
                  />
                </button>
              </div>
            </div>
            <div className="request-popup-content">
              <span className="request-popup-location">
                <strong>
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    style={{ color: "#c02626" }}
                    size="xl"
                  />
                </strong>
                <p>{selectedUser.location}</p>
              </span>
              <p className="request-popup-content-bio">
                {selectedUser.description}
              </p>
              <div className="pending-form-contacts-container">
                <p>
                  <strong>Contact Phone:</strong> {selectedUser.phoneNumber}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <button
          onClick={downloadFile}
          className="request-popup-download-button"
        >
          Download Uploaded File
        </button> */}
      </div>
    </>
  );
};

export default RequestsPopup;
