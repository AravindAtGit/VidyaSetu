import { useState, useEffect } from 'react';

const useVirtualClasses = () => {
  const [virtualClasses, setVirtualClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVirtualClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/virtual-classes', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setVirtualClasses(data);
      } else {
        throw new Error('Failed to fetch virtual classes');
      }
    } catch (err) {
      console.error('Error fetching virtual classes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createVirtualClass = async (classData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/virtual-classes', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(classData)
      });
      
      if (response.ok) {
        const newClass = await response.json();
        setVirtualClasses(prev => [newClass, ...prev]);
        return newClass;
      } else {
        throw new Error('Failed to create virtual class');
      }
    } catch (err) {
      console.error('Error creating virtual class:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateVirtualClass = async (id, updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/virtual-classes/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        const updatedClass = await response.json();
        setVirtualClasses(prev => prev.map(cls => 
          cls._id === id ? updatedClass : cls
        ));
        return updatedClass;
      } else {
        throw new Error('Failed to update virtual class');
      }
    } catch (err) {
      console.error('Error updating virtual class:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVirtualClass = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/virtual-classes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        setVirtualClasses(prev => prev.filter(cls => cls._id !== id));
        return true;
      } else {
        throw new Error('Failed to delete virtual class');
      }
    } catch (err) {
      console.error('Error deleting virtual class:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const enrollStudent = async (classId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/virtual-classes/${classId}/enroll`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        const updatedClass = await response.json();
        setVirtualClasses(prev => prev.map(cls => 
          cls._id === classId ? updatedClass : cls
        ));
        return updatedClass;
      } else {
        throw new Error('Failed to enroll in virtual class');
      }
    } catch (err) {
      console.error('Error enrolling in virtual class:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVirtualClasses();
  }, []);

  return {
    virtualClasses,
    loading,
    error,
    refreshVirtualClasses: fetchVirtualClasses,
    createVirtualClass,
    updateVirtualClass,
    deleteVirtualClass,
    enrollStudent
  };
};

export default useVirtualClasses;
