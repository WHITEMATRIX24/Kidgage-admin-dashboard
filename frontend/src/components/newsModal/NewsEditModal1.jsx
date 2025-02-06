import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useRef, useState } from 'react';


function NewsEditModal1({ isShow, closeHandler, newsData, setEditStatus }) {

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
    const maxCharLimit = 1870;
    const minCharLimit = 1800;

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
            const res = await axios.put(`https://admin.kidgage.com/api/news/${newsData._id}`, formData);
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
        <div
            className={`campaign-addmodal-wrapper ${isShow ? "campaign-addmodal-show" : "campaign-addmodal-hide"
                }`}
        >
            <div className="campaign-addmodal-container">
                <span onClick={handleClose}>
                    <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
                </span>
                <h2>Edit News</h2>
                <form className="campaign-addmodal-form">
                    {/* form left side */}
                    <div className="campaign-addmodal-form-left">
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
                                maxLength={maxCharLimit}
                                minLength={minCharLimit}
                            />
                            {/* Character count and limits display */}
                            <span style={{ color: 'red', fontSize: '12px', fontWeight: '300' }}>
                                Character Count: {newNewsFormData.description.length}
                                {/* Display minimum and maximum character limits */}
                                (Min: {minCharLimit}, Max: {maxCharLimit}) characters
                            </span>
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
                    {/* form right side */}
                    <div className="campaign-addmodal-form-right">
                        <div className="campaign-addmodal-form-fieldcontainer">

                            <label
                                htmlFor="campaign-addmodal-form-imageuploder"
                                className="campaign-addmodal-form-imageuploder-container"
                            >
                                <img
                                    src={
                                        uploadImageUrl ||
                                        newNewsFormData.imageUploaded ||
                                        "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                                    }
                                    alt="uploaded"
                                    style={{ objectFit: "contain" }}
                                />
                            </label>
                            <input
                                id="campaign-addmodal-form-imageuploder"
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                ref={newsAddImageRef}
                                onChange={(e) => imageUploadHandler(e.target.files[0])}
                            />
                        </div>
                        <button
                            className="campaign-addmodal-form-publishbtn"
                            onClick={(e) => handleUpdate(e)}
                            disabled={isLoading}
                        >
                            {isLoading ? "please wait" : "update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewsEditModal1