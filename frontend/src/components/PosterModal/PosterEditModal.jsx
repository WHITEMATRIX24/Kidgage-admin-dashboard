import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react'
import "./PosterEditModal.css";
import "./AddPosterModal.css";
import axios from 'axios';




function PosterEditModal({ isShow, closeHandler, posterData, setEditStatus }) {
  const [newPosterFormData, setNewPosterFormData] = useState({
    posterName: posterData.name || "",
    description: posterData.description || "",
    link: posterData.link || "",
    startDate: posterData.startDate ? posterData.startDate.split("T")[0] : "",
    endDate: posterData.endDate ? posterData.endDate.split("T")[0] : "",
    location: posterData.location || "",
    imageUploded: posterData.image || null,
  });
  const [uploadImageUrl, setUploadImageUrl] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const posterAddImageRef = useRef();

  // handle publish
  const handlePublish = async (e) => {
    e.preventDefault();

    const {
      link,
      posterName,
      description,
      endDate,
      imageUploded,
      location,
      startDate,
    } = newPosterFormData;


    if (
      !posterName ||
      !link ||
      !description ||
      !endDate ||
      !startDate ||
      !location ||
      !imageUploded
    ) {
      alert("Fill the form completly");
      return;
    }

    setIsLoading(true);

    const isoStartDate = new Date(startDate).toISOString();
    const isoEndDate = new Date(endDate).toISOString();

    const formData = new FormData();
    formData.append("name", posterName);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("startDate", isoStartDate);
    formData.append("endDate", isoEndDate);
    formData.append("link", link);
    formData.append("image", imageUploded);

    try {
      const res = await axios.put(`http://localhost:5001/api/posters/${posterData._id}`,
        formData);

      if (res.status == 200) {
        alert("Successfully Updated");
        setEditStatus(res.data)
        handleClose();
        return;
      }
      //   alert(res.data.message);
      //   handleClose();
    } catch (error) {
      console.log(`error in creating new Campaign error: ${error}`);
    } finally {
      setIsLoading(true);
    }
  };



  // image edit upload handler
  const imageUploadHandler = (file) => {
    const localUrl = URL.createObjectURL(file);
    setUploadImageUrl(localUrl);
    setNewPosterFormData({ ...newPosterFormData, imageUploded: file });
  };
  // close handler
  const handleClose = () => {
    posterAddImageRef.current.value = null;
    setNewPosterFormData({
      posterName: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      link: "",
      imageUploded: null,
    });
    closeHandler();
  };


  return (
    <div
      className={`poster-editmodal-wrapper ${isShow ? "poster-editmodal-show " : "poster-editmodal-hide "
        }`}
    >

      <div className='poster-editmodal-container'>
        <span onClick={handleClose}>
          <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
        </span>
        <h2>Edit Poster</h2>
        <form className="campaign-addmodal-form">
          {/* form left side */}
          <div className="campaign-addmodal-form-left">
            <div className="campaign-addmodal-form-fieldcontainer">
              <p>Name</p>
              <input
                type="text"
                className="campaign-addmodal-form-input"
                value={newPosterFormData.posterName}
                onChange={(e) =>
                  setNewPosterFormData({
                    ...newPosterFormData,
                    posterName: e.target.value,
                  })
                }
              />
            </div>

            <div className="campaign-addmodal-form-fieldcontainer">
              <p>Description</p>
              <textarea
                type="text"
                className="campaign-addmodal-form-input"
                value={newPosterFormData.description}
                onChange={(e) =>
                  setNewPosterFormData({
                    ...newPosterFormData,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="campaign-addmodal-form-fieldcontainer">
              <p>Location</p>
              <input
                type="text"
                className="campaign-addmodal-form-input"
                value={newPosterFormData.location}
                onChange={(e) =>
                  setNewPosterFormData({
                    ...newPosterFormData,
                    location: e.target.value,
                  })
                }
              />
            </div>
            <div className="campaign-addmodal-form-datecontainer">
              <div className="campaign-addmodal-form-fieldcontainer">
                <p>Start Date</p>
                <input
                  type="date"
                  className="campaign-addmodal-form-input"
                  value={newPosterFormData.startDate}
                  onChange={(e) =>
                    setNewPosterFormData({
                      ...newPosterFormData,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="campaign-addmodal-form-fieldcontainer">
                <p>End Date</p>
                <input
                  type="date"
                  className="campaign-addmodal-form-input"
                  value={newPosterFormData.endDate}
                  onChange={(e) =>
                    setNewPosterFormData({
                      ...newPosterFormData,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="campaign-addmodal-form-fieldcontainer">
              <p>Link</p>
              <input
                type="text"
                className="campaign-addmodal-form-input"
                value={newPosterFormData.link}
                onChange={(e) =>
                  setNewPosterFormData({
                    ...newPosterFormData,
                    link: e.target.value,
                  })
                }
              />
            </div>
          </div>
          {/* form right side */}
          <div className="campaign-addmodal-form-right">
            <div className="campaign-addmodal-form-fieldcontainer">
              {/* <p>{textBasedOnTab()}</p> */}
              <label
                htmlFor="campaign-addmodal-form-imageuploder"
                className="campaign-addmodal-form-imageuploder-container"
              >
                <img
                  src={
                    uploadImageUrl ||
                    newPosterFormData.imageUploded ||
                    "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                  }
                  alt="no image"
                  style={{ objectFit: "contain" }}
                />
              </label>
              <input
                id="campaign-addmodal-form-imageuploder"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={posterAddImageRef}
                onChange={(e) => imageUploadHandler(e.target.files[0])}
              />
            </div>
            <button
              className="campaign-addmodal-form-publishbtn"
              onClick={(e) => handlePublish(e)}
              disabled={isLoading}
            >
              Update
              {isLoading ? "please wait" : "Publish"}
            </button>
          </div>
        </form>


      </div>

    </div>
  )
}

export default PosterEditModal