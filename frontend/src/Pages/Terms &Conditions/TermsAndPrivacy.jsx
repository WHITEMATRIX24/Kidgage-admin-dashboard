import React, { useState } from 'react'
import { faPlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TermsAndPrivacyAddModal from '../../components/TermsAndPrivacyModal/TermsAndPrivacyAddModal';
import PolicyAddModal from '../../components/TermsAndPrivacyModal/PolicyAddModal';

function TermsAndPrivacy() {
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("Programs Offered");
     const [termsAddModalState, setTermsAddModalState] = useState(false);
     const [addstatus, setAddStatus] = useState([]);

// Add categroy modal handler
const termsAddModalOpenHandler = () => setTermsAddModalState(true);

// Add categroy modal handler
const termsAddModalCloseHandler = () => setTermsAddModalState(false);

    return (
        <>
            <div className="coursepage-container">
                <h3 className="coursepage-content-heading">Terms And Conditions </h3>
                <div className="coursepage-content-container">
                    <div className="coursepage-content-header">
                        {/* Tab Button for Programs Offered */}
                        <button
                            className={`course_tab-button ${activeTab === "Programs Offered" ? "active" : ""}`}
                            onClick={() => setActiveTab("Programs Offered")}
                        >
                            Terms and Conditions
                        </button>

                        {/* Tab Button for Add Course */}
                        <button
                            className={`course_tab-button ${activeTab === "Add Course" ? "active" : ""}`}
                            onClick={() => setActiveTab("Add Course")}
                        >
                            <FontAwesomeIcon icon={faPlus} style={{ color: "#fcfcfc" }} /> Privacy Policy
                        </button>
                    </div>

                    {/* Conditional Rendering based on activeTab */}
                    {activeTab === "Programs Offered" && (

                        <div>   
                            <button style={{ float: 'right' }}
                            className="add-campaign-button"
                            onClick={termsAddModalOpenHandler}

                        >
                            <FontAwesomeIcon
                                icon={faPlus}
                                style={{ color: "#ffffff" }}
                            />
                            Add Terms And Conditions
                        </button>
                            <table className="course-table-details">
                                <thead className="table-head">
                                    <tr>
                                        <th>Terms And Conditions</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {error ? (
                                        <tr>
                                            <td colSpan="6">{error}</td>
                                        </tr>
                                    ) : (
                                        <tr>

                                            <td style={{width:'80%',textAlign:'justify'}}>Sporthood Academy for Football brings the latest in coaching methodologies to take your budding football star from grassroots to greatness. AFC and FIFA licensed coaches impart age-appropriate international curriculum to the kids with the primary aim of moulding them into professional footballers.
                                                Sporthood Academy for Football brings the latest in coaching methodologies to take your budding football star from grassroots to greatness. AFC and FIFA licensed coaches impart age-appropriate international curriculum to the kids with the primary aim of moulding them into professional footballers.
                                                Sporthood Academy for Football brings the latest in coaching methodologies to take your budding football star from grassroots to greatness. AFC and FIFA licensed coaches impart age-appropriate international curriculum to the kids with the primary aim of moulding them into professional footballers.</td>



                                            <td>
                                                <div className="course-icons">
                                                    <FontAwesomeIcon
                                                        icon={faPenToSquare}
                                                        style={{ color: "#000205", cursor: "pointer" }}
                                                    //   onClick={() => handleEditCourse(course._id)}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        style={{ color: "#000000", cursor: "pointer" }}
                                                    //   onClick={() => handleDeleteCourse(course._id)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>

                                    )}
                                </tbody>
                            </table></div>

                    )}

                    {activeTab === "Add Course" && (
                        <div>
                            <button style={{ float: 'right' }}
                                className="add-campaign-button"
                                onClick={termsAddModalOpenHandler}
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    style={{ color: "#ffffff" }}
                                />
                                Add Policy
                            </button>
                            <table className="course-table-details">
                                <thead className="table-head">
                                    <tr>
                                        <th> Privacy Policy Details</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {error ? (
                                        <tr>
                                            <td colSpan="6">{error}</td>
                                        </tr>
                                    ) : (

                                        <tr>
                                            <td style={{width:'80%',textAlign:'justify'}}>Sporthood Academy for Football brings the latest in coaching methodologies to take your budding football star from grassroots to greatness. AFC and FIFA licensed coaches impart age-appropriate international curriculum to the kids with the primary aim of moulding them into professional footballers.
                                                Sporthood Academy for Football brings the latest in coaching methodologies to take your budding football star from grassroots to greatness. AFC and FIFA licensed coaches impart age-appropriate international curriculum to the kids with the primary aim of moulding them into professional footballers.
                                                Sporthood Academy for Football brings the latest in coaching methodologies to take your budding football star from grassroots to greatness. AFC and FIFA licensed coaches impart age-appropriate international curriculum to the kids with the primary aim of moulding them into professional footballers.</td>

                                            <td>
                                                <div className="course-icons">
                                                    <FontAwesomeIcon
                                                        icon={faPenToSquare}
                                                        style={{ color: "#000205", cursor: "pointer" }}
                                                    //   onClick={() => handleEditCourse(course._id)}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        style={{ color: "#000000", cursor: "pointer" }}
                                                    //   onClick={() => handleDeleteCourse(course._id)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>

                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === "Edit Course" && (
                        <p>Another data</p>
                    )}
                </div>

                  {/* Add modal */}
      {termsAddModalState && (
        <TermsAndPrivacyAddModal
          isShow={termsAddModalState}
          closeHandler={termsAddModalCloseHandler}
          setAddStatus={setAddStatus}
        />
      )}

           {/* Add modal */}
      {termsAddModalState && (
        <PolicyAddModal
          isShow={termsAddModalState}
          closeHandler={termsAddModalCloseHandler}
          setAddStatus={setAddStatus}
        />
      )}



            </div>
        </>
    )
}

export default TermsAndPrivacy