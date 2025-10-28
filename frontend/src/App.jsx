import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CoordinatorDashboard from "./pages/dashboard/coordinator/CoordinatorDashboard";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetSuccess from "./pages/auth/ResetSuccess";
import ClassScheduler from "./pages/dashboard/coordinator/ClassScheduler";
import AttendanceManager from "./pages/dashboard/coordinator/AttendanceManager";
import Announcements from "./pages/dashboard/coordinator/Announcements";
import Reports from "./pages/dashboard/coordinator/Reports";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import UserManagement from "./pages/dashboard/admin/UserManagement";
import CourseManager from "./pages/dashboard/admin/CourseManager";
import BatchManager from "./pages/dashboard/admin/BatchManager";
import FeedbackReports from "./pages/dashboard/admin/FeedbackReports";
import TeacherDashboard from "./pages/dashboard/teacher/TeacherDashboard";
import HomeworkManager from "./pages/dashboard/teacher/HomeworkManager";
import ClassSchedule from "./pages/dashboard/teacher/ClassSchedule";
import TeacherReports from "./pages/dashboard/teacher/TeacherReports";
import StudentDashboard from "./pages/dashboard/student/StudentDashboard";
import SocialMediaDashboard from "./pages/dashboard/socialmedia/SocialDashboard";
import VideoEditorDashboard from "./pages/dashboard/videoeditor/VideoDashboard";
import StudentClasses from "./pages/dashboard/student/StudentClasses";
import StudentHomework from "./pages/dashboard/student/StudentHomework";
import StudentAttendance from "./pages/dashboard/student/StudentAttendance";
import StudentNotices from "./pages/dashboard/student/StudentNotices";
import SocialMediaScheduler from "./pages/dashboard/socialmedia/SocialMediaScheduler";
import SocialMediaIdeas from "./pages/dashboard/socialmedia/SocialMediaIdeas";
import SocialMediaAnalytics from "./pages/dashboard/socialmedia/SocialMediaAnalytics";





// ✅ Optional Home Page
import Home from "./pages/Home";

function App() {
  return (
      <AuthProvider>
        <Routes>
          {/* 🌐 Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 🔐 Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-success" element={<ResetSuccess />} />

          {/* 🚀 Role-based Dashboards (Placeholder for now) */}
          <Route
            path="/dashboard/superadmin"
            element={
              <ProtectedRoute role="superadmin">
                <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#002F6C] to-[#0077C8] text-white text-3xl font-semibold">
                  🧠 SuperAdmin Dashboard (Coming Soon)
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/coordinator"
            element={
              <ProtectedRoute role="coordinator">
                <CoordinatorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/socialmedia"
            element={
              <ProtectedRoute role="socialmedia">
                <SocialMediaDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/videoeditor"
            element={
              <ProtectedRoute role="videoeditor">
                <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#002F6C] to-[#0077C8] text-white text-3xl font-semibold">
                  🎬 Video Editor Dashboard (Coming Soon)
                </div>
              </ProtectedRoute>
            }
          />

          {/* 🚧 Fallback route for unknown URLs */}
          <Route
            path="*"
            element={
              <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#002F6C] to-[#0077C8] text-white text-2xl font-semibold">
                ⚠️ 404 — Page Not Found
              </div>
            }
          />
          <Route
            path="/dashboard/coordinator/scheduler"
            element={
              <ProtectedRoute role="coordinator">
                <ClassScheduler />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/coordinator/attendance"
            element={
              <ProtectedRoute role="coordinator">
                <AttendanceManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/coordinator/announcements"
            element={
              <ProtectedRoute role="coordinator">
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/coordinator/reports"
            element={
              <ProtectedRoute role="coordinator">
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/admin/users"
            element={
              <ProtectedRoute role="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/courses"
            element={
              <ProtectedRoute role="admin">
                <CourseManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/admin/batches"
            element={
              <ProtectedRoute role="admin">
                <BatchManager />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/admin/users"
            element={
              <ProtectedRoute role="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/feedback"
            element={
              <ProtectedRoute role="admin">
                <FeedbackReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/teacher"
            element={
              <ProtectedRoute role="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/teacher/homework"
            element={
              <ProtectedRoute role="teacher">
                <HomeworkManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/teacher/classes"
            element={
              <ProtectedRoute role="teacher">
                <ClassSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/teacher/reports"
            element={
              <ProtectedRoute role="teacher">
                <TeacherReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/socialmedia"
            element={
              <ProtectedRoute role="socialmedia">
                <SocialMediaDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/videoeditor"
            element={
              <ProtectedRoute role="videoeditor">
                <VideoEditorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/student/classes"
            element={
              <ProtectedRoute role="student">
                <StudentClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/student/homework"
            element={
              <ProtectedRoute role="student">
                <StudentHomework />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/student/attendance"
            element={
              <ProtectedRoute role="student">
                <StudentAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/student/notices"
            element={
              <ProtectedRoute role="student">
                <StudentNotices />
              </ProtectedRoute>
            }
          />  
          <Route
            path="/dashboard/socialmedia/scheduler"
            element={
              <ProtectedRoute role="socialmedia">
                <SocialMediaScheduler />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/socialmedia/ideas"
            element={
              <ProtectedRoute role="socialmedia">
                <SocialMediaIdeas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/socialmedia/analytics"
            element={
              <ProtectedRoute role="socialmedia">
                <SocialMediaAnalytics />
              </ProtectedRoute>
            }
          />  



        </Routes>
      </AuthProvider>
  );
}

export default App;
