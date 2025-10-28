import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ role }) => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const coordinatorMenu = [
        { name: "Dashboard", path: "/dashboard/coordinator" },
        { name: "Class Scheduler", path: "/dashboard/coordinator/scheduler" },
        { name: "Attendance Manager", path: "/dashboard/coordinator/attendance" },
        { name: "Announcements", path: "/dashboard/coordinator/announcements" },
        { name: "Reports", path: "/dashboard/coordinator/reports" },
    ];
    const adminMenu = [
        { name: "Dashboard", path: "/dashboard/admin" },
        { name: "User Management", path: "/dashboard/admin/users" },
        { name: "Role Assignment", path: "/dashboard/admin/roles" },
        { name: "Courses", path: "/dashboard/admin/courses" },
        { name: "Batches", path: "/dashboard/admin/batches" },
        { name: "Feedback Reports", path: "/dashboard/admin/feedback" },
    ];
    // ✅ Teacher Menu (NEW)
    const teacherMenu = [
        { name: "Dashboard", path: "/dashboard/teacher" },
        { name: "Homework Manager", path: "/dashboard/teacher/homework" },
        { name: "Class Schedule", path: "/dashboard/teacher/classes" },
        { name: "Reports", path: "/dashboard/teacher/reports" },
    ];
    // 🧱 Social Media Handler Menu
    const socialMediaMenu = [
        { name: "Dashboard", path: "/dashboard/socialmedia" },
        { name: "Post Scheduler", path: "/dashboard/socialmedia/scheduler" },
        { name: "Content Ideas", path: "/dashboard/socialmedia/ideas" },
        { name: "Analytics", path: "/dashboard/socialmedia/analytics" },
    ];

    // 🧱 Video Editor Menu
    const videoEditorMenu = [
        { name: "Dashboard", path: "/dashboard/videoeditor" },
        { name: "Shoot Planner", path: "/dashboard/videoeditor/shoots" },
        { name: "Video Tasks", path: "/dashboard/videoeditor/tasks" },
        { name: "AI Tools", path: "/dashboard/videoeditor/ai-tools" },
    ];

    // 🧱 SuperAdmin Menu
    const superAdminMenu = [
        { name: "Dashboard", path: "/dashboard/superadmin" },
        { name: "All Users", path: "/dashboard/superadmin/users" },
        { name: "System Reports", path: "/dashboard/superadmin/reports" },
        { name: "Settings", path: "/dashboard/superadmin/settings" },
    ];
    // 🧱 Student Menu
    const studentMenu = [
        { name: "Dashboard", path: "/dashboard/student" },
        { name: "Classes", path: "/dashboard/student/classes" },
        { name: "Homework", path: "/dashboard/student/homework" },
        { name: "Attendance", path: "/dashboard/student/attendance" },
        { name: "Notices", path: "/dashboard/student/notices" },
    ];

    let menuItems = [];
    if (role === "coordinator") menuItems = coordinatorMenu;
    else if (role === "admin") menuItems = adminMenu;
    else if (role === "teacher") menuItems = teacherMenu;
    else if (role === "socialmedia") menuItems = socialMediaMenu;
    else if (role === "videoeditor") menuItems = videoEditorMenu;
    else if (role === "superadmin") menuItems = superAdminMenu;
    else if (role === "student") menuItems = studentMenu;


    return (
        <aside className="w-64 hidden md:flex flex-col backdrop-blur-2xl bg-white/10 border-r border-white/20 p-4 space-y-4">
            <div className="text-2xl font-bold text-[#7ED6F4] mb-6 text-center">
                Novum IMS
            </div>

            {menuItems.map((item) => (
                <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="w-full text-left px-4 py-2 rounded-xl hover:bg-white/20 transition"
                >
                    {item.name}
                </button>
            ))}

            <div className="mt-auto">
                <button
                    onClick={logout}
                    className="w-full px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-xl transition"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
