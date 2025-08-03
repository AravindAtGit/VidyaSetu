import { useState, useEffect } from 'react';
import api from '../services/api';

const useQuizzes = () =>{
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const fetchQuizzes = async () =>{
    try {
      setLoading(true);
      setError(null);
      setAccessDenied(false);
      
      const response = await api.get('/quiz');
      setQuizzes(response.data);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      
      if (err.response?.status === 403) {
        setAccessDenied(true);
        setError('No access - You do not have permission to view quizzes');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch quizzes');
      }
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (quizData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/quiz', quizData);
      const newQuiz = response.data;
      setQuizzes(prev => [newQuiz, ...prev]);
      return newQuiz;
    } catch (err) {
      console.error('Error creating quiz:', err);
      
      if (err.response?.status === 403) {
        setError('No access - You do not have permission to create quizzes');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to create quiz');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuiz = async (id, updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/quiz/${id}`, updateData);
      const updatedQuiz = response.data;
      setQuizzes(prev => prev.map(quiz => 
        quiz._id === id ? updatedQuiz : quiz
      ));
      return updatedQuiz;
    } catch (err) {
      console.error('Error updating quiz:', err);
      
      if (err.response?.status === 403) {
        setError('No access - You do not have permission to update quizzes');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to update quiz');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.delete(`/quiz/${id}`);
      setQuizzes(prev => prev.filter(quiz => quiz._id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting quiz:', err);
      
      if (err.response?.status === 403) {
        setError('No access - You do not have permission to delete quizzes');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to delete quiz');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return {
    quizzes,
    loading,
    error,
    refreshQuizzes: fetchQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz
  };
};

export default useQuizzes;
