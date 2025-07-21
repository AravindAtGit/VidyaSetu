import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import { load, save } from '../../utils/storage';
import './AdminPages.css';

const StudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, [studentId]);

  const loadStudentData = () => {
    try {
      const students = load('students', []);
      const studentData = students.find(s => s.id === studentId);
      
      if (studentData) {
        setStudent(studentData);
        
        // Load quiz results for this student
        const allQuizResults = load('quizResults', []);
        const studentQuizResults = allQuizResults.filter(result => result.studentId === studentId);
        setQuizResults(studentQuizResults);
      }
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageScore = () => {
    if (quizResults.length === 0) return 0;
    const total = quizResults.reduce((sum, result) => sum + result.score, 0);
    return Math.round((total / quizResults.length) * 100) / 100;
  };

  const getGradeDistribution = () => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    quizResults.forEach(result => {
      const percentage = result.score;
      if (percentage >= 90) distribution.A++;
      else if (percentage >= 80) distribution.B++;
      else if (percentage >= 70) distribution.C++;
      else if (percentage >= 60) distribution.D++;
      else distribution.F++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <ProtectedRoute role="school">
        <div className="admin-page">
          <div className="loading">Loading student details...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!student) {
    return (
      <ProtectedRoute role="school">
        <div className="admin-page">
          <div className="error">Student not found</div>
          <button onClick={() => navigate('/admin/students')}>Back to Students</button>
        </div>
      </ProtectedRoute>
    );
  }

  const gradeDistribution = getGradeDistribution();
  const averageScore = calculateAverageScore();

  return (
    <ProtectedRoute role="school">
      <div className="admin-page">
        <div className="page-header">
          <button onClick={() => navigate('/admin/students')} className="back-btn">
            ← Back to Students
          </button>
          <h1>Student Profile</h1>
          <p>Detailed view of student information and progress</p>
        </div>

        <div className="student-detail-container">
          {/* Student Profile Section */}
          <div className="profile-section">
            <div className="profile-header">
              <div className="profile-avatar">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <h2>{student.name}</h2>
                <p>Student ID: {student.id}</p>
                <p>Email: {student.email}</p>
                <p>Phone: {student.phone}</p>
                <p>Grade: {student.grade}</p>
                <p>Joined: {new Date(student.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Progress Charts Section */}
          <div className="progress-section">
            <h3>Academic Progress</h3>
            
            <div className="progress-stats">
              <div className="stat-card">
                <h4>Total Quizzes</h4>
                <div className="stat-value">{quizResults.length}</div>
              </div>
              <div className="stat-card">
                <h4>Average Score</h4>
                <div className="stat-value">{averageScore}%</div>
              </div>
              <div className="stat-card">
                <h4>Best Score</h4>
                <div className="stat-value">
                  {quizResults.length > 0 ? Math.max(...quizResults.map(r => r.score)) : 0}%
                </div>
              </div>
            </div>

            {/* Grade Distribution Chart */}
            <div className="chart-container">
              <h4>Grade Distribution</h4>
              <div className="grade-chart">
                {Object.entries(gradeDistribution).map(([grade, count]) => (
                  <div key={grade} className="grade-bar">
                    <div className="grade-label">{grade}</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{ 
                          width: `${quizResults.length > 0 ? (count / quizResults.length) * 100 : 0}%`,
                          backgroundColor: grade === 'A' ? '#4CAF50' : 
                                         grade === 'B' ? '#8BC34A' : 
                                         grade === 'C' ? '#FFC107' : 
                                         grade === 'D' ? '#FF9800' : '#F44336'
                        }}
                      ></div>
                    </div>
                    <div className="grade-count">{count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Quiz Results */}
            <div className="recent-results">
              <h4>Recent Quiz Results</h4>
              {quizResults.length === 0 ? (
                <p>No quiz results available</p>
              ) : (
                <div className="results-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Quiz</th>
                        <th>Score</th>
                        <th>Date</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizResults.slice(-10).reverse().map((result, index) => (
                        <tr key={index}>
                          <td>{result.quizTitle || `Quiz ${index + 1}`}</td>
                          <td>{result.score}%</td>
                          <td>{new Date(result.submittedAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`grade-badge grade-${
                              result.score >= 90 ? 'a' : 
                              result.score >= 80 ? 'b' : 
                              result.score >= 70 ? 'c' : 
                              result.score >= 60 ? 'd' : 'f'
                            }`}>
                              {result.score >= 90 ? 'A' : 
                               result.score >= 80 ? 'B' : 
                               result.score >= 70 ? 'C' : 
                               result.score >= 60 ? 'D' : 'F'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentDetail;
