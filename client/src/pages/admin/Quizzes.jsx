import React, { useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { load, save } from '../../utils/storage';
import './AdminPages.css';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState(load('quizzes', []));
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ text: '', answers: ['', ''], correct: 0 });
  const [message, setMessage] = useState('');

  const addQuestion = () => {
    setQuestions([...questions, { ...newQuestion }]);
    setNewQuestion({ text: '', answers: ['', ''], correct: 0 });
  };

  const addQuiz = () => {
    const newQuizzes = [...quizzes, { title, questions }];
    save('quizzes', newQuizzes);
    setQuizzes(newQuizzes);
    setTitle('');
    setQuestions([]);
    setMessage('Quiz added successfully.');
  };

  const deleteQuiz = (index) => {
    const newQuizzes = quizzes.filter((_, i) => i !== index);
    save('quizzes', newQuizzes);
    setQuizzes(newQuizzes);
    setMessage('Quiz deleted successfully.');
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
          <ul className="quiz-list">
            {quizzes.map((quiz, index) => (
              <li key={index}>
                {quiz.title}
                <button onClick={() => deleteQuiz(index)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Quizzes;
