import React, { useEffect, useState } from "react";
import "./inspectionApproveModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";

const InspectionApproveModal = ({ isShow, closeHandler, providerData }) => {
  const [providerCredential, setProviderCredential] = useState({
    username: "",
    password: "",
    noOfCourses: "",
  });
  const [isCredentialCopied, setIsCredentialCopied] = useState(false);

  //   copy to clipboard function
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(
      `username: ${providerCredential.username} password: ${providerCredential.password}`
    );
    setIsCredentialCopied(true);
    setTimeout(() => {
      setIsCredentialCopied(false);
    }, 5000);
  };

  //   create Handler
  const handleCreateAccount = async () => {
    const { password, username } = providerCredential;
    if (!password || !username) {
      alert("username and password missing");
      return;
    }

    const dataForServer = {
      username: username,
      phone: password,
      email: providerData?.email,
      fullName: providerData?.fullName,
      role: "provider",
    };

    try {
      const res = await axios.post(
        `https://kidgage-dashboar-newui.onrender.com/api/users/verify/${providerData.userId}`,
        dataForServer
      );
      if (res.status === 200) {
        alert("Successfully created admin");
      }
    } catch (error) {
      if (error.status === 400) {
        alert("admin exists");
      }
      console.log(
        `error in creating provider from inspection schedule error: ${error}`
      );
    }
  };

  useEffect(() => {
    if (providerData) {
      setProviderCredential({
        username: providerData.username,
        password: providerData.phoneNumber,
        noOfCourses: providerData.noOfCourses,
      });
    }
  }, [providerData]);

  return (
    <div
      className={`inspection-approve-modal-wrapper ${isShow ? "show" : "hidden"
        }`}
    >
      <div className={`inspection-approve-modal-container`}>
        <span onClick={closeHandler}>
          <FontAwesomeIcon icon={faX} style={{ color: "#ff0000" }} />
        </span>
        <h2>Accept Request & Create Account</h2>
        <form className="inspection-approve-modal-form">
          <div>
            <p>Username</p>
            <input
              type="text"
              value={providerCredential.username}
              name="provider-credential-username"
              readOnly={true}
            />
          </div>
          <div>
            <p>Password</p>
            <input
              type="text"
              value={providerCredential.password}
              name="provider-credential-password"
              readOnly={true}
            />
          </div>
          <span onClick={handleCopyToClipboard}>
            <FontAwesomeIcon icon={faCopy} />
            <p>{isCredentialCopied ? "copied" : "copy credentials"}</p>
          </span>
        </form>
        <div className="inspection-approve-modal-btn-container">
          <button
            disabled={
              !providerCredential.username || !providerCredential.password
            }
            onClick={handleCreateAccount}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspectionApproveModal;
