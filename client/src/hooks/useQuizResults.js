import { useState, useEffect } from 'react';

const useQuizResults = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuizResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/quiz/results', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuizResults(data);
      } else {
        throw new Error('Failed to fetch quiz results');
      }
    } catch (err) {
      console.error('Error fetching quiz results:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async (quizId, answers) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/quiz/${quizId}/submit`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
      });
      
      if (response.ok) {
        const newResult = await response.json();
        setQuizResults(prev => [newResult, ...prev]);
        return newResult;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit quiz');
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizResults();
  }, []);

  return {
    quizResults,
    loading,
    error,
    refreshQuizResults: fetchQuizResults,
    submitQuiz
  };
};

export default useQuizResults;
