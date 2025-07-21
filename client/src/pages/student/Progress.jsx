import React, { useState, useEffect } from 'react';
import { load } from '../../utils/storage';
import { getUser } from '../../utils/auth';
import './StudentPages.css';

const Progress = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const user = getUser();
    setCurrentUser(user);
    
    const allResults = load('quizResults', []);
    const myResults = allResults.filter(result => result.studentId === user?.id);
    setQuizResults(myResults);
    
    setQuizzes(load('quizzes', []));
    setVideos(load('videos', []));
    setPdfs(load('pdfs', []));
  };

  const calculateOverallStats = () => {
    const totalQuizzes = quizzes.length;
    const completedQuizzes = quizResults.length;
    const averageScore = quizResults.length > 0 
      ? Math.round(quizResults.reduce((sum, result) => sum + result.score, 0) / quizResults.length)
      : 0;
    const totalContent = videos.length + pdfs.length;
    
    return {
      totalQuizzes,
      completedQuizzes,
      averageScore,
      totalContent,
      completionRate: totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0
    };
  };

  const getSubjectStats = () => {
    const subjectMap = {};
    
    quizResults.forEach(result => {
      const subject = result.quizTitle || 'General'; // Using quiz title as subject for now
      if (!subjectMap[subject]) {
        subjectMap[subject] = {
          subject,
          totalQuizzes: 0,
          totalScore: 0,
          averageScore: 0,
          bestScore: 0,
          recentScore: 0
        };
      }
      subjectMap[subject].totalQuizzes++;
      subjectMap[subject].totalScore += result.score;
      subjectMap[subject].bestScore = Math.max(subjectMap[subject].bestScore, result.score);
      subjectMap[subject].recentScore = result.score; // Last result becomes recent
    });
    
    Object.keys(subjectMap).forEach(subject => {
      const stats = subjectMap[subject];
      stats.averageScore = Math.round(stats.totalScore / stats.totalQuizzes);
    });
    
    return Object.values(subjectMap);
  };

  const getRecentActivity = () => {
    return quizResults
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, 5)
      .map(result => ({
        type: 'quiz',
        title: result.quizTitle,
        score: result.score,
        date: result.submittedAt
      }));
  };

  const getProgressTrend = () => {
    const sortedResults = quizResults.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
    return sortedResults.map(result => ({
      date: new Date(result.submittedAt).toLocaleDateString(),
      score: result.score,
      quiz: result.quizTitle
    }));
  };

  const overallStats = calculateOverallStats();
  const subjectStats = getSubjectStats();
  const recentActivity = getRecentActivity();
  const progressTrend = getProgressTrend();

  return (
    <div className="student-page">
      <div className="page-header">
        <h1>My Progress</h1>
        <p>Track your learning progress and achievements</p>
      </div>
      
      <div className="page-content">
        {/* Overall Stats */}
        <div className="stats-section">
          <h2>Overall Performance</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>Average Score</h3>
                <p className="stat-value">{overallStats.averageScore}%</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>Quizzes Completed</h3>
                <p className="stat-value">{overallStats.completedQuizzes}/{overallStats.totalQuizzes}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-info">
                <h3>Completion Rate</h3>
                <p className="stat-value">{overallStats.completionRate}%</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>Available Content</h3>
                <p className="stat-value">{overallStats.totalContent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="subjects-section">
          <h2>Subject Performance</h2>
          {subjectStats.length === 0 ? (
            <p>No quiz results available yet.</p>
          ) : (
            <div className="subjects-grid">
              {subjectStats.map((subject, index) => (
                <div key={index} className="subject-card">
                  <h3>{subject.subject}</h3>
                  <div className="subject-stats">
                    <div className="subject-stat">
                      <span className="stat-label">Average:</span>
                      <span className="stat-value">{subject.averageScore}%</span>
                    </div>
                    <div className="subject-stat">
                      <span className="stat-label">Best:</span>
                      <span className="stat-value">{subject.bestScore}%</span>
                    </div>
                    <div className="subject-stat">
                      <span className="stat-label">Quizzes:</span>
                      <span className="stat-value">{subject.totalQuizzes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h2>Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p>No recent activity.</p>
          ) : (
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">❓</div>
                  <div className="activity-details">
                    <h4>{activity.title}</h4>
                    <p>Score: {activity.score}%</p>
                    <small>{new Date(activity.date).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress Trend */}
        <div className="trend-section">
          <h2>Progress Trend</h2>
          {progressTrend.length === 0 ? (
            <p>Take more quizzes to see your progress trend.</p>
          ) : (
            <div className="trend-chart">
              <div className="trend-points">
                {progressTrend.map((point, index) => (
                  <div key={index} className="trend-point">
                    <div className="point-score">{point.score}%</div>
                    <div className="point-date">{point.date}</div>
                    <div className="point-quiz">{point.quiz}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress; 