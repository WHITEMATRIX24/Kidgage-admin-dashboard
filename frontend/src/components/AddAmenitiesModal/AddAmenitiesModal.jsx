import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'


import axios from 'axios';

function AddAmenitiesModal({ isShow, closeHandler,}) {
    const [amenities, setAmenities] = useState([]);
    const [newData, setNewData] = useState([])

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setAmenities((prevAmenities) => {
            if (checked) {
                // If checked, add to the amenities array
                return [...prevAmenities, name];
            } else {
                // If unchecked, remove from the amenities array
                return prevAmenities.filter((item) => item !== name);
            }
        });
    };

    // Handle form submission
  const handleSubmit =async() => {
    const userId = sessionStorage.getItem("userid");
    // Update the newData state with the selected amenities
    setNewData(amenities);
    try{
       const result=await axios.post(
        "http://localhost:5001/api/users/add-amenities",{newData: amenities, userId: userId, }
        
      );

    if(result.status === 200){
        alert('Amenities Added Successfully...')
    }
    }catch(error){
        console.log(`error creating adding new amenities error: ${error}`);
    }
   
  };

    // UseEffect to update newData whenever amenities changes
    useEffect(() => {
        setNewData(amenities); // Update newData when amenities changes
      }, [amenities]);

    // close handler
    const handleClose = () => {
        closeHandler();
    };

    console.log(newData);
    
    return (
        <>
            <div
                className={`category-addmodal-wrapper ${isShow ? "category-addmodal-show" : "category-addmodal-hide"
                    }`}
            >
                <div className='category-addmodal-container'>
                    <span onClick={handleClose}>
                        <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
                    </span>
                    <h2 style={{ color: 'black' }}>Add Amenities</h2>
                    <div style={{ display: 'flex', marginTop: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px', }}>
                            <input type="checkbox"
                                name="swimmingPool"
                                checked={amenities.includes('swimmingPool')}
                                onChange={handleCheckboxChange} style={{ width: '25px', height: '25px' }} />
                            <p style={{ marginLeft: '10px' }}>Swimming Pool</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px', }}>
                            <input type="checkbox"
                                name="freewifi"
                                checked={amenities.includes('freewifi')}
                                onChange={handleCheckboxChange} style={{ width: '25px', height: '25px' }} />
                            <p style={{ marginLeft: '10px' }}>Free Wifi</p>
                        </div>

                    </div>
                    <div style={{ display: 'flex', marginTop: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px', }}>
                            <input type="checkbox" style={{ width: '25px', height: '25px' }} />
                            <p style={{ marginLeft: '10px' }}>Swimming Pool</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px', }}>
                            <input type="checkbox" style={{ width: '25px', height: '25px' }} />
                            <p style={{ marginLeft: '10px' }}>Free Wifi</p>
                        </div>

                    </div>
                    <button onClick={handleSubmit} className='add-aminities-btn' style={{ marginTop: '20px' }}>Add And Update</button>
                </div>
            </div>
        </>
    )
}

export default AddAmenitiesModal