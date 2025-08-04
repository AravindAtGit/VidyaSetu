import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserWithRoleDefaults, logoutUser } from '../../utils/auth';
import '../../styles/App.css';

const VolunteerProfile = () => {
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
              <span className="card-icon">🤝</span>
            </div>
            <div>
              <h1 className="card-title">Volunteer Profile</h1>
              <p className="card-subtitle">Manage your volunteer information</p>
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

          {/* Volunteer-Specific Sections */}
          <div className="flex-column">
            <h2 className="text-primary">Volunteer Information</h2>
            <div className="flex-column">
              <div>
                <label className="text-secondary">Expertise Areas:</label>
                <div className="text-primary">
                  {user.expertiseAreas && user.expertiseAreas.length > 0 ? (
                    <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                      {user.expertiseAreas.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No expertise areas specified</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-secondary">Skills:</label>
                <div className="text-primary">
                  {user.skills && user.skills.length > 0 ? (
                    <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                      {user.skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No skills specified</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-secondary">Availability:</label>
                <p className="text-primary">{user.availability || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-secondary">Volunteer ID:</label>
                <p className="text-primary">{user.volunteerId || user.id || 'Not assigned'}</p>
              </div>
            </div>
          </div>

          {/* Additional Volunteer Information */}
          <div className="flex-column mt-2">
            <h2 className="text-primary">Contact & Background</h2>
            <div className="flex-column">
              <div>
                <label className="text-secondary">Phone Number:</label>
                <p className="text-primary">{user.phoneNumber || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-secondary">Organization:</label>
                <p className="text-primary">{user.organization || 'Independent volunteer'}</p>
              </div>
              <div>
                <label className="text-secondary">Years of Experience:</label>
                <p className="text-primary">{user.yearsOfExperience || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-secondary">Bio:</label>
                <p className="text-primary">{user.bio || 'No bio provided'}</p>
              </div>
              <div>
                <label className="text-secondary">Join Date:</label>
                <p className="text-primary">{user.joinDate || user.createdAt || 'Not available'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerProfile;
