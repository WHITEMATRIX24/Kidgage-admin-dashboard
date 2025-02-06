import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AddAmenitiesModal.css';

function AddAmenitiesModal({ isShow, closeHandler }) {
    const [amenities, setAmenities] = useState([]); // State for selected amenities
    const [availableAmenities, setAvailableAmenities] = useState([
        "SwimmingPool",
        "FreeWifi",
        "LockerRooms",
        "FitnessCenter",
        "Parking",
        "Pitches",
        "Sauna",
        "SquashCenters",
        "SeatingAreas"
    ]); // List of possible amenities
    const userId = sessionStorage.getItem("userid");

    useEffect(() => {
        // Fetch existing amenities from the backend
        const fetchAmenities = async () => {
            try {
                const response = await axios.get(`https://admin.kidgage.com/api/users/${userId}/amenities`);
                if (response.status === 200) {
                    setAmenities(response.data.amenities || []); // Set user's existing amenities
                }
            } catch (error) {
                console.error("Error fetching amenities:", error);
            }
        };

        if (isShow) {
            fetchAmenities();
        }
    }, [isShow, userId]);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setAmenities((prevAmenities) => {
            if (checked) {
                // Add new amenity and ensure uniqueness
                return Array.from(new Set([...prevAmenities, name]));
            } else {
                // Remove unchecked amenity
                return prevAmenities.filter((item) => item !== name);
            }
        });
    };

    const handleSubmit = async () => {
        try {
            const result = await axios.post(
                "https://admin.kidgage.com/api/users/add-amenities",
                { newData: amenities, userId }
            );

            if (result.status === 200) {
                alert("Amenities Updated Successfully");
                closeHandler();
            }
        } catch (error) {
            console.error(`Error updating amenities: ${error}`);
        }
    };

    return (
        <>
            <div className={`category-addmodal-wrapper ${isShow ? "category-addmodal-show" : "category-addmodal-hide"}`}>
                <div className='category-addmodal-container' >
                    <span onClick={closeHandler}>
                        <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
                    </span>
                    <h2 style={{ color: 'black' }}>Manage Amenities</h2>

                    <div className="amenities-container">
                        {availableAmenities.map((amenity) => (
                            <div key={amenity} className="amenity-item">
                                <input
                                    type="checkbox"
                                    name={amenity}
                                    checked={amenities.includes(amenity)}
                                    onChange={handleCheckboxChange}
                                    className="custom-checkbox"
                                />
                                <p>{amenity.replace(/([A-Z])/g, ' $1')}</p>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleSubmit} className='add-aminities-btn' style={{ marginTop: '20px' }}>
                        Save Amenities
                    </button>
                </div>
            </div>
        </>
    );
}

export default AddAmenitiesModal;
