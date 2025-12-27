import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages Import
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddStudent from './pages/AddStudent';
import StudentsList from './pages/StudentsList';
import AddTeacher from './pages/AddTeacher';
import Schedule from './pages/Schedule';
import Roadmap from './pages/Roadmap';
import EditStudent from './pages/EditStudent';
import StudentCourses from './pages/StudentCourses';

function App() {
  return (
    <Routes>
      {/* 1. Login Page (Public) */}
      <Route path="/login" element={<Login />} />

      {/* 2. Protected Routes (Login করা থাকলে ঢুকতে পারবে) */}
      <Route element={<ProtectedRoute />}>
        
        {/* 3. Layout (এর ভেতরে সাইডবার আছে) */}
        <Route element={<Layout />}>
           {/* 4. Dashboard & Other Pages */}
           <Route path="/" element={<Dashboard />} />
           <Route path="/students" element={<StudentsList />} />
           <Route path="/add-student" element={<AddStudent />} />
           <Route path="/add-teacher" element={<AddTeacher />} />
           <Route path="/schedule" element={<Schedule />} />
           <Route path="/roadmap" element={<Roadmap />} />
           <Route path="/edit-student/:id" element={<EditStudent />} />
           <Route path="/student-courses" element={<StudentCourses />} />
        </Route>

      </Route>

      {/* ভুল লিংকে গেলে ড্যাশবোর্ডে পাঠাবে */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;