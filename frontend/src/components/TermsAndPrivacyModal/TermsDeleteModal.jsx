import axios from 'axios';
import React, { useState } from 'react'


function TermsDeleteModal({ isShow, closeHandler, termDeleteId, setDeleteStatus }) {
 const [isLoading, setIsLoading] = useState(false);

 const deleteTermsHandler = async () => {
  if (termDeleteId) {
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `http://localhost:5001/api/terms-condition/delete/${termDeleteId}`
      );

      if (res.status === 200) {
        alert("Successfully deleted news");
        setDeleteStatus(res.data);
        closeHandler();
        return;
      }
      alert(res.data.message);
    } catch (error) {
      console.log(`Error in deleting news: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }
};

  return (
   
    <div
      className={`category-deletemodal-wrapper ${isShow ? "category-deletemodal-show" : "category-deletemodal-hide"
        }`}
    >
      <div className="category-deletemodal-container">
        <h2>Delete News</h2>
        <p>Are you sure you want to delete this news?</p>
        <div className="category-deletemodal-btn-container">
          <button
            onClick={closeHandler}
            disabled={isLoading}
            className="category-deletemodal-btn-cancel"
          >
            Cancel
          </button>
          <button
            onClick={deleteTermsHandler}
            disabled={isLoading}
            className="category-deletemodal-btn-delete"
          >
            {isLoading ? "Please wait" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TermsDeleteModal