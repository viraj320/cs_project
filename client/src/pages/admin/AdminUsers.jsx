import React, { useEffect, useState } from "react";
import API from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "user" });
  const [saveError, setSaveError] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await API.get("/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Failed to load users.";
      setError(msg);
      setUsers([]);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name || "", email: user.email || "", role: user.role || "user" });
    setSaveError(null);
    setIsEditing(true);
  };

  const closeEdit = () => {
    setIsEditing(false);
    setEditUser(null);
    setForm({ name: "", email: "", role: "user" });
    setSaveError(null);
  };

  const saveEdit = async () => {
    if (!editUser) return;
    setSaveError(null);
    const payload = { name: form.name, email: form.email, role: form.role };
    try {
      // Attempt to call server update endpoint using admin token.
      const token = localStorage.getItem("token");
      await API.put(`/auth/users/${editUser._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update local list optimistically
      setUsers((prev) => prev.map((u) => (u._id === editUser._id ? { ...u, ...payload } : u)));
      closeEdit();
    } catch (e) {
      // If server endpoint doesn't exist, still update locally and show a warning
      console.error(e);
      setUsers((prev) => prev.map((u) => (u._id === editUser._id ? { ...u, ...payload } : u)));
      const msg = e.response?.data?.message || e.message || "Server update failed.";
      setSaveError(`Saved locally — server error: ${msg}`);
      // Keep modal open so admin can retry or cancel
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow-sm">
        <div className="text-center text-gray-600">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded shadow-sm">
        <div className="text-red-600 font-semibold">{error}</div>
        <button
          onClick={loadUsers}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">All Users</h2>
        <button
          onClick={loadUsers}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Joined</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{user.name || "—"}</td>
                  <td className="px-4 py-3 text-sm">{user.email || "—"}</td>
                  <td className="px-4 py-3 text-sm">{user.phone || "—"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "garage_owner"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => openEdit(user)}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Edit Modal */}
      {isEditing && editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="mt-1 w-full border rounded px-3 py-2"
                >
                  <option value="user">user</option>
                  <option value="garage_owner">garage_owner</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeEdit}
                className="px-4 py-2 mr-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
            {saveError && (
              <div className="mt-3 text-sm text-red-600">{saveError}</div>
            )}
          </div>
        </div>
      )}
      <div className="mt-4 text-sm text-gray-600">
        Total Users: <span className="font-semibold">{users.length}</span>
      </div>
    </div>
  );
};

export default AdminUsers;