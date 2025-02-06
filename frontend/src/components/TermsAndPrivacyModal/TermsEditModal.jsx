import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react'


function TermsEditModal({ isShow, closeHandler, termsData, setEditStatus }) {
  const [newData, setNewData] = useState({
    terms: termsData?.terms || "",
  });
  //  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (termId) => {
    const { terms } = newData; // Use newData from state to get 'terms'
    console.log("terms value:", terms); // Check what the terms value is

    if (!terms) {
      alert("Terms cannot be empty");
      return;
    }

    // setIsLoading(true); // Uncomment to show a loading indicator (if applicable)

    try {
      // Make the PUT request to update the terms
      const res = await axios.put(
        `https://admin.kidgage.com/api/terms-condition/update-terms/${termId}`,
        newData
      );

      // Check for a successful response (status 200)
      if (res.status !== 200) {
        alert("Error updating terms");
        return;
      }

      // If successful, show a success alert and update the status
      alert("Successfully updated new terms");
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
        <h2>Add Terms And Conditions</h2>
        <div className="campaign-addmodal-form-fieldcontainer" style={{ marginTop: '50px' }}>
          <p>Terms And Conditions</p>
          <div className="campaign-addmodal-form-fieldcontainer">
            <textarea
              type="text"
              className="campaign-addmodal-form-input"
              value={newData?.terms}
              style={{ height: '200px' }}
              onChange={(e) =>
                setNewData({
                  ...newData,
                  terms: e.target.value,
                })
              }
            />
          </div>
        </div>
        <button
          className="campaign-addmodal-form-publishbtn"
          style={{ marginTop: '30px' }}
          onClick={() => handleCreate(termsData._id)}
        >
          Update

        </button>

      </div>
    </div>
  )
}

export default TermsEditModal