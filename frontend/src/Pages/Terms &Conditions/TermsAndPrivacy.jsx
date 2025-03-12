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
import { useLocation } from 'react-router-dom';

function TermsAndPrivacy(searchdata) {
    const [error, setError] = useState("")
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
        type: null, // Added type to distinguish between terms and policy
    });

    const [addstatus, setAddStatus] = useState([]);
    const [deleteStatus, setDeleteStatus] = useState([]);
    const [editStatus, setEditStatus] = useState([]);
    const location = useLocation();
    const currentPath = location.hash;

    // Add terms modal handler
    const termsAddModalOpenHandler = () => setTermsAddModalState(true);
    const privacyAddModalOpenHandler = () => setPrivacyAddModalState(true);
    const termsAddModalCloseHandler = () => setTermsAddModalState(false);
    const privacyAddModalCloseHandler = () => setPrivacyAddModalState(false);

    // Delete handlers
    const deleteTermModalOpenHandler = (termId) => {
        setTermsDeleteModalState({ isShow: true, termId });
    };

    const deleteTermModalCloseHandler = () => {
        setTermsDeleteModalState({ isShow: false, termId: null });
    };

    const deletePolicyModalOpenHandler = (policyId) => {
        setPolicyDeleteModalState({ isShow: true, policyId });
    };

    const deletePolicyModalCloseHandler = () => {
        setPolicyDeleteModalState({ isShow: false, policyId: null });
    };

    // Edit modal handler with type
    const TermsAndPolicyEditModalOpenHandler = (editModalData, type) =>
        setTermsAndPolicyEditModalState({
            isShow: true,
            data: editModalData,
            type: type,
        });

    const TermsAndPolicyModalCloseHandler = () =>
        setTermsAndPolicyEditModalState({
            isShow: false,
            data: null,
            type: null,
        });

    // Data fetching
    const fetchTermData = async () => {
        try {
            const result = await axios.get(`https://admin.kidgage.com/api/terms-condition/term-data`);
            if (result.status === 200) setTermData(result.data);
        } catch (error) {
            console.log(`Error fetching terms: ${error}`);
        }
    }

    const fetchPolicyData = async () => {
        try {
            const result = await axios.get(`https://admin.kidgage.com/api/terms-condition/policy-data`);
            if (result.status === 200) setPolicyData(result.data);
        } catch (error) {
            console.log(`Error fetching policies: ${error}`);
        }
    }

    useEffect(() => {
        fetchTermData();
        fetchPolicyData();
    }, [addstatus, deleteStatus, editStatus]);

    const filteredPolicyData = policyData.filter(item => item.policy);
    const filteredTermData = termData.filter(item => item.terms);

    return (
        <>
            <div className="coursepage-container">
                {/* Fixed conditional rendering with proper parentheses */}
                {(!searchdata ||
                    (Array.isArray(searchdata) && searchdata.length === 0) ||
                    (typeof searchdata === 'object' && Object.keys(searchdata).length === 0))
                    ? <Appbar visible={currentPath} />
                    : null
                }


                <h3 className="campaign-heading" style={{ fontSize: '25px', marginTop: '45px' }}>Footer Pages </h3>

                <div className="coursepage-content-container">
                    <div className="coursepage-content-header">
                        <button className={`course_tab-button1 ${activeTab === "Programs Offered" ? "active" : ""}`}
                            onClick={() => setActiveTab("Programs Offered")}>
                            Terms and Conditions
                        </button>

                        <button className={`course_tab-button1 ${activeTab === "Add Course" ? "active" : ""}`}
                            onClick={() => setActiveTab("Add Course")}>
                            <FontAwesomeIcon icon={faPlus} style={{ color: "#fcfcfc" }} /> Privacy Policy
                        </button>
                    </div>

                    {activeTab === "Programs Offered" && (
                        <div>
                            <button style={{ float: 'right', cursor: filteredTermData.length > 0 ? 'not-allowed' : 'pointer' }}
                                className="add-campaign-button"
                                onClick={termsAddModalOpenHandler}
                                disabled={filteredTermData.length > 0}>
                                <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff", marginRight: '10px' }} />
                                Add Terms And Conditions
                            </button>

                            <table className="course-table-details">
                                <thead className="table-head">
                                    <tr>
                                        <th>Terms And Conditions</th>
                                        <th>Updated Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTermData.length > 0 ? filteredTermData.map((item) => (
                                        <tr key={item._id}>
                                            <td style={{ width: '60%', textAlign: 'justify', whiteSpace: "pre-line" }}>
                                                {item.terms}
                                            </td>
                                            <td>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            <td>
                                                <div className="course-icons">
                                                    <FontAwesomeIcon
                                                        icon={faPenToSquare}
                                                        style={{ color: "#000205", cursor: "pointer" }}
                                                        onClick={() => TermsAndPolicyEditModalOpenHandler(item, 'terms')}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        style={{ color: "#000000", cursor: "pointer" }}
                                                        onClick={() => deleteTermModalOpenHandler(item._id)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6">No terms available</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === "Add Course" && (
                        <div>
                            <button style={{ float: 'right', cursor: filteredPolicyData.length > 0 ? 'not-allowed' : 'pointer' }}
                                className="add-campaign-button"
                                onClick={privacyAddModalOpenHandler}
                                disabled={filteredPolicyData.length > 0}>
                                <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff", marginRight: '10px' }} />
                                Add Privacy and Policy
                            </button>

                            <table className="course-table-details">
                                <thead className="table-head">
                                    <tr>
                                        <th>Privacy Policy Details</th>
                                        <th>Updated Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPolicyData.length > 0 ? filteredPolicyData.map((item) => (
                                        <tr key={item._id}>
                                            <td style={{ width: '60%', textAlign: 'justify', whiteSpace: "pre-line" }}>
                                                {item.policy}
                                            </td>
                                            <td>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            <td>
                                                <div className="course-icons">
                                                    <FontAwesomeIcon
                                                        icon={faPenToSquare}
                                                        style={{ color: "#000205", cursor: "pointer" }}
                                                        onClick={() => TermsAndPolicyEditModalOpenHandler(item, 'policy')}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        style={{ color: "#000000", cursor: "pointer" }}
                                                        onClick={() => deletePolicyModalOpenHandler(item._id)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="6">No policies available</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modals */}
                {termsAddModalState && <TermsAndPrivacyAddModal isShow={termsAddModalState} closeHandler={termsAddModalCloseHandler} setAddStatus={setAddStatus} />}
                {privacyAddModalState && <PolicyAddModal isShow={privacyAddModalState} closeHandler={privacyAddModalCloseHandler} setAddStatus={setAddStatus} />}

                {termsDeleteModalState.isShow && <TermsDeleteModal isShow={termsDeleteModalState.isShow} closeHandler={deleteTermModalCloseHandler} termDeleteId={termsDeleteModalState.termId} setDeleteStatus={setDeleteStatus} />}
                {policyDeleteModalState.isShow && <PolicyDeleteModal isShow={policyDeleteModalState.isShow} closeHandler={deletePolicyModalCloseHandler} policyDeleteId={policyDeleteModalState.policyId} setDeleteStatus={setDeleteStatus} />}

                {TermsAndPolicyEditModalState.isShow && (
                    TermsAndPolicyEditModalState.type === 'terms' ? (
                        <TermsEditModal
                            isShow={TermsAndPolicyEditModalState.isShow}
                            closeHandler={TermsAndPolicyModalCloseHandler}
                            termsData={TermsAndPolicyEditModalState.data}
                            setEditStatus={setEditStatus}
                        />
                    ) : (
                        <PolicyEditModal
                            isShow={TermsAndPolicyEditModalState.isShow}
                            closeHandler={TermsAndPolicyModalCloseHandler}
                            policyData={TermsAndPolicyEditModalState.data}
                            setEditStatus={setEditStatus}
                        />
                    )
                )}
            </div>
        </>
    )
}

export default TermsAndPrivacy