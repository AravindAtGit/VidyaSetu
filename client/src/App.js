import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AboutVidyaSetu from './pages/public/AboutVidyaSetu';
import HowToParticipate from './pages/public/HowToParticipate';
import ContributePage from './pages/public/ContributePage';
import Home from './pages/public/Home';
import TestPage from './pages/public/TestPage';
import SchoolLogin from './pages/auth/SchoolLogin';
import StudentLogin from './pages/auth/StudentLogin';
import VolunteerLogin from './pages/auth/VolunteerLogin';
import SchoolRegister from './pages/auth/SchoolRegister';
import VolunteerRegister from './pages/auth/VolunteerRegister';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import StudentLayout from './layouts/StudentLayout/StudentLayout';
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import PublicLayout from './components/PublicLayout';

// Volunteer Pages
import History from './pages/volunteer/History';
import ApplyInfraForm from './pages/volunteer/ApplyInfraForm';
import VolunteerMyApplications from './pages/volunteer/VolunteerMyApplications';
import VolunteerInfraRequests from './pages/volunteer/VolunteerInfraRequests';
import VolunteerInfraApplications from './pages/volunteer/VolunteerInfraApplications';

// Student Pages
import MyClasses from './pages/student/MyClasses';
import Resources from './pages/student/Resources';
import Progress from './pages/student/Progress';
import StudentQuizzes from './pages/student/Quizzes';

// Admin Pages
import Applications from './pages/admin/Applications';
import Students from './pages/admin/Students';
import StudentDetail from './pages/admin/StudentDetail';
import Reports from './pages/admin/Reports';
import SchoolInfraRequests from './pages/admin/SchoolInfraRequests';
import SchoolHistory from './pages/admin/SchoolHistory';
import UploadContent from './pages/admin/UploadContent';
import AdminQuizzes from './pages/admin/Quizzes';
import QuizResults from './pages/admin/QuizResults';
import VirtualClasses from './pages/admin/VirtualClasses';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutVidyaSetu />} />
        <Route path="/how-to-participate" element={<HowToParticipate />} />
        <Route path="/contribute" element={<ContributePage />} />
        <Route path="/infra-requests" element={<ContributePage />} />
        <Route path="/test" element={<TestPage />} />
        
        {/* Volunteer pages accessible from public layout */}
        <Route 
          path="/volunteer/applications" 
          element={
            <ProtectedRoute role="volunteer">
              <VolunteerMyApplications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/volunteer/history" 
          element={
            <ProtectedRoute role="volunteer">
              <History />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/volunteer/infra/apply/:id" 
          element={
            <ProtectedRoute role="volunteer">
              <ApplyInfraForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/volunteer/apply/:requestId" 
          element={
            <ProtectedRoute role="volunteer">
              <ApplyInfraForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/volunteer/infra/requests" 
          element={
            <ProtectedRoute role="volunteer">
              <VolunteerInfraRequests />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/volunteer/infra/my-applications" 
          element={
            <ProtectedRoute role="volunteer">
              <VolunteerInfraApplications />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Auth routes (no layout wrapper) */}
      <Route path="/login/school" element={<SchoolLogin />} />
      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/login/volunteer" element={<VolunteerLogin />} />
      <Route path="/register/school" element={<SchoolRegister />} />
      <Route path="/register/volunteer" element={<VolunteerRegister />} />

      {/* Student routes with StudentLayout */}
      <Route 
        path="/student" 
        element={
          <ProtectedRoute role="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="my-classes" element={<MyClasses />} />
        <Route path="resources" element={<Resources />} />
        <Route path="progress" element={<Progress />} />
        <Route path="quizzes" element={<StudentQuizzes />} />
      </Route>

      {/* School Admin routes with AdminLayout */}
      <Route 
        path="/school" 
        element={
          <ProtectedRoute role="school">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        {/* Infrastructure Management */}
        <Route path="requests" element={<SchoolInfraRequests />} />
        <Route path="history" element={<SchoolHistory />} />
        <Route path="applications" element={<Applications />} />
        <Route path="infra/apps/:requestId" element={<Applications />} />
        {/* Student Management */}
        <Route path="students" element={<Students />} />
        <Route path="students/:studentId" element={<StudentDetail />} />
        {/* Educational Content Management */}
        <Route path="upload" element={<UploadContent />} />
        <Route path="quizzes" element={<AdminQuizzes />} />
        <Route path="quiz-results" element={<QuizResults />} />
        <Route path="virtual-classes" element={<VirtualClasses />} />
        {/* Reports and Analytics */}
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;
