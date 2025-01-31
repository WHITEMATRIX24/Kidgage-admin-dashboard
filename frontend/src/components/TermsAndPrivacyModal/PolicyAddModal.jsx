import { faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'

function PolicyAddModal({ isShow, closeHandler, setAddStatus }) {

       const [isLoading, setIsLoading] = useState(false);
    
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
             <h2>Add Privacy Policy</h2>
             <div className="campaign-addmodal-form-fieldcontainer" style={{marginTop:'50px'}}>
                 <p>Privacy Policy</p>
                 <textarea
                   type="text"
                   className="campaign-addmodal-form-input"
                   style={{height:'250px'}}
                   // value={newPosterFormData.description}
                 
                 />
               </div>
               <button
                 className="campaign-addmodal-form-publishbtn"
                 style={{marginTop:'30px'}}
                 disabled={isLoading}
               >
                 Submit
                 {isLoading ? "please wait" : "Publish"}
               </button>
               
           </div>
         </div>
   </>
  )
}

export default PolicyAddModal