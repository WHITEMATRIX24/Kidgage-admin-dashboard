import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddAwardsModal.css';

function AddAwardsModal({ isShow, closeHandler }) {
    const [awards, setAwards] = useState([null, null, null]); // Store fetched images & new uploads
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const userId = sessionStorage.getItem("userid");

    // Fetch awards from backend when modal opens
    useEffect(() => {
        if (isShow) {
            fetchAwards();
        }
    }, [isShow]);

    const fetchAwards = async () => {
        try {
            const response = await axios.get(`https://admin.kidgage.com/api/users/${userId}/awards`);
            if (response.data.awards) {
                setAwards(response.data.awards.concat([null, null, null]).slice(0, 3));
            }
        } catch (error) {
            console.error("Error fetching awards:", error);
        }
    };

    const handleImageUpload = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const newAwards = [...awards];
            newAwards[index] = file; // Store the file directly
            setAwards(newAwards);
        }
    };

    const handleDeleteClick = (index) => {
        setDeleteIndex(index);
        setShowDeletePopup(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`https://admin.kidgage.com/api/users/${userId}/awards/${deleteIndex}`);
            const newAwards = [...awards];
            newAwards[deleteIndex] = null;
            setAwards(newAwards);
        } catch (error) {
            console.error("Error deleting award:", error);
        }
        setShowDeletePopup(false);
    };

    const deleteAward = async () => {
        try {
            await axios.delete(`https://admin.kidgage.com/api/users/${userId}/awards/${deleteIndex}`);
            const newAwards = [...awards];
            newAwards[deleteIndex] = null;
            setAwards(newAwards);
        } catch (error) {
            console.error("Error deleting award:", error);
        }
        setShowDeletePopup(false); // Close the delete confirmation popup
    };

    const handleSave = async () => {
        const formData = new FormData();
        awards.forEach((award) => {
            if (award && award instanceof File) {
                formData.append("awards", award);
            }
        });

        try {
            const response = await axios.post(
                `https://admin.kidgage.com/api/users/upload-awards/${userId}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            console.log("Server Response:", response.data);
            fetchAwards(); // Refresh awards after upload
            alert("Awards added successfully!"); // Display success message
            closeHandler(); // Close the modal after saving the awards
        } catch (error) {
            console.error("Error saving awards:", error);
            alert("Failed to add awards. Please try again."); // Optional: display error message
        }
    };

    return (
        <>
            {isShow && (
                <div className={`award-addmodal-wrapper ${isShow ? "category-addmodal-show" : "category-addmodal-hide"}`}>
                    <div className='award-addmodal-container'>
                        <span onClick={closeHandler}>
                            <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
                        </span>
                        <h2 style={{ color: 'black', textAlign: "center" }}>Manage Awards and Certifications</h2>
                        <div className='award-container'>
                            {awards.map((award, index) => (
                                <div className='award-tile' key={index}>
                                    {award ? (
                                        <div className='award-image-wrapper'>
                                            <img
                                                src={award instanceof File ? URL.createObjectURL(award) : award}
                                                alt='Award'
                                                className='award-image'
                                            />
                                            <button className='delete-award-button' onClick={() => handleDeleteClick(index)}>
                                                <FontAwesomeIcon icon={faX} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className='award-placeholder'>
                                            <span className='plus-sign'>+</span>
                                            <input type='file' onChange={(e) => handleImageUpload(index, e)} hidden />
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button className='add-aminities-btn' style={{ marginTop: '20px' }} onClick={handleSave}>
                            Save
                        </button>
                    </div>
                </div>
            )}

            {showDeletePopup && (
                <div className='award-deletemodal-wrapper'>
                    <div className='delete-popup'>
                        <div className='delete-popup-content'>
                            <h4>Are you sure you want to delete this award?</h4>
                            <div className='award-delete-btn-container'>
                                <button className='cancel-btn' onClick={() => setShowDeletePopup(false)}>Cancel</button>
                                <button className='delete-btn' onClick={confirmDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddAwardsModal;
