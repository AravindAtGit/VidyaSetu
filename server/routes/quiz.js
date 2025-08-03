const express = require('express');
const { validateSchoolClassAccess, filterBySchoolClass } = require('../middleware/accessControl');
const authSession = require('../middleware/authSession');
const roleCheck = require('../middleware/roleCheck');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');

const router = express.Router();

// Apply authentication to all routes
router.use(authSession);

// POST create a quiz (school role)
router.post('/', roleCheck('school'), async (req, res) => {
  try {
    const { title, subject, class: className, questions, timeLimit, maxAttempts } = req.body;
    const quiz = new Quiz({
      title,
      subject,
      class: className,
      school: req.schoolId,
      questions,
      timeLimit,
      maxAttempts,
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create quiz' });
  }
});

// GET one quiz
router.get('/:id', validateSchoolClassAccess('Quiz'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // For students, hide correct answers
    if (req.userType === 'student') {
      const quizForStudent = quiz.toObject();
      quizForStudent.questions = quizForStudent.questions.map(q => ({
        text: q.text,
        answers: q.answers
        // Don't include the correct answer index
      }));
      return res.json(quizForStudent);
    }
    
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// List quizzes with filters (student role auto-filters by schoolId and class)
router.get('/', async (req, res) => {
  try {
    const query = filterBySchoolClass(req, { isActive: true });
    const quizzes = await Quiz.find(query).select('-questions.correct');
    
    // For students, also check quiz availability based on attempts
    if (req.userType === 'student') {
      const quizzesWithAttempts = await Promise.all(
        quizzes.map(async (quiz) => {
          const attempts = await QuizResult.countDocuments({
            student: req.session.user.userId,
            quiz: quiz._id
          });
          
          return {
            ...quiz.toObject(),
            remainingAttempts: Math.max(0, quiz.maxAttempts - attempts),
            canAttempt: attempts < quiz.maxAttempts
          };
        })
      );
      return res.json(quizzesWithAttempts);
    }
    
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST submit quiz answers
router.post('/:id/submit', validateSchoolClassAccess('Quiz'), async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const attemptCount = await QuizResult.countDocuments({
      student: req.session.user.userId,
      quiz: req.params.id
    });

    if (attemptCount >= quiz.maxAttempts) {
      return res.status(403).json({ message: 'Maximum attempts exceeded' });
    }

    // Grade the quiz
    let score = 0;
    const gradedAnswers = answers.map((answer, i) => {
      const isCorrect = quiz.questions[i].correct === answer;
      if (isCorrect) score += 1;
      return {
        questionIndex: i,
        selectedAnswer: answer,
        isCorrect
      };
    });

    const totalQuestions = quiz.questions.length;
    const correctAnswers = gradedAnswers.filter(a => a.isCorrect).length;

    const quizResult = new QuizResult({
      student: req.session.user.userId,
      quiz: req.params.id,
      school: req.schoolId,
      answers: gradedAnswers,
      score: (score / totalQuestions) * 100,
      totalQuestions,
      correctAnswers,
      attemptNumber: attemptCount + 1
    });

    await quizResult.save();
    res.status(200).json(quizResult);
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
});

// PUT update one quiz
router.put('/:id', validateSchoolClassAccess('Quiz'), async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE one quiz
router.delete('/:id', validateSchoolClassAccess('Quiz'), async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
