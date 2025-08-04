import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserWithRoleDefaults, logoutUser } from '../../utils/auth';
import '../../styles/App.css';

const SchoolProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  useEffect(() => {
    const userData = getUserWithRoleDefaults();
    setUser(userData);
  }, []);

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <div className="card-content">
            <p>Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="card-icon-wrapper">
              <span className="card-icon">🏩</span>
            </div>
            <div>
              <h1 className="card-title">School Profile</h1>
              <p className="card-subtitle">Manage your school information</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="btn btn-primary"
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              fontSize: 'var(--fs-100)',
              fontWeight: 'var(--fw-medium)',
              backgroundColor: 'black',
              borderColor: 'black'
            }}
          >
            🚪 Logout
          </button>
        </div>
        
        <div className="card-content">
          {/* Common User Data */}
          <div className="flex-column mb-2">
            <h2 className="text-primary">Personal Information</h2>
            <div className="flex-column">
              <div>
                <label className="text-secondary">Name:</label>
                <p className="text-primary">{user.name || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-secondary">Email:</label>
                <p className="text-primary">{user.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-secondary">Role:</label>
                <p className="text-primary">{user.role || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* School-Specific Sections */}
          <div className="flex-column">
            <h2 className="text-primary">School Information</h2>
            <div className="flex-column">
              <div>
                <label className="text-secondary">School Name:</label>
                <p className="text-primary">{user.schoolName || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-secondary">Total Students:</label>
                <p className="text-primary">{user.totalStudents || 'Data not available'}</p>
              </div>
              <div>
                <label className="text-secondary">Address:</label>
                <p className="text-primary">{user.address || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-secondary">Contact Number:</label>
                <p className="text-primary">{user.contactNumber || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-secondary">School Code:</label>
                <p className="text-primary">{user.schoolCode || user.code || 'Not assigned'}</p>
              </div>
            </div>
          </div>

          {/* Additional School Information */}
          <div className="flex-column mt-2">
            <h2 className="text-primary">Additional Information</h2>
            <div className="flex-column">
              <div>
                <label className="text-secondary">Principal Name:</label>
                <p className="text-primary">{user.principalName || 'Not available'}</p>
              </div>
              <div>
                <label className="text-secondary">Established Year:</label>
                <p className="text-primary">{user.establishedYear || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-secondary">Website:</label>
                <p className="text-primary">{user.website || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolProfile;

