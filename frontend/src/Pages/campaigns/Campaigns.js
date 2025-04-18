import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Campaigns.css";
import {
  faPenToSquare,
  faPlus,
  faToggleOff,
  faToggleOn,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HomeCampaignAddModal from "../../components/campaignAddModal/campaignAddModal";
import CampaignEditModal from "../../components/campaignEditModal/campaignEditModal";
import Appbar from "../../components/common/appbar/Appbar";
import CampaignDeleteModal from "../../components/campaignDeleteModal/campaignDeleteModal";
function Campaigns(searchdata) {
  const [showHomeBannerModal, setShowHomeBannerModal] = useState({
    isShow: false,
    tab: null,
  });
  const [showBannerEditModal, setShowBannerEditModal] = useState({
    isShow: false,
    tab: null,
    data: null,
  });
  const [showBannerDeleteModal, setShowBannnerDeleteModal] = useState({
    idShow: false,
    tab: null,
    data: null,
  });
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("tab-1");
  const [MobileBanners, setMobileBanners] = useState([]);
  const [DesktopBanners, setDesktopBanners] = useState([]);
  const [toggleCheckedId, setToggleCheckedId] = useState([]);
  const [searchKey, setSearchKey] = useState("")
  const [addstatus, setAddStatus] = useState([]);
  const [deleteStatus, setDeleteStatus] = useState([]);
  const [editStatus, setEditStatus] = useState([]);

  // home banner add open modal handler
  const openHomeBannerModalHandler = (tab) =>
    setShowHomeBannerModal({ isShow: true, tab });
  // home banner add close modal handler
  const closeHomeBannerModalHandler = () =>
    setShowHomeBannerModal({ isShow: false, tab: null });

  // banner edit modal open handler
  const openBannerEditModal = (tab, data) => {
    setShowBannerEditModal({ isShow: true, tab, data });
  };
  // banner edit modal close handler
  const closeBannerEditModal = () => {
    setShowBannerEditModal({ isShow: false, tab: null, data: null });
  };
  const openBannerDeleteModal = (tab, data) => {
    setShowBannnerDeleteModal({ isShow: true, tab, data });
  };
  const closeBannerDeleteModal = () => {
    setShowBannnerDeleteModal({ isShow: false, tab: null, data: null });
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB").replace(/\//g, ".");
  };

  const fetchBanners = async (searchTerm = "") => {
    setLoading(true);  // Start loading before making the request
    try {
      let response;

      // If there is a searchTerm, make the search request
      if (searchTerm) {
        response = await axios.get(`https://admin.kidgage.com/api/banners/banner-search?search=${searchTerm}`);
      } else {
        // Otherwise, make the normal request to fetch all banners
        response = await axios.get(`https://admin.kidgage.com/api/banners`);
      }

      // After getting the response, set the banners data
      setBanners(response.data);

    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);  // Set loading state to false once the request is finished
    }
  };


  const fetchDesktopBanners = async (searchTerm = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://admin.kidgage.com/api/desktop-banners/?search=${searchTerm}`
      );
      console.log(response.data);
      setDesktopBanners(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setLoading(false);
    }
  };
  const fetchMobileBanners = async (searchTerm = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://admin.kidgage.com/api/mobile-banners/?search=${searchTerm}`
      );
      // console.log(response.data);
      setMobileBanners(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setLoading(false);
    }
  };

  // toggle handler
  const toggleHandler = async (tab, bannerId, bannerStatus) => {
    // toggle api based on tab
    const toggleApiBasedOnTab = () => {
      switch (tab) {
        case "home":
          return `https://admin.kidgage.com/api/banners/update-status/${bannerId}`;
        case "desktop":
          return `https://admin.kidgage.com/api/desktop-banners/update-status/${bannerId}`;
        case "mobile":
          return `https://admin.kidgage.com/api/mobile-banners/update-status/${bannerId}`;
        default:
          return "";
      }
    };

    if (!tab || !bannerId) {
      alert("camapign toggle data missing");
      return;
    }

    // restrict continues call
    if (toggleCheckedId.find((val) => (val === bannerId ? true : false))) {
      return;
    }

    setToggleCheckedId([...toggleCheckedId, bannerId]);

    try {
      const res = await axios.put(toggleApiBasedOnTab(), { bannerStatus });
      if (res.status !== 200) {
        alert("toggle action not successfull");
      }
    } catch (error) {
      console.log(`error in toggling banner id: ${bannerId} error: ${error}`);
    } finally {
      setToggleCheckedId((preValue) =>
        preValue.filter((val) => val !== bannerId)
      );
    }
  };

  const handleChildData = (data) => {
    setSearchKey(data); // Set the received data to state
    searchBanners(data, selectedTab); // Filter based on selected tab
  };

  const searchBanners = (searchTerm, selectedTab) => {

    if (selectedTab === "tab-1") {
      fetchBanners(searchTerm);
    } else if (selectedTab === "tab-2") {
      fetchDesktopBanners(searchTerm);
    } else if (selectedTab === "tab-3") {
      fetchMobileBanners(searchTerm);
    }
    else {
      console.log('nothing to display');
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchMobileBanners();
    fetchDesktopBanners();
  }, [searchKey, addstatus, deleteStatus, editStatus]);

  return (
    <div className="campaign-container">
      {
        !searchdata ||
          (Array.isArray(searchdata) && searchdata.length === 0) ||
          (typeof searchdata === 'object' && Object.keys(searchdata).length === 0)
          ? <Appbar sendDataToParent={handleChildData} />
          : null
      }
      <div className="campaign-heading">
        {" "}
        <h1 className="campaign-heading-h3"> Campaigns</h1>
      </div>
      <div className="campaign-box-container">
        {loading ? (
          <h1
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "red",
            }}
          >
            {" "}
            Loading...
          </h1>
        ) : banners.length > 0 ? (
          <div className="tabs">
            <div className="tab">
              <input
                type="radio"
                name="css-tabs"
                id="tab-1"
                class="tab-switch"
                checked={selectedTab === "tab-1"}
                onChange={() => setSelectedTab("tab-1")}
              ></input>
              <label for="tab-1" class="tab-label">
                Home Banner
              </label>

              <div className="tab-content">
                <div className="campaign-button-container">
                  <button
                    className="add-campaign-button"
                    onClick={() => openHomeBannerModalHandler("home")}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ color: "#ffffff" }}
                    />
                    Add campaign
                  </button>
                </div>
                {banners.map((item) => (
                  <div className="grid-banner-container">
                    <div className="grid-item ">
                      <img
                        className="home-banner-img"
                        src={item.imageUrl}
                        alt="no image"
                      />
                    </div>
                    <div className="grid-item ">
                      <div className="campaign-details">
                        <p>{item.title}</p>
                        <p>{item.bookingLink}</p>
                        <div className="campaign-date-container">
                          {" "}
                          <p>
                            Starting Date :{formatDate(item.startDate)}
                          </p>{" "}
                          <p>Ending Date: {formatDate(item.endDate)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid-item ">
                      <div className="campaign-actions">
                        <label class="switch">
                          <input
                            type="checkbox"
                            defaultChecked={item.status}
                            onChange={() =>
                              toggleHandler("home", item._id, item.status)
                            }
                            disabled={toggleCheckedId.find((val) =>
                              val === item._id ? true : false
                            )}
                          ></input>
                          <span class="slider round"></span>
                        </label>
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          style={{ color: "#106cb1" }}
                          onClick={() => openBannerEditModal("home", item)}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: "#d70404" }}
                          onClick={() => openBannerDeleteModal("home", item)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tab">
              <input
                type="radio"
                name="css-tabs"
                id="tab-2"
                class="tab-switch"
                checked={selectedTab === "tab-2"}
                onChange={() => setSelectedTab("tab-2")}
              ></input>{" "}
              <label for="tab-2" class="tab-label">
                Desktop Banner
              </label>
              <div className="tab-content">
                <div className="campaign-button-container">
                  <button
                    className="add-campaign-button"
                    onClick={() => openHomeBannerModalHandler("desktop")}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ color: "#ffffff" }}
                    />
                    Add campaign
                  </button>
                </div>
                {DesktopBanners.map((item) => (
                  <div className="grid-banner-container-desk">
                    <div className="grid-item ">
                      <div>
                        <img
                          className="desktop-banner-img"
                          src={item.imageUrl}
                          alt="no image"
                        />
                      </div>
                    </div>
                    <div className="grid-item ">
                      <div className="campaign-details">
                        <p>{item.title}</p>
                        <p>{item.bookingLink}</p>
                        <div className="campaign-date-container">
                          {" "}
                          <p>
                            Starting Date :{formatDate(item.startDate)}
                          </p>{" "}
                          <p style={{ marginRight: "30px" }}>
                            Ending Date :{formatDate(item.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid-item ">
                      <div className="campaign-actions">
                        {" "}
                        <label class="switch">
                          <input
                            type="checkbox"
                            defaultChecked={item.status}
                            onChange={() =>
                              toggleHandler("desktop", item._id, item.status)
                            }
                            disabled={toggleCheckedId.find((val) =>
                              val === item._id ? true : false
                            )}
                          ></input>
                          <span class="slider round"></span>
                        </label>
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          style={{ color: "#106cb1", marginLeft: "20px" }}
                          onClick={() => openBannerEditModal("desktop", item)}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: "#d70404", marginLeft: "15px" }}
                          onClick={() => openBannerDeleteModal("desktop", item)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tab">
              <input
                type="radio"
                name="css-tabs"
                id="tab-3"
                class="tab-switch"
                checked={selectedTab === "tab-3"}
                onChange={() => setSelectedTab("tab-3")}
              ></input>{" "}
              <label for="tab-3" class="tab-label">
                Mobile Banner
              </label>
              <div className="tab-content">
                <div className="campaign-button-container">
                  <button
                    className="add-campaign-button"
                    onClick={() => openHomeBannerModalHandler("mobile")}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ color: "#ffffff" }}
                    />
                    Add campaign
                  </button>
                </div>
                {MobileBanners.map((item) => (
                  <div className="grid-banner-container">
                    <div className="grid-item ">
                      <div style={{ width: "100%" }}>
                        <img
                          className="mobile-banner-img"
                          src={item.imageUrl}
                        />
                      </div>
                    </div>
                    <div className="grid-item ">
                      <div className="campaign-details">
                        <p>{item.title}</p>
                        <p>{item.bookingLink}</p>
                        <div className="campaign-date-container">
                          {" "}
                          <p>
                            Starting Date :{formatDate(item.startDate)}
                          </p>{" "}
                          <p>Ending Date :{formatDate(item.endDate)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid-item ">
                      <div className="campaign-actions">
                        <label class="switch">
                          <input
                            type="checkbox"
                            defaultChecked={item.status}
                            onChange={() =>
                              toggleHandler("mobile", item._id, item.status)
                            }
                            disabled={toggleCheckedId.find((val) =>
                              val === item._id ? true : false
                            )}
                          ></input>
                          <span class="slider round"></span>
                        </label>
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          style={{ color: "#106cb1" }}
                          onClick={() => openBannerEditModal("mobile", item)}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: "#d70404" }}
                          onClick={() => openBannerDeleteModal("mobile", item)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "red",
              fontSize: "30px",
              marginTop: "70px",
            }}
          >
            Nothing to Display{" "}
          </p>
        )}
      </div>
      {/* Add modal */}
      {showHomeBannerModal.isShow && (
        <HomeCampaignAddModal
          isShow={showHomeBannerModal.isShow}
          closeHandler={closeHomeBannerModalHandler}
          tab={showHomeBannerModal.tab}
          setAddStatus={setAddStatus}
        />
      )}
      {/* edit modal */}
      {showBannerEditModal.isShow && (
        <CampaignEditModal
          isShow={showBannerEditModal.isShow}
          closeHandler={closeBannerEditModal}
          tab={showBannerEditModal.tab}
          modalData={showBannerEditModal.data}
          setEditStatus={setEditStatus}
        />
      )}
      {showBannerDeleteModal.isShow && (
        <CampaignDeleteModal
          isShow={showBannerDeleteModal.isShow}
          closeHandler={closeBannerDeleteModal}
          tab={showBannerDeleteModal.tab}
          modalData={showBannerDeleteModal.data}
          setDeleteStatus={setDeleteStatus}
        />
      )}
    </div>
  );
}

export default Campaigns;
