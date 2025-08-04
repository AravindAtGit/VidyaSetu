import React, { useState, useEffect } from 'react';
import { load, save } from '../../utils/storage';
import { getUser } from '../../utils/auth';
import './StudentPages.css';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizStarted) {
      handleQuizSubmit();
    }
    return () => clearInterval(timer);
  }, [timeLeft, quizStarted]);

  const loadData = () => {
    const allQuizzes = load('quizzes', []);
    const results = load('quizResults', []);
    const currentUser = getUser();
    
    setQuizzes(allQuizzes);
    setCompletedQuizzes(results.filter(result => result.studentId === currentUser?.id));
  };

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setTimeLeft(quiz.questions.length * 60); // 1 minute per question
    setQuizStarted(true);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuizSubmit = () => {
    const correctAnswers = currentQuiz.questions.filter((question, index) => 
      answers[index] === question.correct
    ).length;
    
    const finalScore = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
    setScore(finalScore);
    
    // Save result
    const result = {
      studentId: getUser()?.id,
      studentName: getUser()?.name,
      quizId: currentQuiz.id,
      quizTitle: currentQuiz.title,
      score: finalScore,
      answers: answers,
      submittedAt: new Date().toISOString()
    };
    
    const results = load('quizResults', []);
    results.push(result);
    save('quizResults', results);
    
    setShowResults(true);
    setQuizStarted(false);
    loadData();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isQuizCompleted = (quizId) => {
    return completedQuizzes.some(result => result.quizId === quizId);
  };

  const getQuizResult = (quizId) => {
    return completedQuizzes.find(result => result.quizId === quizId);
  };

  if (showResults) {
    return (
      <div className="student-page">
        <div className="quiz-results">
          <div className="results-header">
            <h1>Quiz Results</h1>
            <div className="score-display">
              <div className="score-circle">
                <span className="score-number">{score}%</span>
              </div>
              <p>You scored {score}% on "{currentQuiz.title}"</p>
            </div>
          </div>
          
          <div className="results-summary">
            <div className="summary-item">
              <h3>Questions Answered</h3>
              <p>{Object.keys(answers).length} of {currentQuiz.questions.length}</p>
            </div>
            <div className="summary-item">
              <h3>Correct Answers</h3>
              <p>{Math.round(score * currentQuiz.questions.length / 100)} of {currentQuiz.questions.length}</p>
            </div>
            <div className="summary-item">
              <h3>Grade</h3>
              <p>{score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'}</p>
            </div>
          </div>
          
          <div className="results-actions">
            <button onClick={() => {
              setCurrentQuiz(null);
              setShowResults(false);
              setQuizStarted(false);
            }} className="back-btn">
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentQuiz) {
    const question = currentQuiz.questions[currentQuestion];
    return (
      <div className="student-page">
        <div className="quiz-container">
          <div className="quiz-header">
            <h1>{currentQuiz.title}</h1>
            <div className="quiz-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentQuestion + 1) / currentQuiz.questions.length) * 100}%` }}
                />
              </div>
              <span>Question {currentQuestion + 1} of {currentQuiz.questions.length}</span>
            </div>
            <div className="timer">
              Time Left: {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="question-container">
            <h2>{question.text}</h2>
            <div className="answers-grid">
              {question.answers.map((answer, index) => (
                <button
                  key={index}
                  className={`answer-btn ${answers[currentQuestion] === index ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
          
          <div className="quiz-navigation">
            <button 
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="nav-btn"
            >
              Previous
            </button>
            
            {currentQuestion === currentQuiz.questions.length - 1 ? (
              <button onClick={handleQuizSubmit} className="submit-btn">
                Submit Quiz
              </button>
            ) : (
              <button onClick={nextQuestion} className="nav-btn">
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-page">
      <div className="page-header">
        <h1>Available Quizzes</h1>
        <p>Test your knowledge with these interactive quizzes</p>
      </div>
      
      <div className="page-content">
        <div className="quizzes-grid">
          {quizzes.length === 0 ? (
            <div className="no-quizzes">
              <div className="no-quizzes-icon">❓</div>
              <h3>No quizzes available</h3>
              <p>Check back later for new quizzes!</p>
            </div>
          ) : (
            quizzes.map((quiz, index) => {
              const isCompleted = isQuizCompleted(quiz.id);
              const result = getQuizResult(quiz.id);
              
              return (
                <div key={index} className="quiz-card">
                  <div className="quiz-header">
                    <h3>{quiz.title}</h3>
                    {isCompleted && (
                      <span className="completed-badge">
                        Completed - {result?.score}%
                      </span>
                    )}
                  </div>
                  
                  <div className="quiz-info">
                    <p><strong>Subject:</strong> {quiz.subject || 'General'}</p>
                    <p><strong>Class:</strong> {quiz.class || 'All Classes'}</p>
                    <p><strong>Questions:</strong> {quiz.questions.length}</p>
                    <p><strong>Time Limit:</strong> {quiz.questions.length} minutes</p>
                  </div>
                  
                  <div className="quiz-actions">
                    <button 
                      onClick={() => startQuiz(quiz)}
                      className={`start-btn ${isCompleted ? 'retake' : ''}`}
                    >
                      {isCompleted ? 'Retake Quiz' : 'Start Quiz'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
