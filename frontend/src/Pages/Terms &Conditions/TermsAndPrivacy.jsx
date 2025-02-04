import React, { useEffect, useState } from 'react'
import { faPlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TermsAndPrivacyAddModal from '../../components/TermsAndPrivacyModal/TermsAndPrivacyAddModal';
import PolicyAddModal from '../../components/TermsAndPrivacyModal/PolicyAddModal';
import axios from 'axios';
import TermsDeleteModal from '../../components/TermsAndPrivacyModal/TermsDeleteModal';
import PolicyDeleteModal from '../../components/TermsAndPrivacyModal/PolicyDeleteModal';
import TermsEditModal from '../../components/TermsAndPrivacyModal/TermsEditModal';
import PolicyEditModal from '../../components/TermsAndPrivacyModal/PolicyEditModal';
import "./TermsAndPrivacy.css";
import Appbar from '../../components/common/appbar/Appbar';

function TermsAndPrivacy() {
   const[error,setError]=useState("")
    const [activeTab, setActiveTab] = useState("Programs Offered");
    const [termsAddModalState, setTermsAddModalState] = useState(false);
    const [privacyAddModalState, setPrivacyAddModalState] = useState(false);
    const [termData, setTermData] = useState([])
    const [policyData, setPolicyData] = useState([])
    const [termsDeleteModalState, setTermsDeleteModalState] = useState({
        isShow: false,
        termId: null,
    });

    const [policyDeleteModalState, setPolicyDeleteModalState] = useState({
        isShow: false,
        policyId: null,
    });

    const [TermsAndPolicyEditModalState, setTermsAndPolicyEditModalState] = useState({
        isShow: false,
        data: null,
    });
    const [addstatus, setAddStatus] = useState([]);
    const [deleteStatus, setDeleteStatus] = useState([]);
    const [editStatus, setEditStatus] = useState([]);

    // Add terms modal handler
    const termsAddModalOpenHandler = () => setTermsAddModalState(true);
    // Add privacy modal handler
    const privacyAddModalOpenHandler = () => setPrivacyAddModalState(true);

    // Add terms modal close handler
    const termsAddModalCloseHandler = () => setTermsAddModalState(false);
    // Add privacy modal close handler
    const privacyAddModalCloseHandler = () => setPrivacyAddModalState(false);

    // delete term modal open handler
    const deleteTermModalOpenHandler = (termId) => {
        setTermsDeleteModalState({ isShow: true, termId });
    };

    // delete terms modal close handler
    const deleteTermModalCloseHandler = () => {
        setTermsDeleteModalState({ isShow: false, termId: null });
    };

    // delete policy modal open handler
    const deletePolicyModalOpenHandler = (policyId) => {
        setPolicyDeleteModalState({ isShow: true, policyId });
    };

    // delete terms modal close handler
    const deletePolicyModalCloseHandler = () => {
        setPolicyDeleteModalState({ isShow: false, policyId: null });
    };

    const TermsAndPolicyEditModalOpenHandler = (editModalData) =>
        setTermsAndPolicyEditModalState({
            isShow: true,
            data: editModalData,
        });

    // edit category modal Close handler
    const TermsAndPolicyModalCloseHandler = (editModalData) =>
        setTermsAndPolicyEditModalState({
            isShow: false,
            data: null,
        });

    //fetch terms and codition data
    const fetchTermData = async () => {
        try {
            const result = await axios.get(
                `http://localhost:5001/api/terms-condition/term-data`
            );
            console.log(result.data);
            if (result.status == 200) {
                setTermData(result.data)

            }
        } catch (error) {
            console.log(`Error fetching courses: ${error}`);
        }
    }

    //fetch privacy policy data
    const fetchPolicyData = async () => {
        try {
            const result = await axios.get(
                `http://localhost:5001/api/terms-condition/policy-data`
            );
            console.log(result.data);
            if (result.status == 200) {
                setPolicyData(result.data)

            }
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

    useEffect(() => {
        fetchTermData();
        fetchPolicyData();
    }, [addstatus, deleteStatus, editStatus]);

    // console.log(policyData);

    const filteredPolicyData = policyData.filter(item => item.policy);  // Filter items with policy field
    if (filteredPolicyData.length > 0) {
        filteredPolicyData.forEach(item => {
            console.log(item.policy);  // Log the available policy
            console.log(item.date);    // Log the date of that policy
        });
    } else {
        console.log('No available policies.');
    }
    const filteredTermData = termData.filter(item => item.terms);  // Filter items with policy field
    if (filteredTermData.length > 0) {
        filteredTermData.forEach(item => {
            console.log(item.terms);  // Log the available policy
            console.log(item.date);    // Log the date of that policy
        });
    } else {
        console.log('No available terms.');
    }

    return (
        <>
            <div className="coursepage-container">
            {/* {
            !searchdata ||
              (Array.isArray(searchdata) && searchdata.length === 0) ||
              (typeof searchdata === 'object' && Object.keys(searchdata).length === 0)
              ? <Appbar visible={currentPath} />
              : null
          } */}
                <h3 className="campaign-heading" style={{fontSize:'25px',marginTop:'80px'}}>Footer Pages </h3>
                <div className="coursepage-content-container">
                    <div className="coursepage-content-header">
                        {/* Tab Button for Programs Offered */}
                        <button
                            className={`course_tab-button1   ${activeTab === "Programs Offered" ? "active" : ""}`}
                            onClick={() => setActiveTab("Programs Offered")}
                        >
                            Terms and Conditions
                        </button>

                        {/* Tab Button for Add Course */}
                        <button
                            className={`course_tab-button1 ${activeTab === "Add Course" ? "active" : ""}`}
                            onClick={() => setActiveTab("Add Course")}
                        >
                            <FontAwesomeIcon icon={faPlus} style={{ color: "#fcfcfc" }} /> Privacy Policy
                        </button>
                    </div>

                    {/* Conditional Rendering based on activeTab */}
                    {activeTab === "Programs Offered" && (

                        <div>
                            <button style={{ float: 'right', cursor: 'pointer' }}
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
                                        <th> Updatd Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {error ? (
                                        <tr>
                                            <td colSpan="6">{error}</td>
                                        </tr>
                                    ) : (
                                        filteredTermData.length > 0 ? (
                                            filteredTermData.map((item, index) => (
                                                <tr key={item._id || index}>  {/* Use _id or index as key */}
                                                    <td style={{ width: '60%', textAlign: 'justify' }}>
                                                        {item.terms} {/* Display policy */}
                                                    </td>
                                                    <td>{new Date(item.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}</td>  {/* Display date */}
                                                    <td>
                                                        <div className="course-icons">
                                                            <FontAwesomeIcon
                                                                icon={faPenToSquare}
                                                                style={{ color: "#000205", cursor: "pointer" }}
                                                                onClick={() => TermsAndPolicyEditModalOpenHandler(item)}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                                style={{ color: "#000000", cursor: "pointer" }}
                                                                onClick={() => deleteTermModalOpenHandler(item._id)}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6">No available policies.</td>
                                            </tr>
                                        )
                                    )}
                                </tbody>

                            </table>
                        </div>

                    )}

                    {activeTab === "Add Course" && (
                        <div>
                            <button style={{ float: 'right', cursor: 'pointer' }}
                                className="add-campaign-button"
                                onClick={privacyAddModalOpenHandler}
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
                                        <th>Updated Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {error ? (
                                        <tr>
                                            <td colSpan="6">{error}</td>
                                        </tr>
                                    ) : (
                                        filteredPolicyData.length > 0 ? (
                                            filteredPolicyData.map((item, index) => (
                                                <tr key={item._id || index}>  {/* Use _id or index as key */}
                                                    <td style={{ width: '60%', textAlign: 'justify' }}>
                                                        {item.policy} {/* Display policy */}
                                                    </td>
                                                    <td>{new Date(item.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}</td>  {/* Display date */}
                                                    <td>
                                                        <div className="course-icons">
                                                            <FontAwesomeIcon
                                                                icon={faPenToSquare}
                                                                style={{ color: "#000205", cursor: "pointer" }}
                                                                onClick={() => TermsAndPolicyEditModalOpenHandler(item)}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                                style={{ color: "#000000", cursor: "pointer" }}
                                                                onClick={() => deletePolicyModalOpenHandler(item._id)}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6">No available policies.</td>
                                            </tr>
                                        )
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
                {privacyAddModalState && (
                    <PolicyAddModal
                        isShow={privacyAddModalState}
                        closeHandler={privacyAddModalCloseHandler}
                        setAddStatus={setAddStatus}
                    />
                )}

                {/* delete modal */}
                {termsDeleteModalState.isShow && (
                    <TermsDeleteModal
                        isShow={termsDeleteModalState.isShow}
                        closeHandler={deleteTermModalCloseHandler}
                        termDeleteId={termsDeleteModalState.termId}
                        setDeleteStatus={setDeleteStatus}
                    />
                )}

                {/* delete modal */}
                {policyDeleteModalState.isShow && (
                    <PolicyDeleteModal
                        isShow={policyDeleteModalState.isShow}
                        closeHandler={deletePolicyModalCloseHandler}
                        policyDeleteId={policyDeleteModalState.policyId}
                        setDeleteStatus={setDeleteStatus}
                    />
                )}


                {/* Edit modal */}
                {TermsAndPolicyEditModalState.isShow && (
                    <TermsEditModal
                        isShow={TermsAndPolicyEditModalState.isShow}
                        closeHandler={TermsAndPolicyModalCloseHandler}
                        termsData={TermsAndPolicyEditModalState.data}
                        setEditStatus={setEditStatus}
                    />
                )}



                {/* Edit modal */}
                {TermsAndPolicyEditModalState.isShow && (
                    <PolicyEditModal
                        isShow={TermsAndPolicyEditModalState.isShow}
                        closeHandler={TermsAndPolicyModalCloseHandler}
                        policyData={TermsAndPolicyEditModalState.data}
                        setEditStatus={setEditStatus}
                    />
                )}

            </div>
        </>
    )
}

export default TermsAndPrivacy