import React from "react";
import "./campaignDeleteModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const CampaignDeleteModal = ({ isShow, closeHandler, tab, modalData }) => {

    // Function to get the correct API endpoint based on the tab
    const apiBasedOnTab = () => {
        switch (tab) {
            case "home":
                return `https://kidgage-dashboar-newui.onrender.com/api/banners/${modalData._id}`;
            case "desktop":
                return `https://kidgage-dashboar-newui.onrender.com/api/desktop-banners/${modalData._id}`;
            case "mobile":
                return `https://kidgage-dashboar-newui.onrender.com/api/mobile-banners/${modalData._id}`;
            default:
                return "";
        }
    };

    // Delete confirmation handler
    const confirmDelete = async () => {
        try {
            const apiUrl = apiBasedOnTab();
            if (apiUrl) {
                await axios.delete(apiUrl);
                alert("Campaign deleted successfully.");
                closeHandler(); // Close the modal
                // Optionally call a function to refresh the list of campaigns here, if needed
            } else {
                alert("Error: Invalid API endpoint.");
            }
        } catch (error) {
            console.error("Error deleting campaign:", error);
            alert("Failed to delete the campaign. Please try again.");
        }
    };

    // Close handler
    const handleClose = () => {
        closeHandler();
    };

    return (
        <div className={`campaign-deletemodal-wrapper ${isShow ? "campaign-deletemodal-show" : "campaign-deletemodal-hide"}`}>
            <div className="campaign-deletemodal-container">
                <span onClick={handleClose}>
                    <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
                </span>
                <h2>Delete Banner</h2>
                <p>Are you sure you want to delete this banner?</p>
                <div className="modal-actions">
                    <button className="campaign-deletemodal-cancel" onClick={handleClose}>Cancel</button>
                    <button className="campaign-deletemodal-delete" onClick={confirmDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default CampaignDeleteModal;
