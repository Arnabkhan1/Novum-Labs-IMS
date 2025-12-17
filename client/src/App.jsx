// client/src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from "./components/Layout"; 
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";

function App() {
  return (
    <Routes>
      {/* 1. Login Page (Layout এর বাইরে) */}
      <Route path="/" element={<Login />} />

      {/* 2. Protected Routes (Layout এর ভেতরে) */}
      {/* এর ভেতরে যা থাকবে, সবগুলোতে Sidebar & Navbar থাকবে */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/edit-student/:id" element={<EditStudent />} />
      </Route>

    </Routes>
  );
}

export default App;