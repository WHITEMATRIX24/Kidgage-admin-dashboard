import { AppBar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import "./Settings.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Appbar from '../../components/common/appbar/Appbar';

function Settings() {
  const [adminsettings, setAdminSettings] = useState({}); // Initialize as an object
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [maskedPassword, setMaskedPassword] = useState("***************");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const FetchAdminDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://kidgage-dashboar-newui.onrender.com/api/admin");
      console.log("Admin data:", response.data);  // Check if _id exists
      setAdminSettings(response.data);
      const passwordLength = response.data.password ? response.data.password.length : 12;
      setMaskedPassword('*'.repeat(passwordLength));
    } catch (error) {
      console.error("Error fetching admin details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchAdminDetails();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    const adminId = sessionStorage.getItem('adminId');

    if (!adminId) {
      console.warn("Admin ID not found in sessionStorage");
    }


    try {
      const response = await axios.post(`https://kidgage-dashboar-newui.onrender.com/api/admin/change-password/${adminId}`, {
        currentPassword,
        newPassword,
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error.response?.data.message || 'Password change failed');
    }
  };

  return (
    <>
      {Object.keys(adminsettings).length > 0 ? (
        <div className="settings-container">
          <Appbar />
          <div className="settings-heading">
            <h3 style={{ color: sessionStorage.getItem('adminRole') === 'provider' ? 'black' : 'inherit' }}>Settings</h3>
            {/* <div className='settings-menu'>
              <p>Home</p>{'>'}<p>Settings</p>
            </div> */}
          </div>
          <div className="settings-data-container">
            <div className="heading-container">
              <h4></h4>
              <Link style={{ textDecoration: 'none' }} onClick={handleLogout}>
                <span className='logout'><h4 style={{ color: sessionStorage.getItem('adminRole') === 'provider' ? 'black' : 'inherit' }}>Logout</h4></span>
              </Link>
            </div>
            <div className="username">
              <div className='uname-data'>
                <div style={{ alignItems: 'center' }}><p>Name</p></div>
                <div style={{ alignItems: 'center', marginLeft: "100px" }}>
                  <p>{sessionStorage.getItem('Name')}</p>
                </div>
              </div>
            </div>
            <div className="email">
              <div className='email-data'>
                <div><p>UserId</p></div>
                <div className='email-data1' style={{ marginLeft: "100px" }}>
                  <p>{sessionStorage.getItem('email')}</p>
                </div>
              </div>
            </div>
            <div className="password">
              <div className='pwd-data'>
                <div><p>Password</p></div>
                <div style={{ marginLeft: "80px", fontSize: '20px' }}>
                  <p>{showPassword ? adminsettings.password : maskedPassword}</p>
                </div>
                {/* <div style={{ marginLeft: "25px", cursor: 'pointer' }} onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} style={{ marginTop: '8px' }} />
                </div> */}
                <div
                  style={{ marginLeft: "40px", color: 'blue', fontSize: '13px', marginTop: '5px', cursor: 'pointer' }}
                  onClick={() => setIsModalOpen(true)}
                >
                  <p>Change Password</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Change Password Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Change Password</h3>
            <input
              type="password"
              className="passwordchange-input"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              className="passwordchange-input"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className='first-child' onClick={() => handleChangePassword(currentPassword, newPassword)}>Submit</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default Settings;
