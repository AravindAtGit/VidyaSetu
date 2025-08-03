import { useState, useEffect } from 'react';
import api from '../services/api';

const useContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const fetchContent = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      setAccessDenied(false);
      
      const response = await api.get('/content', { params });
      setContent(response.data);
    } catch (err) {
      console.error('Error fetching content:', err);
      
      if (err.response?.status === 403) {
        setAccessDenied(true);
        setError('No access - You do not have permission to view this content');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch content');
      }
    } finally {
      setLoading(false);
    }
  };

  const createContent = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/content', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      const newContent = response.data;
      setContent(prev => [newContent, ...prev]);
      return newContent;
    } catch (err) {
      console.error('Error creating content:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (id, updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/content/${id}`, updateData);
      const updatedContent = response.data;
      setContent(prev => prev.map(item => 
        item._id === id ? updatedContent : item
      ));
      return updatedContent;
    } catch (err) {
      console.error('Error updating content:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.delete(`/content/${id}`);
      setContent(prev => prev.filter(item => item._id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting content:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    content,
    loading,
    error,
    refreshContent: fetchContent,
    createContent,
    updateContent,
    deleteContent
  };
};

export default useContent;
