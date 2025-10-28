import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import NotificationBell from "../components/NotificationBell";
import ChatBox from "../components/ChatBox";
import Toast from "../components/Toast";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#002F6C] to-[#0077C8] text-white relative">
      {/* Sidebar */}
      <Sidebar role={user?.role} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col backdrop-blur-3xl bg-white/10 border-l border-white/10 shadow-inner relative overflow-hidden rounded-l-3xl">
        <Navbar name={user?.name} role={user?.role} />

        {/* 🔔 Notification Bell */}
        <div className="absolute top-4 right-6 z-50">
          <NotificationBell />
        </div>

        {/* 📄 Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>

        {/* 💬 Chat System */}
        <ChatBox />

        {/* ⚠️ Offline Notice */}
        {!navigator.onLine && (
          <Toast message="⚠️ You're offline. Some features may not work until reconnect." />
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
