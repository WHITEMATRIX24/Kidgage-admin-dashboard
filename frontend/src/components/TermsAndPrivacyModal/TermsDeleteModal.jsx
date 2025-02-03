import axios from 'axios';
import React, { useState } from 'react'


function TermsDeleteModal({ isShow, closeHandler, termDeleteId, setDeleteStatus }) {
 const [isLoading, setIsLoading] = useState(false);


 const deleteTermHandler = async () => {
    if (termDeleteId) {
      setIsLoading(true);
      try {
        const res = await axios.delete(
          `http://localhost:5001/api/terms-condition/delete/${termDeleteId}`
        );

        if (res.status === 200) {
          alert("successfully delete Terms and condition");
          setDeleteStatus(res.data)
        handleClose()
          return;
        }
        alert(res.data.message);
      } catch (error) {
        console.log(`error in deleting terms and conditions error: ${error}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    closeHandler();
  };

  return (
    <div
      className={`category-deletemodal-wrapper ${isShow ? "category-deletemodal-show" : "category-deletemodal-hide"
        }`}
    >
      <div className="category-deletemodal-container">
        <h2>Delete Terms and Conditions</h2>
        <p>Are you sure you want to delete this Terms and Condition?</p>
        <div className="category-deletemodal-btn-container">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="category-deletemodal-btn-cancel"
          >
            cancel
          </button>
          <button
            onClick={deleteTermHandler}
            disabled={isLoading}
            className="category-deletemodal-btn-delete"
          >
            {isLoading ? "please wait" : "delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TermsDeleteModal