import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react'

function PolicyEditModal({ isShow, closeHandler, policyData, setEditStatus }) {
  const [newData, setNewData] = useState({
    policy: policyData?.policy || "",
  });



  const handleCreate = async (policyId) => {
    const { policy } = newData; // Use newData from state to get 'terms'
    console.log("policy value:", policy); // Check what the terms value is

    if (!policy) {
      alert("policy cannot be empty");
      return;
    }

    // setIsLoading(true); // Uncomment to show a loading indicator (if applicable)

    try {
      // Make the PUT request to update the terms
      const res = await axios.put(
        `https://admin.kidgage.com/api/terms-condition/update-policy/${policyId}`,
        newData
      );

      // Check for a successful response (status 200)
      if (res.status !== 200) {
        alert("Error updating policy");
        return;
      }

      // If successful, show a success alert and update the status
      alert("Successfully updated new policy");
      setEditStatus(res.data);  // Assuming the updated terms data is returned here
      handleClose();  // Close the modal or perform any other actions

    } catch (error) {
      console.log(`Error updating terms: ${error}`);
      alert("There was an error updating the terms. Please try again.");
    } finally {
      // setIsLoading(false); // Uncomment to hide the loading indicator
    }
  };



  const handleClose = () => {
    closeHandler();
  };


  return (
    <div
      className={`category-addmodal-wrapper ${isShow ? "category-addmodal-show" : "category-addmodal-hide"
        }`}
    >
      <div className="category-addmodal-container" style={{ width: '48rem', height: '35rem' }}>
        <span onClick={handleClose}>
          <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
        </span>
        <h2>Update Privacy and Policy</h2>
        <div className="campaign-addmodal-form-fieldcontainer" style={{ marginTop: '50px' }}>
          <p>Privacy and Policy</p>
          <div className="campaign-addmodal-form-fieldcontainer">
            <textarea
              type="text"
              className="campaign-addmodal-form-input"
              value={newData?.policy}
              style={{ height: '200px' }}
              onChange={(e) =>
                setNewData({
                  ...newData,
                  policy: e.target.value,
                })
              }
            />
          </div>
        </div>
        <button
          className="campaign-addmodal-form-publishbtn"
          style={{ marginTop: '30px' }}
          onClick={() => handleCreate(policyData._id)}
        >
          Update

        </button>

      </div>
    </div>
  )
}

export default PolicyEditModal