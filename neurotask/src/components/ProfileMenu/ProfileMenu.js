import React, { useState } from 'react';
import profilePic from '../../assets/profile-icon.png'; // Your profile image here
import './ProfileMenu.css'; // Profile Menu specific styles

const ProfileMenu = ({ userEmail, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="profile-container" onClick={() => setDropdownOpen(!dropdownOpen)}>
      <img src={profilePic} alt="Profile" className="profile-icon" />
      {dropdownOpen && (
        <div className="profile-dropdown">
          <p>{userEmail}</p>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
