import { useEffect, useState } from "react";
import api from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const { data } = await api.get("/admin/users");
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    await api.put(`/admin/role/${id}`, { role: newRole });
    fetchUsers();
  };

  const handleDeactivate = async (id) => {
    await api.put(`/admin/deactivate/${id}`);
    fetchUsers();
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold mb-6">👥 User Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white/10 border border-white/20 rounded-xl">
          <thead className="bg-white/20">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-white/20">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2 capitalize">{u.role}</td>
                <td
                  className={`p-2 ${
                    u.status === "active" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {u.status}
                </td>
                <td className="p-2 flex gap-2">
                  <select
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    value={u.role}
                    className="bg-white/10 text-white rounded p-1"
                  >
                    {[
                      "superadmin",
                      "admin",
                      "coordinator",
                      "teacher",
                      "student",
                      "socialmedia",
                      "videoeditor",
                    ].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDeactivate(u._id)}
                    className="bg-red-500/80 hover:bg-red-600 text-white px-3 py-1 rounded-xl"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
