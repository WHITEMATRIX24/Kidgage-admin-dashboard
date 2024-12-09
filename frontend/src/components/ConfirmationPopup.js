// ConfirmationPopup.js
import React from 'react';
import './requestsPopup.css'; // Create a CSS file for confirmation popup styles

const ConfirmationPopup = ({ show, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
        <div className="confirmation-overlay">
            <div className="confirmation-window">
                <h4>Confirm Verification</h4>
                <p>Are you sure you want to verify this user?</p>
                <div className="confirmation-buttons">
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
