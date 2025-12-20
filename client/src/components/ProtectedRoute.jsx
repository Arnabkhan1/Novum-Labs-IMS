import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  // ১. loading স্টেটটি এখানে অবশ্যই আনতে হবে
  const { user, loading } = useContext(AuthContext);

  // ২. যদি অ্যাপ এখনো লোডিং অবস্থায় থাকে (চেক করছে লগইন আছে কিনা), তবে অপেক্ষা করো
  if (loading) {
    return (
        <div className="h-screen flex justify-center items-center bg-novum-dark text-novum-cyan">
           <p className="animate-pulse font-bold">Checking Access...</p>
        </div>
    );
  }

  // ৩. যদি ইউজার না থাকে, তবে লগইন পেজে পাঠাও
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ৪. যদি রোল পারমিশন না থাকে (অপশনাল)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ৫. সব ঠিক থাকলে পেজ দেখাও
  return <Outlet />;
};

export default ProtectedRoute;