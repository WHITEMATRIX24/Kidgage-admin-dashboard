import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import "./AddNewsModal.css";
import axios from 'axios';

function NewsEditModal({ isShow, closeHandler, newsData, setEditStatus }) {
  const [newNewsFormData, setNewNewsFormData] = useState({
    title: newsData.title || "",
    description: newsData.description || "",
    publishedOn: newsData.publishedOn ? newsData.publishedOn.split("T")[0] : "",
    imageUploaded: newsData.image || null,
    activeStatus: newsData.activeStatus || true,
  });

  const [uploadImageUrl, setUploadImageUrl] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const newsAddImageRef = useRef();

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();

    const { title, description, publishedOn, imageUploaded } = newNewsFormData;

    if (!title || !description || !publishedOn || !imageUploaded) {
      alert("Please complete the form.");
      return;
    }

    setIsLoading(true);

    const isoPublishedOn = new Date(publishedOn).toISOString();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("publishedOn", isoPublishedOn);
    formData.append("image", imageUploaded);

    try {
      const res = await axios.put(`http://localhost:5001/api/news/${newsData._id}`, formData);

      if (res.status === 200) {
        alert("News successfully updated.");
        setEditStatus(res.data);
        handleClose();
        return;
      }
    } catch (error) {
      console.error(`Error updating news: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Image upload handler
  const imageUploadHandler = (file) => {
    const localUrl = URL.createObjectURL(file);
    setUploadImageUrl(localUrl);
    setNewNewsFormData({ ...newNewsFormData, imageUploaded: file });
  };

  // Close handler
  const handleClose = () => {
    newsAddImageRef.current.value = null;
    setNewNewsFormData({
      title: "",
      description: "",
      publishedOn: "",
      imageUploaded: null,
    });
    closeHandler();
  };

  return (
    <div className={`news-addmodal-wrapper ${isShow ? "news-addmodal-show" : "news-addmodal-hide"}`}>
      <div className="news-addmodal-container">
        <span onClick={handleClose}>
          <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
        </span>
        <h2>Edit News</h2>
        <form className="news-addmodal-form">
          {/* Form left side */}
          <div className="news-addmodal-form-left">
            <div className="news-addmodal-form-fieldcontainer">
              <p>Title</p>
              <input
                type="text"
                className="news-addmodal-form-input"
                value={newNewsFormData.title}
                onChange={(e) =>
                  setNewNewsFormData({
                    ...newNewsFormData,
                    title: e.target.value,
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
              <p>Published On</p>
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
                htmlFor="news-addmodal-form-imageuploader"
                className="news-addmodal-form-imageuploader-container"
              >
                <img
                  src={
                    uploadImageUrl ||
                    newNewsFormData.imageUploaded ||
                    "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                  }
                  alt="No image"
                  style={{ objectFit: "contain" }}
                />
              </label>
              <input
                id="news-addmodal-form-imageuploader"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={newsAddImageRef}
                onChange={(e) => imageUploadHandler(e.target.files[0])}
              />
            </div>
            <button
              className="news-addmodal-form-publishbtn"
              onClick={(e) => handleUpdate(e)}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewsEditModal;
