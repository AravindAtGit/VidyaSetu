import { useState, useEffect } from 'react';

const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/school/students', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);
      } else {
        throw new Error('Failed to fetch students');
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (studentData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/school/students', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });

      if (response.ok) {
        const newStudent = await response.json();
        setStudents(prev => [...prev, newStudent]);
        return newStudent;
      } else {
        throw new Error('Failed to add student');
      }
    } catch (err) {
      console.error('Error adding student:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id, updateData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/school/students/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedStudent = await response.json();
        setStudents(prev => prev.map(student => 
          student._id === id ? updatedStudent : student
        ));
        return updatedStudent;
      } else {
        throw new Error('Failed to update student');
      }
    } catch (err) {
      console.error('Error updating student:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/school/students/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setStudents(prev => prev.filter(student => student._id !== id));
        return true;
      } else {
        throw new Error('Failed to delete student');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    refreshStudents: fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent
  };
};

export default useStudents;

