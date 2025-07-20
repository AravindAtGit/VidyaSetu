import React, { useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { load, save } from '../../utils/storage';
import './AdminPages.css';

const VirtualClasses = () => {
  const [classes, setClasses] = useState(load('virtualClasses', []));
  const [className, setClassName] = useState('');
  const [classDate, setClassDate] = useState('');
  const [classTime, setClassTime] = useState('');
  const [message, setMessage] = useState('');

  const addClass = () => {
    const newClass = {
      name: className,
      date: classDate,
      time: classTime,
      createdAt: new Date().toISOString(),
    };
    const updatedClasses = [...classes, newClass];
    save('virtualClasses', updatedClasses);
    setClasses(updatedClasses);
    setClassName('');
    setClassDate('');
    setClassTime('');
    setMessage('Class scheduled successfully.');
  };

  const deleteClass = (index) => {
    const updatedClasses = classes.filter((_, i) => i !== index);
    save('virtualClasses', updatedClasses);
    setClasses(updatedClasses);
    setMessage('Class deleted successfully.');
  };

  return (
    <ProtectedRoute role="school">
      <div className="admin-page">
        <div className="page-header">
          <h1>Schedule Virtual Classes</h1>
          <p>Manage and schedule virtual class sessions for students.</p>
        </div>

        <div className="class-form">
          <label>
            Class Name:
            <input 
              type="text" 
              value={className} 
              onChange={(e) => setClassName(e.target.value)} 
            />
          </label>

          <label>
            Date:
            <input 
              type="date" 
              value={classDate} 
              onChange={(e) => setClassDate(e.target.value)} 
            />
          </label>
          
          <label>
            Time:
            <input 
              type="time" 
              value={classTime} 
              onChange={(e) => setClassTime(e.target.value)} 
            />
          </label>

          <button type="button" onClick={addClass}>Schedule Class</button>
        </div>

        {message && <p className="message">{message}</p>}

        <ul className="class-list">
          {classes.map((classItem, index) => (
            <li key={index}>
              {classItem.name} - {classItem.date} @ {classItem.time}
              <button onClick={() => deleteClass(index)}>Delete</button>
            </li>
          ))}
        </ul>

      </div>
    </ProtectedRoute>
  );
};

export default VirtualClasses;

