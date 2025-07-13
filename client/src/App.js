import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AboutVidyaSetu from './pages/public/AboutVidyaSetu';
import HowToParticipate from './pages/public/HowToParticipate';
import Contribute from './pages/public/Contribute';
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
import VolunteerLayout from './components/VolunteerLayout';
import PublicLayout from './components/PublicLayout';

// Volunteer Pages
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import BrowseRequests from './pages/volunteer/BrowseRequests';
import MyApplications from './pages/volunteer/MyApplications';
import History from './pages/volunteer/History';
import ApplyInfraForm from './pages/volunteer/ApplyInfraForm';
import VolunteerMyApplications from './pages/volunteer/VolunteerMyApplications';

// Student Pages
import MyClasses from './pages/student/MyClasses';
import Resources from './pages/student/Resources';
import Progress from './pages/student/Progress';

// Admin Pages
import Requests from './pages/admin/Requests';
import Applications from './pages/admin/Applications';
import Students from './pages/admin/Students';
import Reports from './pages/admin/Reports';
import SchoolInfraRequests from './pages/admin/SchoolInfraRequests';
import SchoolInfraApplications from './pages/admin/SchoolInfraApplications';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutVidyaSetu />} />
        <Route path="/how-to-participate" element={<HowToParticipate />} />
        <Route path="/contribute" element={<Contribute />} />
        <Route path="/infra-requests" element={<ContributePage />} />
        <Route path="/test" element={<TestPage />} />
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
      </Route>

      {/* Admin routes with AdminLayout */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute role="school">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="requests" element={<Requests />} />
        <Route path="applications" element={<Applications />} />
        <Route path="students" element={<Students />} />
        <Route path="reports" element={<Reports />} />
        <Route path="infra/requests" element={<SchoolInfraRequests />} />
        <Route path="infra/apps/:requestId" element={<SchoolInfraApplications />} />
      </Route>

      {/* Volunteer routes with VolunteerLayout */}
      <Route 
        path="/volunteer" 
        element={
          <ProtectedRoute role="volunteer">
            <VolunteerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<VolunteerDashboard />} />
        <Route path="browse-requests" element={<BrowseRequests />} />
        <Route path="my-applications" element={<MyApplications />} />
        <Route path="history" element={<History />} />
        <Route path="infra/requests" element={<ContributePage />} />
        <Route path="infra/apply/:id" element={<ApplyInfraForm />} />
        <Route path="infra/my-applications" element={<VolunteerMyApplications />} />
      </Route>
    </Routes>
  );
}

export default App;
