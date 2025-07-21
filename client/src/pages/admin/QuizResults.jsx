import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { load, save } from '../../utils/storage';
import './AdminPages.css';

const QuizResults = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [filter, setFilter] = useState('all');
  const [exportStatus, setExportStatus] = useState('');

  useEffect(() => {
    loadQuizResults();
  }, []);

  useEffect(() => {
    filterResults();
  }, [filter, quizResults]);

  const loadQuizResults = () => {
    const results = load('quizResults', []);
    setQuizResults(results);
  };

  const filterResults = () => {
    let filtered = [...quizResults];
    
    switch (filter) {
      case 'passed':
        filtered = filtered.filter(result => result.score >= 60);
        break;
      case 'failed':
        filtered = filtered.filter(result => result.score < 60);
        break;
      case 'excellent':
        filtered = filtered.filter(result => result.score >= 90);
        break;
      default:
        break;
    }
    
    setFilteredResults(filtered);
  };

  const getGradeFromScore = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getGradeColor = (grade) => {
    const colors = {
      A: '#4CAF50',
      B: '#8BC34A',
      C: '#FFC107',
      D: '#FF9800',
      F: '#F44336'
    };
    return colors[grade] || '#757575';
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Student ID', 'Student Name', 'Quiz Title', 'Score', 'Grade', 'Submitted At'],
      ...filteredResults.map(result => [
        result.studentId,
        result.studentName || 'N/A',
        result.quizTitle || 'N/A',
        result.score,
        getGradeFromScore(result.score),
        new Date(result.submittedAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `quiz-results-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExportStatus('CSV exported successfully!');
    setTimeout(() => setExportStatus(''), 3000);
  };

  const calculateStats = () => {
    const total = filteredResults.length;
    const passed = filteredResults.filter(result => result.score >= 60).length;
    const averageScore = total > 0 ? (filteredResults.reduce((sum, result) => sum + result.score, 0) / total).toFixed(1) : 0;
    
    return { total, passed, averageScore };
  };

  const stats = calculateStats();

  return (
    <ProtectedRoute role="school">
      <div className="admin-page">
        <div className="page-header">
          <h1>Quiz Results</h1>
          <p>View and analyze student quiz submissions and performance</p>
        </div>

        <div className="page-content">
          {/* Statistics Cards */}
          <div className="stats-container">
            <div className="stat-card">
              <h3>Total Submissions</h3>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-card">
              <h3>Passed</h3>
              <div className="stat-value">{stats.passed}</div>
            </div>
            <div className="stat-card">
              <h3>Pass Rate</h3>
              <div className="stat-value">
                {stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}%
              </div>
            </div>
            <div className="stat-card">
              <h3>Average Score</h3>
              <div className="stat-value">{stats.averageScore}%</div>
            </div>
          </div>

          {/* Controls */}
          <div className="controls-container">
            <div className="filter-group">
              <label htmlFor="filter">Filter Results:</label>
              <select 
                id="filter"
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Results</option>
                <option value="passed">Passed (≥60%)</option>
                <option value="failed">Failed (&lt;60%)</option>
                <option value="excellent">Excellent (≥90%)</option>
              </select>
            </div>

            <button onClick={exportToCSV} className="export-btn">
              Export to CSV
            </button>
          </div>

          {exportStatus && (
            <div className="export-status">{exportStatus}</div>
          )}

          {/* Results Table */}
          <div className="results-table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Quiz Title</th>
                  <th>Score</th>
                  <th>Grade</th>
                  <th>Submitted At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-results">
                      No quiz results found
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((result, index) => {
                    const grade = getGradeFromScore(result.score);
                    return (
                      <tr key={index}>
                        <td>{result.studentId}</td>
                        <td>{result.studentName || 'N/A'}</td>
                        <td>{result.quizTitle || 'N/A'}</td>
                        <td>{result.score}%</td>
                        <td>
                          <span 
                            className="grade-badge"
                            style={{ backgroundColor: getGradeColor(grade) }}
                          >
                            {grade}
                          </span>
                        </td>
                        <td>
                          {new Date(result.submittedAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button 
                            className="view-btn"
                            onClick={() => console.log('View detailed result:', result)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default QuizResults;
