import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import "./AddNewsModal.css";
import axios from 'axios';

function AddNewsModal({ isShow, closeHandler, setAddStatus }) {
  const [newNewsFormData, setNewNewsFormData] = useState({
    newsTitle: "",
    description: "",
    publishedOn: "",
    imageUploaded: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const newsAddImageRef = useRef();
  console.log(newNewsFormData);

  // Handle publish
  const handlePublish = async (e) => {
    e.preventDefault();

    const { newsTitle, description, publishedOn, imageUploaded } = newNewsFormData;

    if (!newsTitle) {
      alert("Title is required");
      return;
    }
    if (!description) {
      alert("Description is required");
      return;
    }
    if (!publishedOn) {
      alert("Publish date is required");
      return;
    }
    if (!imageUploaded) {
      alert("Image is required");
      return;
    }


    setIsLoading(true);

    const isopublishedOn = new Date(publishedOn).toISOString();

    const formData = new FormData();
    formData.append("title", newsTitle);
    formData.append("description", description);
    formData.append("publishedOn", isopublishedOn);
    formData.append("image", imageUploaded);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/news/add",
        formData
      );

      if (res.status === 201) {
        alert("News added successfully");
        setAddStatus(res.data);
        handleClose();
        return;
      }
    } catch (error) {
      console.log(`Error in adding news: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Close handler
  const handleClose = () => {
    newsAddImageRef.current.value = null;
    setNewNewsFormData({
      newsTitle: "",
      description: "",
      location: "",
      publishedOn: "",
      source: "",
      imageUploaded: null,
    });
    closeHandler();
  };

  return (
    <div
      className={`news-addmodal-wrapper ${isShow ? "news-addmodal-show" : "news-addmodal-hide"}`}
    >
      <div className="news-addmodal-container">
        <span onClick={handleClose}>
          <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
        </span>
        <h2>Add New News</h2>
        <form className="news-addmodal-form">
          {/* Form left side */}
          <div className="news-addmodal-form-left">
            <div className="news-addmodal-form-fieldcontainer">
              <p>Title</p>
              <input
                type="text"
                className="news-addmodal-form-input"
                value={newNewsFormData.newsTitle}
                onChange={(e) =>
                  setNewNewsFormData({
                    ...newNewsFormData,
                    newsTitle: e.target.value,
                  })
                }
              />
            </div>

            <div className="news-addmodal-form-fieldcontainer">
              <p>Description</p>
              <textarea
                type="text"
                className="news-addmodal-form-input"
                value={newNewsFormData.description}
                onChange={(e) =>
                  setNewNewsFormData({
                    ...newNewsFormData,
                    description: e.target.value,
                  })
                }
              />
            </div>



            <div className="news-addmodal-form-fieldcontainer">
              <p>Publish Date</p>
              <input
                type="date"
                className="news-addmodal-form-input"
                value={newNewsFormData.publishedOn}
                onChange={(e) =>
                  setNewNewsFormData({
                    ...newNewsFormData,
                    publishedOn: e.target.value,
                  })
                }
              />
            </div>


          </div>

          {/* Form right side */}
          <div className="news-addmodal-form-right">
            <div className="news-addmodal-form-fieldcontainer">
              <label
                htmlFor="news-addmodal-form-imageuploder"
                className="news-addmodal-form-imageuploder-container"
              >
                <img
                  src={
                    newNewsFormData.imageUploaded
                      ? URL.createObjectURL(newNewsFormData.imageUploaded)
                      : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                  }
                  alt="no image"
                  style={{ objectFit: "contain" }}
                />
              </label>
              <input
                id="news-addmodal-form-imageuploder"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={newsAddImageRef}
                onChange={(e) =>
                  setNewNewsFormData({
                    ...newNewsFormData,
                    imageUploaded: e.target.files[0],
                  })
                }
              />
            </div>
            <button
              className="news-addmodal-form-publishbtn"
              onClick={(e) => handlePublish(e)}
              disabled={isLoading}
            >

              {isLoading ? " please wait" : " Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNewsModal;
