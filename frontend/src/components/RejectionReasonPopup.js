// RejectionReasonPopup.js
import React, { useState } from 'react';
import './requestsPopup.css'; // Create a CSS file for rejection reason popup styles

const RejectionReasonPopup = ({ show, onConfirm, onCancel }) => {
    const [reason, setReason] = useState('');

    if (!show) return null;

    return (
        <div className="rejection-overlay">
            <div className="rejection-window">
                <h4>Reason for Rejection</h4>
                <textarea
                    rows="4"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                />
                <div className="rejection-buttons">
                    <button onClick={() => onConfirm(reason)}>Confirm Reject</button>
                    <button onClick={onCancel}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default RejectionReasonPopup;
