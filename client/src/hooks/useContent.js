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
      
      const response = await fetch('/api/content', {
        method: 'POST',
        credentials: 'include',
        body: formData // FormData for file uploads
      });
      
      if (response.ok) {
        const newContent = await response.json();
        setContent(prev => [newContent, ...prev]);
        return newContent;
      } else {
        throw new Error('Failed to create content');
      }
    } catch (err) {
      console.error('Error creating content:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (id, updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/content/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        const updatedContent = await response.json();
        setContent(prev => prev.map(item => 
          item._id === id ? updatedContent : item
        ));
        return updatedContent;
      } else {
        throw new Error('Failed to update content');
      }
    } catch (err) {
      console.error('Error updating content:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setContent(prev => prev.filter(item => item._id !== id));
        return true;
      } else {
        throw new Error('Failed to delete content');
      }
    } catch (err) {
      console.error('Error deleting content:', err);
      setError(err.message);
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
