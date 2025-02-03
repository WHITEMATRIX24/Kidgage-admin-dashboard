import { faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react'

function PolicyAddModal({ isShow, closeHandler, setAddStatus }) {
  const [isLoading, setIsLoading] = useState(false);
  const [newData,setNewData]=useState({
    policy:"",
  })

const handleCreate = async (e) => {
  e.preventDefault()
  const { policy } = newData; // Use newData from state to get 'terms'
  console.log("policy value:", policy); // Check what the terms value is

  if (!policy) {
    alert("policy cannot be empty");
    return;
  }

  
  try {
    setIsLoading(true);
    const res = await axios.post(
      "http://localhost:5001/api/terms-condition/add-policy",
      newData // Send the new 'formData' here
    );

    if (res.status !== 201) {
      alert("Error in creating new policy");
      return;
    }

    alert("Successfully created new policy");
    setAddStatus(res.data);
    handleClose();
  } catch (error) {
    console.log(`Error creating new policy: ${error}`);
  } finally {
    setIsLoading(false);
  }
};
        const handleClose = () => {
            closeHandler();
          };
  return (
   <>
    <div
           className={`category-addmodal-wrapper ${isShow ? "category-addmodal-show" : "category-addmodal-hide"
             }`}
         >
           <div className="category-addmodal-container" style={{width:'48rem',height:'35rem'}} >
             <span onClick={handleClose}>
               <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
             </span>
             <h2>Add Privacy Policy</h2>
          
             <div className="campaign-addmodal-form-fieldcontainer" style={{marginTop:'50px'}}>
              <p>Privacy Policy</p>
              <div className="campaign-addmodal-form-fieldcontainer">
              <textarea
                type="text"
                className="campaign-addmodal-form-input"
                value={newData.policy}
                style={{height:'200px'}}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    policy: e.target.value,
                  })
                }
              />
            </div>
            </div>
               <button
                 className="campaign-addmodal-form-publishbtn"
                 style={{marginTop:'30px'}}
                 disabled={isLoading}
                 onClick={handleCreate}
               >
                 {isLoading ? "please wait" : "Publish"}
               </button>
               
           </div>
         </div>
   </>
  )
}

export default PolicyAddModal