import React, { useRef, useState } from "react";
import "./categoryAddModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const CategoryAddModal = ({ isShow, closeHandler }) => {
  const [newCategoryData, setNewCategoryData] = useState({
    title: "",
    categoryImage: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const categoryImageRef = useRef();

  //   create handler
  const handleCreate = async () => {
    const { categoryImage, title } = newCategoryData;
    if (!categoryImage || !title) {
      alert("Fill form completly");
      return;
    }

    setIsLoading(true);

    const newCategoryFormData = new FormData();

    newCategoryFormData.append("name", title);
    newCategoryFormData.append("image", categoryImage);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/course-category/add",
        newCategoryFormData
      );

      if (res.status !== 201) {
        alert("Error in creating new category");
        return;
      }

      alert("succesfully created new category");
      handleClose();
    } catch (error) {
      console.log(`error creating new category error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // close handler
  const handleClose = () => {
    categoryImageRef.current.value = null;
    setNewCategoryData({
      title: "",
      categoryImage: null,
    });
    closeHandler();
  };

  return (
    <div
      className={`category-addmodal-wrapper ${
        isShow ? "category-addmodal-show" : "category-addmodal-hide"
      }`}
    >
      <div className="category-addmodal-container">
        <span onClick={handleClose}>
          <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
        </span>
        <h2>Add New Category</h2>
        <div className="category-addmodal-form-container">
          <div className="category-addmodal-form-image-container">
            <label
              htmlFor="category-addmodal-form-imageuploder"
              className="category-addmodal-form-imageuploder-container"
            >
              <img
                src={
                  newCategoryData.categoryImage
                    ? URL.createObjectURL(newCategoryData.categoryImage)
                    : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                }
                alt="no image"
              />
            </label>
            <input
              id="category-addmodal-form-imageuploder"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={categoryImageRef}
              onChange={(e) =>
                setNewCategoryData({
                  ...newCategoryData,
                  categoryImage: e.target.files[0],
                })
              }
            />
          </div>
          <div className="category-addmodal-form-inputs-container">
            <p>Category name</p>
            <input
              type="text"
              value={newCategoryData.title}
              onChange={(e) =>
                setNewCategoryData({
                  ...newCategoryData,
                  title: e.target.value,
                })
              }
            />
          </div>
          <button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "please wait" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryAddModal;
