import axios from 'axios';
import React, { useState } from 'react'



function DeletePosterModal({ isShow, closeHandler, posterDeleteId, setDeleteStatus }) {
  const [isLoading, setIsLoading] = useState(false);

  const deletePosterHandler = async () => {
    if (posterDeleteId) {
      setIsLoading(true);
      try {
        const res = await axios.delete(
          `https://admin.kidgage.com/api/posters/${posterDeleteId}`
        );

        if (res.status === 200) {
          alert("successfully delete poster");
          setDeleteStatus(res.data)
          closeHandler()
          return;
        }
        alert(res.data.message);
      } catch (error) {
        console.log(`error in deleting poster error: ${error}`);
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
        <h2>Delete Poster</h2>
        <p>Are you sure you want to delete this Poster?</p>
        <div className="category-deletemodal-btn-container">
          <button
            onClick={closeHandler}
            disabled={isLoading}
            className="category-deletemodal-btn-cancel"
          >
            cancel
          </button>
          <button
            onClick={deletePosterHandler}
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

export default DeletePosterModal