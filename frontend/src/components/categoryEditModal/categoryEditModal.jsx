import React, { useRef, useState } from "react";
import "./categoryEditModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const CategoryEditModal = ({ isShow, closeHandler, categoryData }) => {
  const [newCategoryData, setNewCategoryData] = useState({
    title: categoryData.name || "",
    categoryImage: categoryData.image || null,
  });
  const [categoryImagelocalUrl, setCategoryImagelocalUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const categoryImageRef = useRef();

  //   handle upload image local url
  const uploadImageHandler = (file) => {
    const localUrl = URL.createObjectURL(file);
    setCategoryImagelocalUrl(localUrl);
    setNewCategoryData({ ...newCategoryData, categoryImage: file });
  };

  //   create handler
  const handleCreate = async (categoryId) => {
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
      const res = await axios.put(
        `http://localhost:5001/api/course-category/update/${categoryId}`,
        newCategoryFormData
      );

      if (res.status !== 200) {
        alert("Error in updating new category");
        return;
      }

      alert("succesfully updated new category");
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
      className={`category-editmodal-wrapper ${
        isShow ? "category-editmodal-show" : "category-editmodal-hide"
      }`}
    >
      <div className="category-editmodal-container">
        <span onClick={handleClose}>
          <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
        </span>
        <h2>Edit Category</h2>
        <div className="category-editmodal-form-container">
          <div className="category-editmodal-form-image-container">
            <label
              htmlFor="category-editmodal-form-imageuploder"
              className="category-editmodal-form-imageuploder-container"
            >
              <img
                src={
                  categoryImagelocalUrl ||
                  newCategoryData.categoryImage ||
                  "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                }
                alt="no image"
              />
            </label>
            <input
              id="category-editmodal-form-imageuploder"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={categoryImageRef}
              onChange={(e) => uploadImageHandler(e.target.files[0])}
            />
          </div>
          <div className="category-editmodal-form-inputs-container">
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
          <button
            onClick={() => handleCreate(categoryData._id)}
            disabled={isLoading}
          >
            {isLoading ? "please wait" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditModal;
