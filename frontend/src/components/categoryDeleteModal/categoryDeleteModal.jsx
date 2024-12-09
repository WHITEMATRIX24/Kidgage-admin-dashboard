import React, { useState } from "react";
import "./categoryDeleteModal.css";
import axios from "axios";

const CategoryDeleteModal = ({ isShow, closeHandler, categoryDeleteId }) => {
  const [isLoading, setIsLoading] = useState(false);

  // category delete handler
  const deleteCategoryHandler = async () => {
    if (categoryDeleteId) {
      setIsLoading(true);
      try {
        const res = await axios.delete(
          `https://kidgage-dashboar-newui.onrender.com/api/course-category/delete/${categoryDeleteId}`
        );

        if (res.status === 200) {
          alert("successfully delete category");
          return;
        }
        alert(res.data.message);
      } catch (error) {
        console.log(`error in deleting category error: ${error}`);
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
        <h2>Delete category</h2>
        <p>Are you sure you want to delete this category?</p>
        <div className="category-deletemodal-btn-container">
          <button
            onClick={closeHandler}
            disabled={isLoading}
            className="category-deletemodal-btn-cancel"
          >
            cancel
          </button>
          <button
            onClick={deleteCategoryHandler}
            disabled={isLoading}
            className="category-deletemodal-btn-delete"
          >
            {isLoading ? "please wait" : "delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDeleteModal;
