import React, { useEffect, useState } from 'react';
import Appbar from '../../components/common/appbar/Appbar';
import './provider.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const ProviderDetails = () => {
    const [user, setUser] = useState({});
    const [editValues, setEditValues] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            const userId = sessionStorage.getItem("userid");
            if (!userId) {
                setError("No admin ID found in session storage.");
                return;
            }

            try {
                const response = await fetch(`https://kidgage-dashboar-newui.onrender.com/api/users/user/${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch user details.");
                }
                const userData = await response.json();
                setUser(userData);
                setEditValues(userData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (field, value) => {
        setEditValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setEditValues((prevValues) => ({
            ...prevValues,
            logo: file,
        }));
    };

    const handleAcademyImageChange = (e) => {
        const file = e.target.files[0];
        setEditValues((prevValues) => ({
            ...prevValues,
            academyImg: file,
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const userId = sessionStorage.getItem("userid");
        const formDataToSend = new FormData();

        formDataToSend.append("licenseNo", editValues.licenseNo);
        formDataToSend.append("email", editValues.email);
        formDataToSend.append("phoneNumber", editValues.phoneNumber);
        formDataToSend.append("fullName", editValues.fullName);
        formDataToSend.append("designation", editValues.designation);
        formDataToSend.append("website", editValues.website);
        formDataToSend.append("instaId", editValues.instaId);
        formDataToSend.append("location", editValues.location);
        formDataToSend.append("description", editValues.description);

        if (editValues.academyImg instanceof File) {
            formDataToSend.append("academyImg", editValues.academyImg);
        }
        if (editValues.logo instanceof File) {
            formDataToSend.append("logo", editValues.logo);
        }
        if (editValues.crFile instanceof File) {
            formDataToSend.append("crFile", editValues.crFile);
        }

        try {
            const response = await fetch(`https://kidgage-dashboar-newui.onrender.com/api/users/edits/${userId}`, {
                method: "POST",
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error("Failed to update user details.");
            }
            alert("Profile updated successfully!");
            window.location.reload();
            setIsEditing(false);
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="provider-details">
            <Appbar />
            <h1 className="provider-title">Provider Details</h1>

            <div className="provider-details-content">
                {/* <div className="provider-section-title">
                    <h3>Provider Details</h3>
                </div> */}
                <table className="provider-details-table">
                    <tbody>
                        <tr className="provider-logo-row no-border">
                            <td className="provider-logo-cell" colSpan="2">
                                <label htmlFor="logo-input">
                                    {editValues.logo ? (
                                        <img
                                            src={
                                                editValues.logo instanceof File
                                                    ? URL.createObjectURL(editValues.logo)
                                                    : user.logo
                                            }
                                            alt="Academy Logo"
                                            className="provider-logo"
                                        />
                                    ) : (
                                        user.logo && (
                                            <img src={user.logo} alt="Academy Logo" className="provider-logo" />
                                        )
                                    )}
                                </label>
                                {isEditing && (
                                    <input
                                        type="file"
                                        id="logo-input"
                                        className="file-input"
                                        onChange={handleLogoChange}
                                        style={{ display: "none" }}
                                    />
                                )}
                            </td>
                            <td className="provider-icon-cell">
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    className="edit-icon"
                                    onClick={handleEditClick}
                                    title="Edit Details"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <div className="input-row">
                                    <span className="label-cell">Username:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="editable-field"
                                            value={editValues.username || ""}
                                            onChange={(e) => handleInputChange('username', e.target.value)}
                                        />
                                    ) : (
                                        <span>{user.username}</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <div className="input-row">
                                    <span className="label-cell">Email:</span>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            className="editable-field"
                                            value={editValues.email || ""}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                        />
                                    ) : (
                                        <span>{user.email}</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <div className="input-row">
                                    <span className="label-cell">Phone Number:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="editable-field"
                                            value={editValues.phoneNumber || ""}
                                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                        />
                                    ) : (
                                        <span>{user.phoneNumber}</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <div className="input-row">
                                    <span className="label-cell">Full Name:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="editable-field"
                                            value={editValues.fullName || ""}
                                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        />
                                    ) : (
                                        <span>{user.fullName}</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <div className="input-row">
                                    <span className="label-cell">Designation:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="editable-field"
                                            value={editValues.designation || ""}
                                            onChange={(e) => handleInputChange('designation', e.target.value)}
                                        />
                                    ) : (
                                        <span>{user.designation}</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <div className="input-row">
                                    <span className="label-cell">Description:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="editable-field"
                                            value={editValues.description || ""}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                        />
                                    ) : (
                                        <span>{user.description}</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <div className="input-row">
                                    <span className="label-cell">Location:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="editable-field"
                                            value={editValues.location || ""}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                        />
                                    ) : (
                                        <span>{user.location}</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <div className="input-row">
                                    <span className="label-cell">Address:</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="editable-field"
                                            value={editValues.address || ""}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                        />
                                    ) : (
                                        <span>{user.address}</span>
                                    )}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan="2">
                                <div className="input-row">
                                    <span className="label-cell">Academy Image:</span>
                                    {isEditing ? (
                                        <input
                                            type="file"
                                            className="file-input"
                                            onChange={handleAcademyImageChange}
                                        />
                                    ) : (
                                        user.academyImg && (
                                            <img
                                                src={user.academyImg}
                                                alt="Academy"
                                                className="academy-image"
                                            />
                                        )
                                    )}
                                </div>
                            </td>
                        </tr>
                        <tr className="provider-save">
                            <td colSpan="2" style={{ textAlign: "center" }}>
                                {isEditing && (
                                    <button className="provider-save-button" onClick={handleEditSubmit}>
                                        Save
                                    </button>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProviderDetails;
