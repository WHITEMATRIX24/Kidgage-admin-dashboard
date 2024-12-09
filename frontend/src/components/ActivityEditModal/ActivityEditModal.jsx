
import { faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './ActivityEditModal.css';


function ActivityEditModal({ isShow, closeHandler, activityData, setUpdateStatus }) {

  const [newActivityData, setNewActivityData] = useState({
    noOfCourses: "",
  });

  console.log(activityData);

  useEffect(() => {
    if (activityData) {
      setNewActivityData({
        noOfCourses: activityData.noOfCourses,
      });
    }
  }, [activityData]);

  // close handler
  const handleClose = () => {

    closeHandler();
  };
  console.log(newActivityData);

  const handleUpdate = async (id) => {
    const { noOfCourses } = newActivityData
    if (!noOfCourses) {
      alert("Fill form completly");
    }
    else {
      try {
        const res = await axios.put(
          `https://kidgage-dashboar-newui.onrender.com/api/users/update-activity/${id}`,
          newActivityData
        );

        if (res.status !== 200) {
          alert("Error in updating data");
          return;
        }

        alert("succesfully updated!!!!!");
        setUpdateStatus(res.data)
        handleClose();
      } catch (error) {
        console.log(`error creating updation time error: ${error}`);
      }
    }

  }

  return (


    <div
      className={`category-editmodal-wrapper ${isShow ? "category-editmodal-show" : "category-editmodal-hide"
        }`}
    >
      <div className='activity-editmodal-container'>

        <span onClick={handleClose}>
          <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
        </span>
        <div style={{ alignItems: 'center', justifyItems: 'center', marginTop: '20px' }}>

          <p>  Update no of Classes:</p>

          <input
            type="text"
            value={newActivityData.noOfCourses}
            name="no-of-classes"
            onChange={(e) => setNewActivityData({ noOfCourses: e.target.value })}
            style={{
              marginTop: '40px',
              padding: '10px',
              fontSize: '16px',
              border: '2px solid #ccc',
              borderRadius: '8px',
              width: '100%', // full-width for responsive design
              // maxWidth: '300px', // max-width for limiting the input size
              backgroundColor: '#f9f9f9', // light background
              color: '#333', // text color
              transition: 'border-color 0.3s ease', // smooth transition for focus effect
            }}
            placeholder="Enter number of courses"
          />
          <button style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: '2px solid #007bff',
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginTop: '30px',
            marginLeft: "30%"
          }} onClick={() => handleUpdate(activityData._id)}>Update</button>

        </div>
      </div>



    </div>
  )
}

export default ActivityEditModal