import { faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react'

function TermsAndPrivacyAddModal({ isShow, closeHandler, setAddStatus }) {
  const [isLoading, setIsLoading] = useState(false);
  const [newData,setNewData]=useState({
    terms:"",
  })

const handleCreate = async (e) => {
  e.preventDefault()
  const { terms } = newData; // Use newData from state to get 'terms'
  console.log("terms value:", terms); // Check what the terms value is

  if (!terms) {
    alert("Terms cannot be empty");
    return;
  }

  setIsLoading(true);
  try {
    const res = await axios.post(
      "http://localhost:5001/api/terms-condition/add",
      newData // Send the new 'formData' here
    );

    if (res.status !== 201) {
      alert("Error in creating new terms");
      return;
    }

    alert("Successfully created new terms");
    setAddStatus(res.data);
    handleClose();
  } catch (error) {
    console.log(`Error creating new terms: ${error}`);
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
        <div className="category-addmodal-container" style={{width:'48rem',height:'35rem'}}>
          <span onClick={handleClose}>
            <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
          </span>
          <h2>Add Terms And Conditions</h2>
          <div className="campaign-addmodal-form-fieldcontainer" style={{marginTop:'50px'}}>
              <p>Terms And Conditions</p>
              <div className="campaign-addmodal-form-fieldcontainer">
              <textarea
                type="text"
                className="campaign-addmodal-form-input"
                value={newData.terms}
                style={{height:'200px'}}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    terms: e.target.value,
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

export default TermsAndPrivacyAddModal