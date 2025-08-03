import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { load } from '../../utils/storage';
import { getUser } from '../../utils/auth';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [virtualClasses, setVirtualClasses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setVideos(load('videos', []));
    setPdfs(load('pdfs', []));
    setQuizzes(load('quizzes', []));
    setQuizResults(load('quizResults', []));
    setVirtualClasses(load('virtualClasses', []));
    setCurrentUser(getUser());
  };

  const calculateStats = () => {
    const myResults = quizResults.filter(result => result.studentId === currentUser?.id);
    const totalContent = videos.length + pdfs.length;
    const completedQuizzes = myResults.length;
    const averageScore = myResults.length > 0 
      ? Math.round(myResults.reduce((sum, result) => sum + result.score, 0) / myResults.length)
      : 0;
    const upcomingClasses = virtualClasses.filter(cls => new Date(cls.date) > new Date()).length;
    
    return {
      totalContent,
      completedQuizzes,
      averageScore,
      upcomingClasses
    };
  };

  const getRecentContent = () => {
    const allContent = [...videos, ...pdfs].sort((a, b) => 
      new Date(b.uploadDate) - new Date(a.uploadDate)
    );
    return allContent.slice(0, 3);
  };

  const getUpcomingClasses = () => {
    return virtualClasses
      .filter(cls => new Date(cls.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  };

  const stats = calculateStats();
  const recentContent = getRecentContent();
  const upcomingClasses = getUpcomingClasses();

  return (
    <div className="student-page">
      <div className="dashboard-wrapper">
        <div className="page-header">
          <h1>Welcome back, {currentUser?.name || 'Student'}!</h1>
          <p>Continue your learning journey with VidyaSetu</p>
        </div>
        
        <div className="page-content">
          <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Available Content</h3>
          <p className="stat-number">{stats.totalContent}</p>
          <p className="stat-change">{videos.length} videos, {pdfs.length} PDFs</p>
        </div>
        
        <div className="stat-card">
          <h3>Quizzes Completed</h3>
          <p className="stat-number">{stats.completedQuizzes}</p>
          <p className="stat-change">Out of {quizzes.length} available</p>
        </div>
        
        <div className="stat-card">
          <h3>Average Score</h3>
          <p className="stat-number">{stats.averageScore}%</p>
          <p className="stat-change">{stats.averageScore >= 80 ? 'Excellent!' : stats.averageScore >= 60 ? 'Good' : 'Keep practicing'}</p>
        </div>
        
        <div className="stat-card">
          <h3>Upcoming Classes</h3>
          <p className="stat-number">{stats.upcomingClasses}</p>
          <p className="stat-change">Scheduled sessions</p>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="content-section">
          <h2>Recent Content</h2>
          {recentContent.length === 0 ? (
            <p>No content available yet.</p>
          ) : (
            <div className="content-list">
              {recentContent.map((content, index) => (
                <div key={index} className="content-item">
                  <div className="content-icon">
                    {content.type === 'video/mp4' ? '🎥' : '📄'}
                  </div>
                  <div className="content-details">
                    <h4>{content.title}</h4>
                    <p>{content.subject} - {content.class}</p>
                    <small>{new Date(content.uploadDate).toLocaleDateString()}</small>
                  </div>
                  <button 
                    className="view-btn"
                    onClick={() => navigate('/student/resources')}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="content-section">
          <h2>Upcoming Classes</h2>
          {upcomingClasses.length === 0 ? (
            <p>No upcoming classes scheduled.</p>
          ) : (
            <div className="class-list">
              {upcomingClasses.map((cls, index) => (
                <div key={index} className="class-item">
                  <div className="class-icon">💻</div>
                  <div className="class-details">
                    <h4>{cls.name}</h4>
                    <p>{new Date(cls.date).toLocaleDateString()} at {cls.time}</p>
                  </div>
                  <button 
                    className="join-btn"
                    onClick={() => navigate('/student/my-classes')}
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="content-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => navigate('/student/resources')}>
              Browse Resources
            </button>
            <button className="action-btn" onClick={() => navigate('/student/my-classes')}>
              View Classes
            </button>
            <button className="action-btn" onClick={() => navigate('/student/progress')}>
              Check Progress
            </button>
            <button className="action-btn" onClick={() => navigate('/student/quizzes')}>
              Take Quiz
            </button>
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default StudentDashboard; 