import React, { useRef, useState } from "react";
import "./campaignAddModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const CampaignAddModal = ({ isShow, closeHandler, tab }) => {
  const [newCampaignFormData, setNewCampaignFormData] = useState({
    campaignName: "",
    link: "",
    startDate: "",
    endDate: "",
    campaignFees: "",
    imageUploded: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const campaignAddImageRef = useRef();

  // api based on tab
  const apiBasedOnTab = () => {
    switch (tab) {
      case "home":
        return "http://localhost:5001/api/banners/addbanner";
      case "desktop":
        return "http://localhost:5001/api/desktop-banners/addbanner";
      case "mobile":
        return "http://localhost:5001/api/mobile-banners/addbanner";
      default:
        return "";
    }
  };

  // text based on tab
  const textBasedOnTab = () => {
    switch (tab) {
      case "home":
        return "Select image (1055 x 275)";
      case "desktop":
        return "Select image (342 x 634)";
      case "mobile":
        return "Select image (634 x 342)";
      default:
        return "";
    }
  };

  // handle publish
  const handlePublish = async (e) => {
    e.preventDefault();

    const {
      campaignFees,
      campaignName,
      endDate,
      imageUploded,
      link,
      startDate,
    } = newCampaignFormData;

    if (
      !campaignName ||
      !campaignFees ||
      !endDate ||
      !startDate ||
      !link ||
      !imageUploded
    ) {
      alert("Fill the form completly");
      return;
    }

    setIsLoading(true);

    const isoStartDate = new Date(startDate).toISOString();
    const isoEndDate = new Date(endDate).toISOString();

    const formData = new FormData();
    formData.append("title", campaignName);
    formData.append("bookingLink", link);
    formData.append("startDate", isoStartDate);
    formData.append("endDate", isoEndDate);
    formData.append("fee", campaignFees);
    formData.append("image", imageUploded);

    try {
      const res = await axios.post(apiBasedOnTab(), formData);

      if (res.status !== 201) {
        alert(res.data.message);
        return;
      }
      alert(res.data.message);
      handleClose();
    } catch (error) {
      console.log(`error in creating new Campaign error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // close handler
  const handleClose = () => {
    campaignAddImageRef.current.value = null;
    setNewCampaignFormData({
      campaignName: "",
      link: "",
      startDate: "",
      endDate: "",
      campaignFees: "",
      imageUploded: null,
    });
    closeHandler();
  };

  return (
    <div
      className={`campaign-addmodal-wrapper ${
        isShow ? "campaign-addmodal-show" : "campaign-addmodal-hide"
      }`}
    >
      <div className="campaign-addmodal-container">
        <span onClick={handleClose}>
          <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
        </span>
        <h2>Add New Campaign</h2>
        <form className="campaign-addmodal-form">
          {/* form left side */}
          <div className="campaign-addmodal-form-left">
            <div className="campaign-addmodal-form-fieldcontainer">
              <p>Campaign Name</p>
              <input
                type="text"
                className="campaign-addmodal-form-input"
                value={newCampaignFormData.campaignName}
                onChange={(e) =>
                  setNewCampaignFormData({
                    ...newCampaignFormData,
                    campaignName: e.target.value,
                  })
                }
              />
            </div>
            <div className="campaign-addmodal-form-fieldcontainer">
              <p>Link</p>
              <input
                type="text"
                className="campaign-addmodal-form-input"
                value={newCampaignFormData.link}
                onChange={(e) =>
                  setNewCampaignFormData({
                    ...newCampaignFormData,
                    link: e.target.value,
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
                  value={newCampaignFormData.startDate}
                  onChange={(e) =>
                    setNewCampaignFormData({
                      ...newCampaignFormData,
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
                  value={newCampaignFormData.endDate}
                  onChange={(e) =>
                    setNewCampaignFormData({
                      ...newCampaignFormData,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="campaign-addmodal-form-fieldcontainer">
              <p>Campaign fees</p>
              <input
                type="text"
                className="campaign-addmodal-form-input"
                value={newCampaignFormData.campaignFees}
                onChange={(e) =>
                  setNewCampaignFormData({
                    ...newCampaignFormData,
                    campaignFees: e.target.value,
                  })
                }
              />
            </div>
          </div>
          {/* form right side */}
          <div className="campaign-addmodal-form-right">
            <div className="campaign-addmodal-form-fieldcontainer">
              <p>{textBasedOnTab()}</p>
              <label
                htmlFor="campaign-addmodal-form-imageuploder"
                className="campaign-addmodal-form-imageuploder-container"
              >
                <img
                  src={
                    newCampaignFormData.imageUploded
                      ? URL.createObjectURL(newCampaignFormData.imageUploded)
                      : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
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
                ref={campaignAddImageRef}
                onChange={(e) =>
                  setNewCampaignFormData({
                    ...newCampaignFormData,
                    imageUploded: e.target.files[0],
                  })
                }
              />
            </div>
            <button
              className="campaign-addmodal-form-publishbtn"
              onClick={(e) => handlePublish(e)}
              disabled={isLoading}
            >
              {isLoading ? "please wait" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignAddModal;
