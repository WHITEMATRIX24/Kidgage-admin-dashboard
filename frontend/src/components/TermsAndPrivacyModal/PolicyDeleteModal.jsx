import axios from 'axios';
import React, { useState } from 'react'

function PolicyDeleteModal({ isShow, closeHandler, policyDeleteId, setDeleteStatus }) {
  const [isLoading, setIsLoading] = useState(false);

  const deletePolicyHandler = async () => {
      if (policyDeleteId) {
          setIsLoading(true);
          try {
              const res = await axios.delete(
                  `http://localhost:5001/api/terms-condition/delete/${policyDeleteId}`
              );

              if (res.status === 200) {
                  alert("Successfully deleted privacy and policy.");
                  setDeleteStatus(res.data);
                 closeHandler() // Close the modal after success
                  return;
              }
              alert(res.data.message);
          } catch (error) {
              console.log(`Error in deleting terms and conditions: ${error}`);
              alert('There was an error while deleting the policy.');
          } finally {
              setIsLoading(false);
          }
      }
  };


  return (
      <div
          className={`category-deletemodal-wrapper ${isShow ? "category-deletemodal-show" : "category-deletemodal-hide"}`}
      >
          <div className="category-deletemodal-container">
              <h2>Delete Privacy and Policy</h2>
              <p>Are you sure you want to delete this Terms and Condition?</p>
              <div className="category-deletemodal-btn-container">
                  <button
                      onClick={closeHandler}
                      disabled={isLoading}
                      className="category-deletemodal-btn-cancel"
                  >
                      Cancel
                  </button>
                  <button
                      onClick={deletePolicyHandler}
                      disabled={isLoading}
                      className="category-deletemodal-btn-delete"
                  >
                      {isLoading ? "Please wait..." : "Delete"}
                  </button>
              </div>
          </div>
      </div>
  );
}

export default PolicyDeleteModal