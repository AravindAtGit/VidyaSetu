import React, { useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useQuizzes } from '../../hooks';
import './AdminPages.css';

const Quizzes = () => {
  const {
    quizzes,
    loading,
    error,
    createQuiz,
    deleteQuiz
  } = useQuizzes();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ text: '', answers: ['', ''], correct: 0 });
  const [timeLimit, setTimeLimit] = useState(60); // in minutes
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [message, setMessage] = useState('');

  const addQuestion = () => {
    setQuestions([...questions, { ...newQuestion }]);
    setNewQuestion({ text: '', answers: ['', ''], correct: 0 });
  };

  const addQuiz = async () => {
    if (!title || !subject || !className || questions.length === 0) {
      setMessage('Please fill in all required fields and add at least one question.');
      return;
    }

    try {
      const quizData = {
        title,
        subject,
        class: className,
        questions,
        timeLimit,
        maxAttempts
      };
      await createQuiz(quizData);
      setTitle('');
      setSubject('');
      setClassName('');
      setQuestions([]);
      setTimeLimit(60);
      setMaxAttempts(3);
      setMessage('Quiz created successfully.');
    } catch (error) {
      setMessage('Failed to create quiz. Please try again.');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(quizId);
        setMessage('Quiz deleted successfully.');
      } catch (error) {
        setMessage('Failed to delete quiz. Please try again.');
      }
    }
  };

  return (
    <ProtectedRoute role="school">
      <div className="admin-page">
        <div className="page-header">
          <h1>Manage Quizzes</h1>
          <p>Create, read, update, and delete multiple choice quizzes.</p>
        </div>

        <div className="page-content">
          <div className="quiz-form">
            <label>
              Quiz Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
            
            <label>
              Subject:
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Mathematics"
                required
              />
            </label>
            
            <label>
              Class:
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g., 10th Grade"
                required
              />
            </label>
            
            <label>
              Time Limit (minutes):
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                min="1"
                required
              />
            </label>
            
            <label>
              Max Attempts:
              <input
                type="number"
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(parseInt(e.target.value))}
                min="1"
                required
              />
            </label>

            <h2>Add Questions</h2>
            <div>
              <label>
                Question:
                <input
                  type="text"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                />
              </label>
              <div>
                {newQuestion.answers.map((answer, idx) => (
                  <label key={idx}>
                    Answer {idx + 1}:
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => {
                        const newAnswers = [...newQuestion.answers];
                        newAnswers[idx] = e.target.value;
                        setNewQuestion({ ...newQuestion, answers: newAnswers });
                      }}
                    />
                  </label>
                ))}

                <button
                  type="button"
                  onClick={() => setNewQuestion({ ...newQuestion, answers: [...newQuestion.answers, ''] })}
                >
                  Add Answer
                </button>
              </div>

              <label>
                Correct Answer:
                <select
                  value={newQuestion.correct}
                  onChange={(e) => setNewQuestion({ ...newQuestion, correct: parseInt(e.target.value, 10) })}
                >
                  {newQuestion.answers.map((_, idx) => (
                    <option key={idx} value={idx}>
                      Answer {idx + 1}
                    </option>
                  ))}
                </select>
              </label>

              <button type="button" onClick={addQuestion}>
                Add Question
              </button>
            </div>

            <button type="button" onClick={addQuiz}>
              Save Quiz
            </button>
          </div>

          {message && <p className="message">{message}</p>}

          <h2>Available Quizzes</h2>
          {loading ? (
            <p>Loading quizzes...</p>
          ) : error ? (
            <p className="error">Error: {error}</p>
          ) : (
            <ul className="quiz-list">
              {quizzes.map((quiz) => (
                <li key={quiz._id}>
                  <div className="quiz-info">
                    <h4>{quiz.title}</h4>
                    <p>Subject: {quiz.subject} | Class: {quiz.class}</p>
                    <p>Questions: {quiz.questions?.length || 0} | Time: {quiz.timeLimit}min | Max Attempts: {quiz.maxAttempts}</p>
                  </div>
                  <button onClick={() => handleDeleteQuiz(quiz._id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Quizzes;
