import React, { useEffect, useState } from "react";
import "./categoryPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import CategoryAddModal from "../../components/categoryAddModal/categoryAddModal";
import axios from "axios";
import CategoryEditModal from "../../components/categoryEditModal/categoryEditModal";
import CategoryDeleteModal from "../../components/categoryDeleteModal/categoryDeleteModal";
import Appbar from "../../components/common/appbar/Appbar";

const CategoryPage = (searchdata) => {
  const [categoryData, setCategoryData] = useState([]);
  const [addstatus, setAddStatus] = useState([]);
  const [deleteStatus, setDeleteStatus] = useState([]);
  const [editStatus, setEditStatus] = useState([]);
  const [categoryAddModalState, setCategoryAddModalState] = useState(false);
  const [categoryEditModalState, setCategoryEditModalState] = useState({
    isShow: false,
    data: null,
  });
  const [categoryDeleteModalState, setCategoryDeleteModalState] = useState({
    isShow: false,
    categoryId: null,
  });
  const [searchKey, setSearchKey] = useState("")

  // Add categroy modal handler
  const categoryAddModalOpenHandler = () => setCategoryAddModalState(true);

  // Add categroy modal handler
  const categoryAddModalCloseHandler = () => setCategoryAddModalState(false);

  // edit category modal Open handler
  const categoryEditModalOpenHandler = (editModalData) =>
    setCategoryEditModalState({
      isShow: true,
      data: editModalData,
    });

  // edit category modal Close handler
  const categoryEditModalCloseHandler = (editModalData) =>
    setCategoryEditModalState({
      isShow: false,
      data: null,
    });

  // delete category modal open handler
  const deleteCategoryModalOpenHandler = (categoryId) => {
    setCategoryDeleteModalState({ isShow: true, categoryId });
  };

  // delete category modal close handler
  const deleteCategoryModalCloseHandler = (categoryId) => {
    setCategoryDeleteModalState({ isShow: false, categoryId: null });
  };

  console.log(searchKey);
  const SearchDataHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/course-category/categories-search?search=${searchKey}`
      );
      setCategoryData(res.data);
    } catch (error) {
      console.log(`error in searching categories error: ${error}`);
    }
  };




  // initial data handler
  const initialCategoryDataHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/course-category/categories?search=${searchKey}`
      );
      setCategoryData(res.data);
    } catch (error) {
      console.log(`error in fetching categories error: ${error}`);
    }
  };

  const handleChildData = (data) => {
    setSearchKey(data); // Set the received data to state
  };

  useEffect(() => {
    initialCategoryDataHandler();
    SearchDataHandler();
  }, [addstatus, editStatus, deleteStatus, searchKey]);

  return (
    <div className="categorypage-container">
      {
        !searchdata ||
          (Array.isArray(searchdata) && searchdata.length === 0) ||
          (typeof searchdata === 'object' && Object.keys(searchdata).length === 0)
          ? <Appbar sendDataToParent={handleChildData} />
          : null
      }
      <h3 className="category-content-h3">Categories</h3>
      <div className="categorypage-content-container">
        <div className="categorypage-content-header">
          <h4>Program Categories</h4>
        </div>
        <div className="categorypage-content-header1">
          <button onClick={categoryAddModalOpenHandler}>+ Add Category</button>
        </div>
        <div className="categorypage-card-container">
          {categoryData.map((category) => (
            <div className="categorypage-card" key={category._id}>
              <img src={category.image} alt="category-image" />
              <div className="categorypage-card-details">
                <p>{category.name}</p>
                <div className="categorypage-card-actions-container">
                  <button
                    className="categorypage-card-action-btn categorypage-card-action-edit"
                    onClick={() => categoryEditModalOpenHandler(category)}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    className="categorypage-card-action-btn categorypage-card-action-delete"
                    onClick={() => deleteCategoryModalOpenHandler(category._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Add modal */}
      {categoryAddModalState && (
        <CategoryAddModal
          isShow={categoryAddModalState}
          closeHandler={categoryAddModalCloseHandler}
          setAddStatus={setAddStatus}
        />
      )}
      {/* Edit modal */}
      {categoryEditModalState.isShow && (
        <CategoryEditModal
          isShow={categoryEditModalState.isShow}
          closeHandler={categoryEditModalCloseHandler}
          categoryData={categoryEditModalState.data}
          setEditStatus={setEditStatus}
        />
      )}
      {/* delete modal */}
      {categoryDeleteModalState.isShow && categoryDeleteModalState.isShow && (
        <CategoryDeleteModal
          isShow={categoryDeleteModalState.isShow}
          closeHandler={deleteCategoryModalCloseHandler}
          categoryDeleteId={categoryDeleteModalState.categoryId}
          setDeleteStatus={setDeleteStatus}
        />
      )}
    </div>
  );
};

export default CategoryPage;
